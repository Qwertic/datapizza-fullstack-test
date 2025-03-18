FROM python:3.13-slim

WORKDIR /app

# Copy project files
COPY pyproject.toml .
COPY app/ ./app/
COPY run.py .

# Install dependencies directly with pip
RUN pip install -e .

EXPOSE 8000

CMD ["python", "run.py"] 