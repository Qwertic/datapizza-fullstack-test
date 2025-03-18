FROM oven/bun:1.2.4 as build

WORKDIR /app

# Copy package.json first
COPY package.json .

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Add nginx configuration to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 