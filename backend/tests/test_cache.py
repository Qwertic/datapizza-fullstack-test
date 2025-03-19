import pytest
from fastapi import status
from fastapi.testclient import TestClient
import time


class TestCacheFunctionality:
    def test_cache_persistence(self, client: TestClient):
        """Test that the cache persists between requests."""
        query = "Does DataPizza use AI?"

        # First request (not cached)
        response1 = client.post("/generate", json={"query": query})
        assert response1.status_code == status.HTTP_200_OK
        data1 = response1.json()
        assert data1["cached"] is False
        response_text = data1["response"]

        # Second request (should be cached)
        response2 = client.post("/generate", json={"query": query})
        assert response2.status_code == status.HTTP_200_OK
        data2 = response2.json()
        assert data2["cached"] is True
        assert data2["response"] == response_text

    def test_cache_performance(self, client: TestClient):
        """Test that cached responses are faster."""
        query = "What technologies does DataPizza use?"

        # First request (not cached) - should be slower
        start_time1 = time.time()
        response1 = client.post("/generate", json={"query": query})
        end_time1 = time.time()
        first_request_time = end_time1 - start_time1
        assert response1.status_code == status.HTTP_200_OK
        assert response1.json()["cached"] is False

        # Second request (cached) - should be faster
        start_time2 = time.time()
        response2 = client.post("/generate", json={"query": query})
        end_time2 = time.time()
        second_request_time = end_time2 - start_time2
        assert response2.status_code == status.HTTP_200_OK
        assert response2.json()["cached"] is True

        # The cached response should be significantly faster
        # But we'll allow a bit of flexibility for test environments
        assert second_request_time < first_request_time

    def test_different_queries_not_cached(self, client: TestClient):
        """Test that different queries have different cache status."""
        # First query
        query1 = "Tell me about DataPizza company"
        response1 = client.post("/generate", json={"query": query1})
        assert response1.status_code == status.HTTP_200_OK
        assert response1.json()["cached"] is False

        # Second query (different, should not be cached)
        query2 = "What services does DataPizza offer?"
        response2 = client.post("/generate", json={"query": query2})
        assert response2.status_code == status.HTTP_200_OK
        assert response2.json()["cached"] is False

        # Repeat first query (should now be cached)
        response3 = client.post("/generate", json={"query": query1})
        assert response3.status_code == status.HTTP_200_OK
        assert response3.json()["cached"] is True
