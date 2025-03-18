import React, { KeyboardEvent, useRef } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="relative flex items-center border rounded-lg bg-background">
        <Textarea
          ref={textareaRef}
          style={{ resize: "none" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute right-2 w-20">
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !input.trim()}
            className="rounded-sm bg-primary text-primary-foreground"
          >
            <Send size={16} />
            <div className="text-xs">Send</div>
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1 ml-2">
        Press Enter for a new line,{" "}
        {navigator.platform.includes("Mac") ? "Cmd+Enter" : "Ctrl+Enter"} to
        send
      </p>
    </motion.form>
  );
}
