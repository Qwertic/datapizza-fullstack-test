# Backend Documentation

The backend of the DataPizza AI Chatbot is built using Python and FastAPI. It provides two main endpoints:

1. **POST /generate**: This endpoint receives a JSON input with a query field (the user's question). It simulates a response from an AI model and returns a JSON object with the response. The backend also has a simulated cache through a Python dictionary with key-value pairs. Every time this endpoint is called, it checks if there's already a response associated with the user's question. If it exists, it returns that response immediately. Otherwise, it simulates a new response, saves it in the cache, and returns it to the frontend.

2. **GET /documents**: This endpoint returns a list of hardcoded documents without any input parameters. This is used for the fact-checking feature of the chatbot.

The backend also implements a mechanism to simulate a 2-second wait for both reading and writing operations on the cache. This allows it to handle asynchronous operations efficiently and ensure that multiple simultaneous requests from different users are handled correctly.

The simulated cache is accessible asynchronously using asyncio.

## Technologies Used

The backend is built using the following technologies:

1. Python: The primary programming language used for the backend.
2. FastAPI: A modern, fast (high-performance), web framework for building APIs with Python 3.7+ based on standard Python type hints.

## Project Structure

The backend is structured as follows:

1. **app/**: This directory contains the main application code.

   - \***\*init**.py\*\*: This file initializes the FastAPI application.
   - **main.py**: This file contains the main API endpoints.

2. **Dockerfile**: This file contains the instructions to build the Docker image for the backend.
3. **pyproject.toml**: This file contains the project metadata and dependencies.
4. **run.py**: This file is the entry point for the backend application.

## Running the Backend

To run the backend, you can use the provided Docker setup. Please refer to the Docker Setup section in the main README for more details.

## Testing

The backend includes a comprehensive test suite that verifies the functionality of the API endpoints.

### Setting up the test environment

1. Install the test dependencies:

```bash
# With pip
pip install -e ".[dev]"

# With uv
uv pip install -e ".[dev]"
```

### Running the tests

You can run the tests using pytest:

```bash
# Run all tests with verbose output
pytest -v

# Run a specific test file
pytest tests/test_generate_endpoint.py -v

# Run a specific test
pytest tests/test_generate_endpoint.py::TestGenerateEndpoint::test_generate_response_success -v
```

Or use the provided test script:

```bash
# Run all tests using the script
./tests/run_tests.py
```

### Test Coverage

The test suite covers:

1. **API Endpoints**:

   - `/generate` endpoint for text generation (both regular and streaming)
   - `/documents` endpoint for document retrieval

2. **Error Handling**:

   - Missing query parameters
   - Invalid endpoints
   - Improper HTTP methods
   - Invalid JSON payloads

3. **Caching**:
   - Response caching functionality
   - Cache performance improvements
   - Cache persistence
