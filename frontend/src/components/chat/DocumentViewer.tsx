import { useState } from "react";
import { type Document } from "../../lib/queries";
import { FileText, X, LoaderCircle, FileSymlink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";

interface DocumentViewerProps {
  documents: Document[];
  isOpen: boolean;
  onToggle: () => void;
  isLoading: boolean;
}

export function DocumentViewer({
  documents,
  isOpen,
  onToggle,
  isLoading,
}: DocumentViewerProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const handleDocumentClick = (doc: Document) => {
    if (selectedDoc?.title === doc.title) {
      // If clicking the same document, toggle it off
      setSelectedDoc(null);
    } else {
      setSelectedDoc(doc);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  onToggle();
                  setSelectedDoc(null);
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : isOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isOpen ? "Hide sources" : "Show sources"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AnimatePresence>
          {isOpen && documents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: 1,
                width: "auto",
                transition: {
                  opacity: { duration: 0.2 },
                  width: { duration: 0.3, ease: "easeOut" },
                },
              }}
              exit={{
                opacity: 0,
                width: 0,
                transition: {
                  opacity: { duration: 0.1 },
                  width: { duration: 0.2, ease: "easeIn" },
                },
              }}
              className="flex items-center overflow-hidden"
              style={{ minWidth: 0 }}
            >
              <div className="flex flex-nowrap">
                {documents.map((doc, index) => (
                  <Popover key={index}>
                    <motion.div
                      key={index}
                      className="flex pr-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                          duration: 0.2,
                          delay: 0.1 + index * 0.05,
                        },
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Badge
                          variant={
                            selectedDoc?.title === doc.title
                              ? "default"
                              : "secondary"
                          }
                          className="cursor-pointer transition-colors whitespace-nowrap border border-transparent hover:border-primary"
                          onClick={() => handleDocumentClick(doc)}
                        >
                          {doc.title}
                        </Badge>
                      </PopoverTrigger>
                    </motion.div>
                    <AnimatePresence>
                      {selectedDoc && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            transition: { duration: 0.3 },
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <PopoverContent>
                            <div className="flex flex-col gap-2 relative">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <Label>{selectedDoc.title}</Label>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {selectedDoc.content}
                              </p>
                              <div className="flex self-end gap-2 hover:bg-accent p-2 rounded-md size-8 cursor-not-allowed">
                                <FileSymlink className="h-4 w-4" />
                              </div>
                            </div>
                          </PopoverContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Popover>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isOpen && documents.length === 0 && !isLoading && (
          <span className="text-xs text-muted-foreground ml-2">
            No reference documents found
          </span>
        )}
      </div>
    </div>
  );
}
