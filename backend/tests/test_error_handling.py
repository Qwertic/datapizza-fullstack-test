import pytest
from fastapi import status
from fastapi.testclient import TestClient
import json


class TestErrorHandling:
    def test_invalid_endpoint(self, client: TestClient):
        """Test that invalid endpoints return a 404 error."""
        response = client.get("/invalid_endpoint")

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_method_not_allowed(self, client: TestClient):
        """Test that using wrong HTTP method returns a 405 error."""
        response = client.get("/generate")

        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_invalid_json(self, client: TestClient):
        """Test that invalid JSON payloads return an error."""
        response = client.post(
            "/generate",
            headers={"Content-Type": "application/json"},
            content="invalid json content",
        )

        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_error_response_format(self, client: TestClient):
        """Test that error responses follow the expected format."""
        response = client.post("/generate", json={"query": ""})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        data = response.json()

        # Verify error response structure
        assert "status_code" in data
        assert "error" in data
        assert "timestamp" in data

        # Verify values
        assert data["status_code"] == status.HTTP_400_BAD_REQUEST
