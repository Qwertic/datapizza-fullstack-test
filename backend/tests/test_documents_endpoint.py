import pytest
from fastapi import status
from fastapi.testclient import TestClient


class TestDocumentsEndpoint:
    def test_get_documents_success(self, client: TestClient):
        """Test that the documents endpoint returns a successful response."""
        response = client.get("/documents")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        # Verify response structure
        assert "documents" in data
        assert "count" in data
        assert "timestamp" in data

        # Verify documents array
        assert isinstance(data["documents"], list)
        assert len(data["documents"]) > 0
        assert data["count"] == len(data["documents"])

        # Verify document structure
        document = data["documents"][0]
        assert "title" in document
        assert "content" in document

    def test_document_count_matches(self, client: TestClient):
        """Test that the count in the response matches the number of documents."""
        response = client.get("/documents")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        # Verify count matches actual number of documents
        assert data["count"] == len(data["documents"])

    def test_documents_have_required_fields(self, client: TestClient):
        """Test that all documents have the required fields."""
        response = client.get("/documents")

        assert response.status_code == status.HTTP_200_OK
        data = response.json()

        # Check each document has required fields
        for document in data["documents"]:
            assert "title" in document
            assert "content" in document
            assert isinstance(document["title"], str)
            assert isinstance(document["content"], str)
            assert document["title"] != ""
            assert document["content"] != ""
