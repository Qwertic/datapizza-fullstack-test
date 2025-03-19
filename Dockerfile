# Multi-stage build for datapizza-fullstack application

# Stage 1: Build the frontend
FROM oven/bun:1.2.4 as frontend-builder

WORKDIR /app

# Copy package.json and lock file for better caching
COPY frontend/package.json frontend/bun.lock ./

# Install dependencies
RUN bun install

# Copy frontend source code
COPY frontend/ ./

# Build the frontend
RUN bun run build

# Debug - list dist contents to verify build output
RUN ls -la dist

# Stage 2: Final image with both frontend and backend
FROM python:3.13-slim

# Install Nginx and curl for debugging
RUN apt-get update && apt-get install -y nginx curl && \
    rm -rf /var/lib/apt/lists/*

# Copy uv directly from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV ENVIRONMENT=production
ENV PORT=8080
ENV UV_SYSTEM_PYTHON=1

# Remove default Nginx configuration
RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-available/default

# Create correct Nginx configuration directories if they don't exist
RUN mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

# Copy Nginx configuration
WORKDIR /app
COPY frontend/nginx.conf /etc/nginx/sites-available/app.conf
RUN ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/

# Copy the built frontend from the builder stage
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Set permissions for nginx
RUN chown -R www-data:www-data /usr/share/nginx/html

# Debug - verify frontend files were copied correctly
RUN ls -la /usr/share/nginx/html

# Set up backend
WORKDIR /app/backend

# Copy backend requirements files first
COPY backend/pyproject.toml backend/uv.lock ./

# Install backend dependencies using uv directly from the lock file
# Using --system flag to install in the system environment (no venv)
RUN uv pip install --system .

# Copy backend application code
COPY backend/app ./app/
COPY backend/run.py .

# Create startup script
WORKDIR /app
RUN echo '#!/bin/bash\n\
# Start the backend API\n\
cd /app/backend\n\
echo "Starting backend service..."\n\
python run.py &\n\
BACKEND_PID=$!\n\
\n\
# Start Nginx for the frontend\n\
echo "Starting Nginx..."\n\
nginx -g "daemon off;"\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 80 8000

# Start both services
CMD ["/app/start.sh"]
