import { Loader2 } from "lucide-react";

interface Video {
  id: string;
  youtubeVideoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  transcriptStatus: "pending" | "available" | "not_available" | "error";
}

interface VideoListProps {
  videos: Video[];
  selectedVideoId?: string;
  onVideoSelect: (videoId: string) => void;
  isLoading: boolean;
}

export function VideoList({
  videos,
  selectedVideoId,
  onVideoSelect,
  isLoading,
}: VideoListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {videos.map((video) => (
        <VideoItem
          key={video.id}
          video={video}
          isSelected={selectedVideoId === video.id}
          onSelect={() => onVideoSelect(video.id)}
        />
      ))}
    </div>
  );
}

interface VideoItemProps {
  video: Video;
  isSelected: boolean;
  onSelect: () => void;
}

function VideoItem({ video, isSelected, onSelect }: VideoItemProps) {
  const formatDuration = (duration: string) => {
    // Parse ISO 8601 duration and format as MM:SS
    // Implementation depends on duration format from YouTube API
    return duration; // Simplified for example
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div
      className={`p-2 cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary/10 border-l-4 border-primary"
          : "hover:bg-muted"
      }`}
      onClick={onSelect}
    >
      <div className="flex space-x-2">
        <div className="relative flex-shrink-0">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-20 h-14 rounded object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <span>{formatViewCount(video.viewCount)} views</span>
            <VideoStatusBadge status={video.transcriptStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface VideoStatusBadgeProps {
  status: "pending" | "available" | "not_available" | "error";
}

function VideoStatusBadge({ status }: VideoStatusBadgeProps) {
  const variants = {
    pending: {
      label: "Processing",
      className: "bg-yellow-100 text-yellow-800",
    },
    available: {
      label: "Transcript",
      className: "bg-green-100 text-green-800",
    },
    not_available: {
      label: "No Transcript",
      className: "bg-gray-100 text-gray-800",
    },
    error: { label: "Error", className: "bg-red-100 text-red-800" },
  };

  const { label, className } = variants[status];

  return (
    <span className={`text-xs px-2 py-1 rounded-full ml-2 ${className}`}>
      {label}
    </span>
  );
}
