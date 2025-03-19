/**
 * Mock implementation of the queries module
 */
import { mockDocuments, mockGenerateResponse, mockStreamChunks } from "./mocks";
import type { Message, StreamChunk } from "../../src/lib/queries";

// To simulate errors, we can use these flags
let shouldFetchFail = false;
let shouldGenerateFail = false;
let errorMessage = "Something went wrong";

/**
 * Reset all error flags to their default state
 */
export function resetErrors() {
  shouldFetchFail = false;
  shouldGenerateFail = false;
  errorMessage = "Something went wrong";
}

/**
 * Configure the fetch documents function to fail
 */
export function setFetchShouldFail(
  fail: boolean,
  message = "Failed to fetch documents"
) {
  shouldFetchFail = fail;
  errorMessage = message;
}

/**
 * Configure the generate function to fail
 */
export function setGenerateShouldFail(
  fail: boolean,
  message = "Failed to generate response"
) {
  shouldGenerateFail = fail;
  errorMessage = message;
}

/**
 * Mock implementation of fetchDocuments
 */
export async function fetchDocuments() {
  if (shouldFetchFail) {
    throw new Error(errorMessage);
  }

  return {
    data: mockDocuments,
  };
}

/**
 * Mock implementation of generate
 */
export async function generate(
  _prompt: Message,
  onChunk?: (chunk: StreamChunk) => void
) {
  if (shouldGenerateFail) {
    throw new Error(errorMessage);
  }

  if (onChunk) {
    // For streaming mode
    for (const chunk of mockStreamChunks) {
      onChunk(chunk);
      // Small delay to simulate streaming
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    return {
      data: { response: mockStreamChunks[mockStreamChunks.length - 1].text },
    };
  }

  // For regular mode
  return {
    data: mockGenerateResponse.response,
  };
}
