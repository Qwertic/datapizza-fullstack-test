import { useRef, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Message } from "./Message";
import { WelcomeMessage } from "./WelcomeMessage";

export interface MessageType {
  id?: string; // Optional ID for tracking streamed messages
  text: string;
  isUser: boolean;
}

interface ChatMessagesProps {
  messages: MessageType[];
  isLoading: boolean;
  streamingMessage?: string; // Optional streaming message text
}

export function ChatMessages({
  messages,
  isLoading,
  streamingMessage,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  return (
    <ScrollArea className="flex-1 pr-4 h-[calc(100vh-320px)]">
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <div className="space-y-4 p-4">
          {messages.map((message, index) => (
            <Message
              isLast={index === messages.length - 1}
              isGenerating={isLoading}
              key={message.id || index}
              text={message.text}
              isUser={message.isUser}
              isStreaming={
                !message.isUser &&
                index === messages.length - 1 &&
                !!streamingMessage
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
}
