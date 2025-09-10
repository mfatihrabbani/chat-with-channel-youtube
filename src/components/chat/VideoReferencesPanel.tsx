import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ExternalLink } from "lucide-react";

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

interface VideoReferencesPanelProps {
  references: VideoReference[];
  onVideoSegmentClick: (videoId: string, startTime: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function VideoReferencesPanel({
  references,
  onVideoSegmentClick,
  isOpen,
  onToggle,
}: VideoReferencesPanelProps) {
  if (references.length === 0) {
    return null;
  }

  return (
    <Card className="xl:hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Video References</CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <div className="space-y-3">
            {references.map((reference, index) => (
              <DetailedVideoReference
                key={index}
                reference={reference}
                onSegmentClick={onVideoSegmentClick}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface DetailedVideoReferenceProps {
  reference: VideoReference;
  onSegmentClick: (videoId: string, startTime: number) => void;
}

function DetailedVideoReference({
  reference,
  onSegmentClick,
}: DetailedVideoReferenceProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const createYouTubeUrl = (videoId: string, startTime: number) => {
    return `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(
      startTime
    )}s`;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex">
        <img
          src={reference.thumbnailUrl}
          alt={reference.videoTitle}
          className="w-32 h-20 object-cover"
        />
        <div className="flex-1 p-3">
          <h3 className="font-medium line-clamp-2 mb-2">
            {reference.videoTitle}
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {reference.segments.map((segment, index) => (
              <div key={index} className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    {formatTime(segment.startTime)} -{" "}
                    {formatTime(segment.endTime)}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {segment.text}
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() =>
                      onSegmentClick(reference.videoId, segment.startTime)
                    }
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
