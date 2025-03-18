# DataPizza AI Chatbot

A full-stack application that allows users to ask questions to a chatbot based on AI generative models (simulated at backend) and receive responses with an added fact-checking feature.

## Features

- React frontend with TypeScript and Tailwind CSS
- FastAPI backend with simulated AI responses
- Simulated cache for responses
- Fact-checking feature with reference documents
- Docker containerization for easy deployment

## Project Structure

```
datapizza-fullstack-test/
├── backend/               # Python FastAPI backend
│   ├── app/               # Application code
│   │   ├── __init__.py
│   │   └── main.py        # Main API endpoints
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── run.py             # Entry point
├── frontend/              # React frontend
│   ├── src/               # Source code
│   │   ├── App.tsx        # Main application component
│   │   └── ...
│   ├── Dockerfile
│   └── ...
└── docker-compose.yml     # Docker Compose configuration
```

## Docker Setup

### Development

To run the application in development mode with hot reloading:

```bash
# Start the development environment
docker compose up -d

# View logs
docker compose logs -f

# Stop the containers
docker compose down
```

The development environment will be available at:

- Frontend: http://localhost:5173 (Vite dev server with HMR)
- Backend API: http://localhost:8000

### Production

To run the application in production mode:

```bash
# Build and start the production environment
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop the containers
docker compose -f docker-compose.prod.yml down
```

The production environment will be available at:

- Frontend: http://localhost:80 (Nginx serving built assets)
- Backend API: http://localhost:8000 (also available via /api proxy)

## Docker Architecture

The application uses a multi-container setup:

### Development

- **Frontend**: Uses Bun with Vite for hot module replacement
- **Backend**: Uses FastAPI with auto-reload for quick development

### Production

- **Frontend**: Built with Vite and served by Nginx with optimized configuration
- **Backend**: Optimized Python container with security best practices

## API Endpoints

- `POST /generate`: Receives a query and returns a simulated AI response
- `GET /documents`: Returns a list of reference documents for fact-checking
