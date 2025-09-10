import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Channel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
  processingStatus: "pending" | "processing" | "completed" | "error";
}

interface ChannelSelectorProps {
  channels: Channel[];
  selectedChannelId?: string;
  onChannelSelect: (channelId: string) => void;
  onChannelRefresh: (channelId: string) => void;
}

export function ChannelSelector({
  channels,
  selectedChannelId,
  onChannelSelect,
  onChannelRefresh,
}: ChannelSelectorProps) {
  return (
    <div className="space-y-1">
      {channels.map((channel) => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          isSelected={selectedChannelId === channel.id}
          onSelect={() => onChannelSelect(channel.id)}
          onRefresh={() => onChannelRefresh(channel.id)}
        />
      ))}
    </div>
  );
}

interface ChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  onSelect: () => void;
  onRefresh: () => void;
}

function ChannelItem({
  channel,
  isSelected,
  onSelect,
  onRefresh,
}: ChannelItemProps) {
  return (
    <div
      className={`p-3 cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary/10 border-l-4 border-primary"
          : "hover:bg-muted"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-3">
        <img
          src={channel.thumbnailUrl}
          alt={channel.title}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate">{channel.title}</h3>
            <ChannelStatusBadge status={channel.processingStatus} />
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {channel.videoCount} videos
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRefresh();
          }}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface ChannelStatusBadgeProps {
  status: "pending" | "processing" | "completed" | "error";
}

function ChannelStatusBadge({ status }: ChannelStatusBadgeProps) {
  const variants = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-800" },
    completed: { label: "Ready", className: "bg-green-100 text-green-800" },
    error: { label: "Error", className: "bg-red-100 text-red-800" },
  };

  const { label, className } = variants[status];

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${className}`}>
      {label}
    </span>
  );
}
