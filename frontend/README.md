# Frontend Application Documentation

The frontend application is built using React, TypeScript, and Tailwind CSS. It is designed to interact with the FastAPI backend to provide a seamless user experience for querying and fact-checking.

## Technical Specifications

- **Frontend Framework:** React
- **Programming Language:** TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Development Server:** Bun with Vite for hot module replacement
- **Testing:** Bun's built-in test runner

## Key Features

- **Query Input:** A text field for users to input their questions.
- **AI Response:** A section to display the response from the AI model, which can be optionally displayed in streaming mode.
- **Document Viewer:** A feature to display a list of reference documents for fact-checking purposes.
- **Streaming Mode:** Optional feature to display the AI response in real-time as it is generated.

## Development and Deployment

- **Development Environment:** The application can be run in development mode using `docker compose up -d`. This will start the frontend and backend services with hot reloading enabled.
- **Production Environment:** The application can be run in production mode using `docker compose -f docker-compose.prod.yml up -d --build`. This will build and start the frontend and backend services in optimized configurations.
- **Frontend URL:** The frontend application is accessible at `http://localhost:5173` in development mode and `http://localhost:80` in production mode.
- **Backend API URL:** The backend API is accessible at `http://localhost:8000` in both development and production modes.

## Testing

The frontend includes tests to ensure the reliability of critical components:

- **Running Tests:** Execute `bun test` or `npm test` to run all tests.
- **Test Coverage:** Tests focus on critical parts of the application, such as the API client and query handling.
- **Test Directory:** All tests are located in the `tests/` directory with a structure that mirrors the source code.

For more information about testing, see the [tests/README.md](./tests/README.md) file.

## Useful Information

- **Cache Simulation:** The backend simulates a cache using a Python dictionary with key-value pairs. This cache is accessible asynchronously using asyncio and includes a 2-second wait for both reading and writing operations.
- **Fact-Checking:** The application includes a fact-checking feature that allows users to compare the statements in the chatbot's response with the information contained in the reference documents.
- **Layout:** The layout for presenting the documents is designed to be user-friendly and easily accessible.
