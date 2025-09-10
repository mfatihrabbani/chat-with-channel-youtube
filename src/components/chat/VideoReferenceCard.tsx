import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

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

interface VideoReferenceCardProps {
  reference: VideoReference;
  onSegmentClick: (videoId: string, startTime: number) => void;
}

export function VideoReferenceCard({
  reference,
  onSegmentClick,
}: VideoReferenceCardProps) {
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
    <div className="border rounded-lg p-2 bg-background">
      <div className="flex items-start space-x-2">
        <img
          src={reference.thumbnailUrl}
          alt={reference.videoTitle}
          className="w-16 h-12 rounded object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm line-clamp-2">
            {reference.videoTitle}
          </h4>
          <div className="mt-1 space-y-1">
            {reference.segments.slice(0, 2).map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {formatTime(segment.startTime)} - {segment.text}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() =>
                    onSegmentClick(reference.youtubeVideoId, segment.startTime)
                  }
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {reference.segments.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{reference.segments.length - 2} more segments
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
