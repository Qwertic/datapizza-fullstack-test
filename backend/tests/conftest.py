import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
import asyncio
from fastapi import FastAPI
from httpx import ASGITransport
from app.main import app

@pytest.fixture
def client():
    """Return a test client for the app."""
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
async def async_client():
    """Return an async test client for the app."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close() 