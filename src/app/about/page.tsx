import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                About Chat with YouTube Channel
              </CardTitle>
              <CardDescription className="text-lg">
                Revolutionizing how you interact with YouTube content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                <p className="text-muted-foreground">
                  We believe that knowledge should be easily accessible and
                  interactive. Our platform transforms passive YouTube viewing
                  into active conversations, allowing you to engage directly
                  with the content that matters to you.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
                <p className="text-muted-foreground mb-4">
                  Using advanced AI technology, we analyze YouTube channels to
                  understand their content, themes, and expertise. This allows
                  us to create a conversational interface that can answer your
                  questions based on the channel's videos.
                </p>
                <p className="text-muted-foreground">
                  Whether you're looking for specific information, want to
                  understand complex topics, or simply curious about what a
                  creator has to say on a particular subject, our platform makes
                  it easy to get the answers you need without watching hours of
                  content.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Key Features</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Comprehensive channel analysis</li>
                  <li>Natural language conversations</li>
                  <li>Instant answers to your questions</li>
                  <li>Support for any YouTube channel</li>
                  <li>Easy-to-use interface</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Get Started</h2>
                <p className="text-muted-foreground mb-4">
                  Ready to start chatting with your favorite YouTube channels?
                  It's easy!
                </p>
                <Button asChild>
                  <Link href="/chat">Start Chatting Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
