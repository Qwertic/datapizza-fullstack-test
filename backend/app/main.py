from fastapi import FastAPI, Body, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import asyncio
from typing import Dict, List, Optional, Any, AsyncGenerator
import json
from pydantic import BaseModel, Field
from datetime import datetime
import random


# Request and response models
class QueryRequest(BaseModel):
    query: str = Field(..., description="The user's question to the AI model")


class ErrorResponse(BaseModel):
    status_code: int
    error: str
    detail: Optional[str] = None
    timestamp: str


class GenerateResponse(BaseModel):
    response: str
    source: str = "DataPizza AI"
    timestamp: str
    cached: bool


class Document(BaseModel):
    title: str
    content: str


class DocumentsResponse(BaseModel):
    documents: List[Document]
    count: int
    timestamp: str


app = FastAPI(
    title="DataPizza AI Chatbot API",
    description="An API for interacting with the DataPizza AI chatbot",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend dev URL
        "http://localhost",  # Frontend Docker URL
        "http://frontend",  # Frontend service name in Docker
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated cache using a dictionary
cache: Dict[str, str] = {}

# Mock documents
documents = [
    {
        "title": "DataPizza Overview",
        "content": "DataPizza è un'azienda innovativa che sviluppa soluzioni AI avanzate per l'analisi dei dati.",
    },
    {
        "title": "Technical Tests",
        "content": "I test tecnici di DataPizza sono progettati per valutare le competenze dei candidati in scenari reali.",
    },
    {
        "title": "AI Technologies",
        "content": "DataPizza usa technologie avanzate di AI per consegnare soluzioni innovative ai clienti.",
    },
    {
        "title": "Company Culture",
        "content": "DataPizza fomenta una cultura di innovazione, collaborazione e apprendimento continuo.",
    },
]


# Helper function to get current timestamp
def get_timestamp() -> str:
    return datetime.now().isoformat()


# Simulate delay for cache operations
async def simulate_delay():
    await asyncio.sleep(2)


# Dependency for error handling
async def handle_errors(call_next):
    try:
        return await call_next()
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ErrorResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                error="Internal Server Error",
                detail=str(e),
                timestamp=get_timestamp(),
            ).dict(),
        )


# Function to stream response chunks
async def stream_response(response: str) -> AsyncGenerator[bytes, None]:
    """Stream a response in chunks to simulate a real-time AI response."""
    words = response.split()
    for i, word in enumerate(words):
        # Add the word with space (except for the last word)
        chunk = word + (" " if i < len(words) - 1 else "")

        # Create a JSON chunk with the delta (new text) and full text so far
        data = {
            "delta": chunk,
            "text": " ".join(words[: i + 1]) + (" " if i < len(words) - 1 else ""),
            "done": i == len(words) - 1,
        }

        # Convert to JSON and yield
        yield f"data: {json.dumps(data)}\n\n"

        # Random delay between words (50-150ms) to simulate typing
        await asyncio.sleep(random.uniform(0.05, 0.15))

    # Send a done message
    yield f"data: {json.dumps({'done': True})}\n\n"


@app.post("/generate")
async def generate_response(request: QueryRequest, stream: bool = False):
    """Generate a response to the user's query from the AI model with optional streaming"""
    query = request.query

    if not query or query.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query is required and cannot be empty",
        )

    # Check if response is in cache
    is_cached = query in cache

    try:
        if is_cached:
            # We imediately return if query is cached
            response = cache[query]
        else:
            # Simulate AI model response generation
            await simulate_delay()

            # Generate a mock response
            response = f"Certo che conosco DataPizza, è una realtà fighissima! DataPizza è un'azienda innovativa che sviluppa soluzioni AI avanzate."

            # Store in cache
            cache[query] = response

        # If streaming is requested, return a streaming response
        if stream:
            return StreamingResponse(
                stream_response(response), media_type="text/event-stream"
            )

        # Otherwise return a regular JSON response
        return GenerateResponse(
            response=response, timestamp=get_timestamp(), cached=is_cached
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating response: {str(e)}",
        )


@app.get("/documents", response_model=DocumentsResponse, status_code=status.HTTP_200_OK)
async def get_documents():
    """Retrieve reference documents for fact checking"""
    try:
        # Add delay to simulate API latency
        await simulate_delay()

        return DocumentsResponse(
            documents=documents, count=len(documents), timestamp=get_timestamp()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving documents: {str(e)}",
        )


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            status_code=exc.status_code, error=exc.detail, timestamp=get_timestamp()
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error="Internal Server Error",
            detail=str(exc),
            timestamp=get_timestamp(),
        ).model_dump(),
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
