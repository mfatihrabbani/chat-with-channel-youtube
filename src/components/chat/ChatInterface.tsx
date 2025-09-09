import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChatInterfaceProps {
  channelLoaded?: boolean;
}

export function ChatInterface({ channelLoaded = false }: ChatInterfaceProps) {
  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription>
          Ask questions about the channel content
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 border rounded-lg p-4 bg-muted/50">
          {channelLoaded ? (
            <div className="space-y-4">
              <div className="text-right">
                <div className="inline-block bg-primary text-primary-foreground rounded-lg px-4 py-2">
                  What is this channel about?
                </div>
              </div>
              <div className="text-left">
                <div className="inline-block bg-muted rounded-lg px-4 py-2">
                  This channel is about technology and programming tutorials.
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              Load a YouTube channel to start chatting
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type your question..."
            disabled={!channelLoaded}
          />
          <Button disabled={!channelLoaded}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
