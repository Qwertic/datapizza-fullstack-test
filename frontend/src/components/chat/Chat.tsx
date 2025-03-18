import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChatMessages, type MessageType } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { generate, type StreamChunk } from "../../lib/queries";
import { ThemeToggle } from "../theme-toggle";
import { PizzaIcon } from "lucide-react";

export function Chat() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: MessageType = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    setStreamingMessage(""); // Reset streaming message

    try {
      // Create a placeholder for the bot response
      const placeholderId = Date.now().toString();
      const botMessage: MessageType = {
        id: placeholderId,
        text: "",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);

      // Call the backend API with streaming support
      await generate(userMessage, (chunk: StreamChunk) => {
        // Update the streaming message as chunks arrive
        setStreamingMessage(chunk.text);

        // Update the bot message with the current text
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === placeholderId ? { ...msg, text: chunk.text } : msg
          )
        );
      });
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: MessageType = {
        text: "Sorry, there was an error processing your request.",
        isUser: false,
      };

      // Replace the placeholder with error or add a new message
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && !lastMessage.isUser && lastMessage.text === "") {
          // Replace empty bot message with error
          return [...prevMessages.slice(0, -1), errorMessage];
        } else {
          // Add new error message
          return [...prevMessages, errorMessage];
        }
      });
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-primary p-2">
            <PizzaIcon className="text-primary-foreground h-6 w-6" />
          </div>
          <div>
            <CardTitle>DataPizza AI Chatbot</CardTitle>
            <CardDescription>Your Datapizza companion</CardDescription>
          </div>
        </div>
        <ThemeToggle />
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          streamingMessage={streamingMessage}
        />
      </CardContent>
      <CardFooter className="pt-0">
        <ChatInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
}
