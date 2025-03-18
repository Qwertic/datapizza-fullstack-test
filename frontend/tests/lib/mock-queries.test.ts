import { test, expect, describe, beforeEach } from "bun:test";
import { mockDocuments, mockGenerateResponse, mockStreamChunks } from "./mocks";
import {
  generate,
  fetchDocuments,
  setFetchShouldFail,
  setGenerateShouldFail,
  resetErrors,
} from "./mock-queries";
import type { StreamChunk } from "../../src/lib/queries";

describe("API Client Tests (Mocked Implementation)", () => {
  // Reset error flags before each test
  beforeEach(() => {
    resetErrors();
  });

  describe("fetchDocuments", () => {
    test("should fetch documents successfully", async () => {
      const result = await fetchDocuments();

      expect(result).toBeDefined();
      expect(result.data).toEqual(mockDocuments);
    });

    test("should handle errors when fetching documents", async () => {
      // Configure the mock to throw an error
      const errorMsg = "Network error when fetching documents";
      setFetchShouldFail(true, errorMsg);

      // The fetchDocuments call should reject with our error
      await expect(fetchDocuments()).rejects.toThrow(errorMsg);
    });
  });

  describe("generate", () => {
    test("should generate a response for regular request", async () => {
      const prompt = { text: "Tell me about DataPizza", isUser: true };

      const result = await generate(prompt);

      expect(result).toBeDefined();
      expect(result.data).toEqual(mockGenerateResponse.response);
    });

    test("should handle streaming responses", async () => {
      const prompt = { text: "Tell me about DataPizza", isUser: true };
      const receivedChunks: StreamChunk[] = [];

      // Call generate with a streaming handler
      const result = await generate(prompt, (chunk) => {
        receivedChunks.push(chunk);
      });

      // Verify all chunks were received
      expect(receivedChunks.length).toEqual(mockStreamChunks.length);

      // Verify the first and last chunks
      expect(receivedChunks[0].delta).toEqual(mockStreamChunks[0].delta);
      expect(receivedChunks[receivedChunks.length - 1].done).toEqual(true);

      // Verify result
      expect(result).toBeDefined();
    });

    test("should handle errors during generation", async () => {
      // Configure the mock to throw an error
      const errorMsg = "AI model failed to generate response";
      setGenerateShouldFail(true, errorMsg);

      const prompt = { text: "Error prompt", isUser: true };

      // The generate call should reject with our error
      await expect(generate(prompt)).rejects.toThrow(errorMsg);
    });

    test("should handle errors during streaming generation", async () => {
      // Configure the mock to throw an error
      const errorMsg = "Connection lost during streaming";
      setGenerateShouldFail(true, errorMsg);

      const prompt = { text: "Error prompt", isUser: true };
      // Using an empty function as the handler is sufficient for this test
      const streamHandler = () => {};

      // The streaming generate call should reject with our error
      await expect(generate(prompt, streamHandler)).rejects.toThrow(errorMsg);
    });
  });
});
