import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { VideoReferenceCard } from "@/components/chat/VideoReferenceCard";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  references?: VideoReference[];
  createdAt: string;
}

interface VideoReference {
  videoId: string;
  youtubeVideoId: string;
  videoTitle: string;
  thumbnailUrl: string;
  segments: VideoSegment[];
}

interface VideoSegment {
  transcriptId: string;
  startTime: number; // seconds
  endTime: number; // seconds
  text: string;
  relevanceScore: number;
}

interface ChatInterfaceProps {
  channelId?: string;
  conversationId?: string;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onVideoSegmentClick: (videoId: string, startTime: number) => void;
}

export function ChatInterface({
  channelId,
  conversationId,
  messages,
  isLoading,
  onSendMessage,
  onVideoSegmentClick,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b p-4">
        <h2 className="font-semibold">Chat</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about the channel content
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              {channelId
                ? "Ask a question about this channel"
                : "Select a channel to start chatting"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onVideoSegmentClick={onVideoSegmentClick}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            disabled={!channelId || isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!channelId || !inputValue.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  onVideoSegmentClick: (videoId: string, startTime: number) => void;
}

function MessageBubble({ message, onVideoSegmentClick }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        {message.references && message.references.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-xs font-medium">Sources:</div>
            {message.references.map((reference, index) => (
              <VideoReferenceCard
                key={index}
                reference={reference}
                onSegmentClick={onVideoSegmentClick}
              />
            ))}
          </div>
        )}

        <div
          className={`text-xs mt-1 ${
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-lg px-4 py-2">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
          <div
            className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
