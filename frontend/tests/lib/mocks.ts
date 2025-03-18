/**
 * Mock data and utility functions for testing
 */

// Mock document response
export const mockDocuments = [
  {
    title: "DataPizza Overview",
    content:
      "DataPizza è un'azienda innovativa che sviluppa soluzioni AI avanzate per l'analisi dei dati.",
  },
  {
    title: "Technical Tests",
    content:
      "I test tecnici di DataPizza sono progettati per valutare le competenze dei candidati in scenari reali.",
  },
];

// Mock response for generate API
export const mockGenerateResponse = {
  response:
    "Certo che conosco DataPizza, è una realtà fighissima! DataPizza è un'azienda innovativa che sviluppa soluzioni AI avanzate.",
  source: "DataPizza AI",
  timestamp: "2023-06-10T12:00:00Z",
  cached: false,
};

// Mock StreamChunk for testing streaming responses
export const mockStreamChunks = [
  { delta: "Certo ", text: "Certo ", done: false },
  { delta: "che ", text: "Certo che ", done: false },
  { delta: "conosco ", text: "Certo che conosco ", done: false },
  { delta: "DataPizza!", text: "Certo che conosco DataPizza!", done: true },
];

// Mock fetch Response for streaming tests
export function createMockStreamResponse() {
  const chunks = mockStreamChunks
    .map((chunk) => {
      return `data: ${JSON.stringify(chunk)}\n\n`;
    })
    .join("");

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(chunks));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}

// Mock axios for non-streaming tests
export const mockAxios = {
  get: async (url: string) => {
    if (url.includes("/documents")) {
      return {
        data: {
          documents: mockDocuments,
          count: mockDocuments.length,
          timestamp: "2023-06-10T12:00:00Z",
        },
      };
    }
    throw new Error(`Unexpected URL: ${url}`);
  },
  post: async (url: string) => {
    if (url.includes("/generate")) {
      return { data: mockGenerateResponse };
    }
    throw new Error(`Unexpected URL: ${url}`);
  },
};

// Mock fetch for streaming tests
export function setupMockFetch() {
  // Save original fetch
  const originalFetch = globalThis.fetch;

  // Replace fetch with mock
  globalThis.fetch = async (url: string | URL | Request) => {
    const urlString = url.toString();

    if (urlString.includes("/generate") && urlString.includes("stream=true")) {
      return createMockStreamResponse();
    }

    throw new Error(`Unexpected fetch URL: ${urlString}`);
  };

  // Return cleanup function
  return () => {
    globalThis.fetch = originalFetch;
  };
}
