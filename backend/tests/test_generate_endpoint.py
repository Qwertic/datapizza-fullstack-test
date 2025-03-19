import pytest
from fastapi import status
from fastapi.testclient import TestClient
import json
from httpx import AsyncClient, ASGITransport
from app.main import app


class TestGenerateEndpoint:
    def test_generate_response_success(self, client: TestClient):
        """Test that the generate endpoint returns a successful response."""
        response = client.post("/generate", json={"query": "Tell me about DataPizza"})

        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "response" in data
        assert "timestamp" in data
        assert "cached" in data
        assert "source" in data
        assert data["source"] == "DataPizza AI"
        # First request is not cached
        assert data["cached"] is False

    def test_generate_response_empty_query(self, client: TestClient):
        """Test that the generate endpoint returns an error for empty queries."""
        response = client.post("/generate", json={"query": ""})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        data = response.json()
        assert "error" in data
        assert "timestamp" in data

    def test_generate_response_missing_query(self, client: TestClient):
        """Test that the generate endpoint returns an error for missing query."""
        response = client.post("/generate", json={})

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_generate_response_caching(self, client: TestClient):
        """Test that responses are cached and the cached flag is set."""
        query = "What is DataPizza?"

        # First request should not be cached
        response1 = client.post("/generate", json={"query": query})
        assert response1.status_code == status.HTTP_200_OK
        data1 = response1.json()
        assert data1["cached"] is False

        # Second request with the same query should be cached
        response2 = client.post("/generate", json={"query": query})
        assert response2.status_code == status.HTTP_200_OK
        data2 = response2.json()
        assert data2["cached"] is True

        # Responses should match
        assert data1["response"] == data2["response"]

    @pytest.mark.asyncio
    async def test_generate_streaming_response(self, base_url):
        """Test that streaming responses work correctly."""
        # Create a transport and client for this test
        transport = ASGITransport(app=app)

        async with AsyncClient(transport=transport, base_url=base_url) as client:
            response = await client.post(
                "/generate",
                json={"query": "Tell me about DataPizza"},
                params={"stream": True},
            )

            assert response.status_code == status.HTTP_200_OK
            # Check that the content type starts with "text/event-stream"
            assert response.headers["content-type"].startswith("text/event-stream")

            # Get the content and verify it contains proper SSE format
            content = response.content.decode("utf-8")
            assert content.startswith("data: ")

            # Verify at least one complete chunk is present
            lines = content.split("\n\n")
            assert len(lines) > 0

            # Parse the first chunk
            first_chunk = lines[0].replace("data: ", "")
            chunk_data = json.loads(first_chunk)

            # Verify chunk structure
            assert "delta" in chunk_data
            assert "text" in chunk_data

            # Check for the final done message
            assert any("done" in line for line in lines if line)
