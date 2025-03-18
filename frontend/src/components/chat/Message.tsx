import { useState } from "react";
import { fetchDocuments, type Document } from "../../lib/queries";
import { DocumentViewer } from "./DocumentViewer";
import { SparkleIcon, Loader2 } from "lucide-react";

interface MessageProps {
  text: string;
  isUser: boolean;
  isStreaming?: boolean;
  isGenerating?: boolean;
  isLast?: boolean;
}

export function Message({
  text,
  isUser,
  isStreaming = false,
  isGenerating = false,
  isLast = false,
}: MessageProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleDocuments = async () => {
    // If opening documents and we don't have any yet, fetch them
    if (!isDocumentsOpen && documents.length === 0) {
      setIsLoading(true);
      try {
        const response = await fetchDocuments();
        if (response && response.data) {
          setDocuments(response.data);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Toggle documents visibility
    setIsDocumentsOpen(!isDocumentsOpen);
  };

  return (
    <div className="mb-4">
      {isUser ? (
        // User message - right aligned
        <div className="flex justify-end">
          <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
            <p>{text}</p>
          </div>
        </div>
      ) : (
        // Bot message - left aligned with icon
        <div className="space-y-2">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground size-8 mr-2">
                {isGenerating && !isStreaming && isLast ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <SparkleIcon size={16} />
                )}
              </div>
            </div>
            <div
              className={`text-muted-foreground rounded-lg px-4 py-2 max-w-[80%] ${
                isStreaming ? "animate-pulse" : ""
              }`}
            >
              <p>{text}</p>
            </div>
          </div>
          {text && !isStreaming && (
            <div className="ml-10">
              <DocumentViewer
                documents={documents}
                isOpen={isDocumentsOpen}
                onToggle={handleToggleDocuments}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
