import axios, { AxiosError } from "axios";

// Types
export interface Message {
  text: string;
  isUser: boolean;
}

export interface Document {
  title: string;
  content: string;
}

export interface StreamChunk {
  delta: string;
  text: string;
  done: boolean;
}

export interface GenerateResponse {
  response: string;
  source: string;
  timestamp: string;
  cached: boolean;
}

export interface DocumentsResponse {
  documents: Document[];
  count: number;
  timestamp: string;
}

export interface ErrorResponse {
  status_code: number;
  error: string;
  detail?: string;
  timestamp: string;
}

// API configuration
const isLocal = window.location.hostname === "localhost";
const apiBaseUrl = isLocal
  ? import.meta.env.VITE_API_URL_LOCAL || "http://localhost:8000"
  : import.meta.env.VITE_API_URL_PROD || "/api";

// Create an axios instance with common configuration
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout to account for the 2-second delay in the backend
});

// Add logging for development
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(
        `API Request: ${config.method?.toUpperCase()} ${config.url}`,
        config.data
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status}`, response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to handle errors
const handleApiError = (error: unknown) => {
  console.error("API Error:", error);

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error("API Error Details:", {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      config: {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
      },
    });

    // Return error message from the API if available
    if (axiosError.response?.data?.error) {
      throw new Error(axiosError.response.data.error);
    }
  }

  // Default error message
  throw new Error("An unexpected error occurred. Please try again later.");
};

// API functions
/**
 * Generate a response from the AI with support for streaming
 * @param prompt The user message
 * @param onChunk Optional callback for handling streaming chunks
 * @returns The AI response
 */
export async function generate(
  prompt: Message,
  onChunk?: (chunk: StreamChunk) => void
) {
  try {
    // If a streaming handler is provided, use streaming mode
    if (onChunk) {
      const response = await fetch(`${apiBaseUrl}/generate?stream=true`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: prompt.text,
        }),
      });

      // Setup event source from the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode and append to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              onChunk(data);

              if (data.done) {
                return { data: { response: data.text } };
              }
            } catch (e) {
              console.error("Error parsing SSE message:", e);
            }
          }
        }
      }

      return { data: { response: "" } };
    }

    // Non-streaming mode
    const { data } = await axios.post(`${apiBaseUrl}/generate`, {
      query: prompt.text,
    });

    return {
      data: data.response,
    };
  } catch (error) {
    handleApiError(error);
  }
}

export async function fetchDocuments() {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/documents`);
    return {
      data: data.documents,
    };
  } catch (error) {
    handleApiError(error);
  }
}
