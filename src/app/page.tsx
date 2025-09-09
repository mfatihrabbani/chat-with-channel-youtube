import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { ChannelInput } from "@/components/chat/ChannelInput";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Channel Input Section */}
          <div className="lg:col-span-1">
            <ChannelInput />
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}
