"use client";

import { useState, useEffect } from "react";
import { ChannelSelector } from "@/components/chat/ChannelSelector";
import { VideoList } from "@/components/chat/VideoList";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { VideoReferencesPanel } from "@/components/chat/VideoReferencesPanel";
import { openYouTubeAtTimestamp } from "@/utils/youtube";

// Mock data for demonstration
const mockChannels = [
  {
    id: "1",
    title: "Google Developers",
    description: "The official Google Developers channel",
    thumbnailUrl: "https://via.placeholder.com/150",
    videoCount: 450,
    processingStatus: "completed" as const,
  },
  {
    id: "2",
    title: "Microsoft Developer",
    description: "Official Microsoft Developer channel",
    thumbnailUrl: "https://via.placeholder.com/150",
    videoCount: 320,
    processingStatus: "completed" as const,
  },
  {
    id: "3",
    title: "AWS",
    description: "Official Amazon Web Services channel",
    thumbnailUrl: "https://via.placeholder.com/150",
    videoCount: 280,
    processingStatus: "processing" as const,
  },
];

const mockVideos = [
  {
    id: "1",
    youtubeVideoId: "dQw4w9WgXcQ",
    title: "Introduction to Cloud Computing",
    thumbnailUrl: "https://via.placeholder.com/320x180",
    publishedAt: "2023-10-01",
    duration: "10:30",
    viewCount: 150000,
    transcriptStatus: "available" as const,
  },
  {
    id: "2",
    youtubeVideoId: "ScMzIvxBSi4",
    title: "Advanced JavaScript Techniques",
    thumbnailUrl: "https://via.placeholder.com/320x180",
    publishedAt: "2023-09-15",
    duration: "25:45",
    viewCount: 85000,
    transcriptStatus: "available" as const,
  },
  {
    id: "3",
    youtubeVideoId: "fJ9rUzIMcZQ",
    title: "Machine Learning Basics",
    thumbnailUrl: "https://via.placeholder.com/320x180",
    publishedAt: "2023-08-20",
    duration: "18:20",
    viewCount: 120000,
    transcriptStatus: "pending" as const,
  },
];

const mockMessages = [
  {
    id: "1",
    role: "user" as const,
    content: "What is cloud computing?",
    createdAt: "2023-10-15T10:30:00Z",
  },
  {
    id: "2",
    role: "assistant" as const,
    content:
      'Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.',
    createdAt: "2023-10-15T10:31:00Z",
    references: [
      {
        videoId: "1",
        youtubeVideoId: "dQw4w9WgXcQ",
        videoTitle: "Introduction to Cloud Computing",
        thumbnailUrl: "https://via.placeholder.com/320x180",
        segments: [
          {
            transcriptId: "1",
            startTime: 30,
            endTime: 60,
            text: "Cloud computing is the delivery of computing services over the internet",
            relevanceScore: 0.95,
          },
          {
            transcriptId: "2",
            startTime: 90,
            endTime: 120,
            text: "The main benefits include cost savings and scalability",
            relevanceScore: 0.9,
          },
        ],
      },
    ],
  },
];

export default function ChatPage() {
  const [selectedChannelId, setSelectedChannelId] = useState<string>();
  const [selectedVideoId, setSelectedVideoId] = useState<string>();
  const [messages, setMessages] = useState(mockMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [showReferences, setShowReferences] = useState(false);

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    // Reset messages when channel changes
    setMessages([]);
  };

  const handleChannelRefresh = (channelId: string) => {
    // In a real app, this would trigger a sync process
    console.log(`Refreshing channel ${channelId}`);
  };

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setIsLoading(true);

    // Simulate API response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "This is a simulated response to your question: " + content,
        createdAt: new Date().toISOString(),
        references: [
          {
            videoId: "1",
            youtubeVideoId: "dQw4w9WgXcQ",
            videoTitle: "Introduction to Cloud Computing",
            thumbnailUrl: "https://via.placeholder.com/320x180",
            segments: [
              {
                transcriptId: "1",
                startTime: 30,
                endTime: 60,
                text: "This segment contains information relevant to your question",
                relevanceScore: 0.85,
              },
            ],
          },
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleVideoSegmentClick = (videoId: string, startTime: number) => {
    // Use the utility function to open YouTube at specific timestamp
    openYouTubeAtTimestamp(videoId, startTime);
  };

  // Extract all video references from messages
  const videoReferences = messages.flatMap(
    (message) => message.references || []
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">YouTube Channel Chat</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Section - Channel List */}
        <div className="w-80 border-r flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Channels</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChannelSelector
              channels={mockChannels}
              selectedChannelId={selectedChannelId}
              onChannelSelect={handleChannelSelect}
              onChannelRefresh={handleChannelRefresh}
            />
          </div>
          <div className="p-4 border-t">
            <h2 className="font-semibold mb-2">Videos</h2>
            <div className="overflow-y-auto max-h-96">
              <VideoList
                videos={mockVideos}
                selectedVideoId={selectedVideoId}
                onVideoSelect={handleVideoSelect}
                isLoading={false}
              />
            </div>
          </div>
        </div>

        {/* Middle Section - Chat */}
        <div className="flex-1 flex flex-col">
          <ChatInterface
            channelId={selectedChannelId}
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onVideoSegmentClick={handleVideoSegmentClick}
          />
        </div>

        {/* Right Section - Preview (diperbesar) */}
        <div className="w-96 border-l hidden lg:flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Video Preview</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {videoReferences.length > 0 ? (
              <div className="space-y-6">
                {videoReferences.map((reference, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">{reference.videoTitle}</h3>
                    <div className="aspect-video bg-muted rounded mb-4 flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        Video Thumbnail
                      </span>
                    </div>
                    <div className="space-y-3">
                      {reference.segments.map((segment, segIndex) => (
                        <div
                          key={segIndex}
                          className="text-sm p-2 bg-muted/50 rounded"
                        >
                          <div className="font-medium mb-1">
                            {Math.floor(segment.startTime / 60)}:
                            {(segment.startTime % 60)
                              .toString()
                              .padStart(2, "0")}{" "}
                            - {Math.floor(segment.endTime / 60)}:
                            {(segment.endTime % 60).toString().padStart(2, "0")}
                          </div>
                          <p className="text-muted-foreground">
                            {segment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                <p>
                  Video references will appear here when you receive responses
                  with sources.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video References Panel for mobile */}
      {videoReferences.length > 0 && (
        <VideoReferencesPanel
          references={videoReferences}
          onVideoSegmentClick={handleVideoSegmentClick}
          isOpen={showReferences}
          onToggle={() => setShowReferences(!showReferences)}
        />
      )}
    </div>
  );
}
