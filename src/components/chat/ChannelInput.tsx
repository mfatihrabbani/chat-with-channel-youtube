import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ChannelInput() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>YouTube Channel</CardTitle>
        <CardDescription>Enter a YouTube channel URL or name</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Channel URL or name" />
        <Button className="w-full">Load Channel</Button>
      </CardContent>
    </Card>
  );
}
