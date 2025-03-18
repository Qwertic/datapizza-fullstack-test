# Frontend Tests

This directory contains tests for the frontend code using Bun's built-in test runner.

## Running Tests

To run all tests:

```bash
# From the project root
cd frontend
bun test
```

Or using npm script:

```bash
# From the project root
cd frontend
npm test
```

## Test Structure

- `lib/`: Tests for utility functions and API clients
  - `mock-queries.test.ts`: Tests for API client using mocked implementations
  - `mocks.ts`: Mock data and utilities for testing
  - `mock-queries.ts`: Mocked implementations of API client functions

## Testing Approach

The tests use a mocked implementation approach instead of mocking external dependencies. This makes tests more resilient to implementation changes and easier to maintain.

For example, instead of mocking `axios` and all browser globals, we created simplified implementations of the API functions that use our mock data directly.

### Error Handling

The tests include scenarios for error handling:

- Network errors when fetching documents
- Failures during response generation
- Connection issues during streaming responses

This is implemented by adding flags in our mock implementations that can be toggled to simulate different error scenarios.

## Writing Tests

Tests use Bun's built-in test framework. For more information, see the [Bun testing documentation](https://bun.sh/docs/test/writing).

Example test:

```typescript
import { test, expect, describe } from "bun:test";

describe("My Feature", () => {
  test("should work correctly", () => {
    const result = someFunction();
    expect(result).toBe(expectedValue);
  });

  test("should handle errors", async () => {
    // Configure the function to fail
    setShouldFail(true);

    // Test that it rejects with an error
    await expect(someAsyncFunction()).rejects.toThrow();
  });
});
```
