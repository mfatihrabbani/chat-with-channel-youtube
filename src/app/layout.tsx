import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat with YouTube Channel - AI-Powered YouTube Conversations",
  description:
    "Ask questions and get instant answers from any YouTube channel. Transform video content into interactive conversations with our AI-powered platform.",
  keywords: [
    "YouTube",
    "AI",
    "Chat",
    "Video Analysis",
    "Content Interaction",
    "Q&A",
  ],
  authors: [{ name: "Chat with YouTube Channel" }],
  openGraph: {
    title: "Chat with YouTube Channel - AI-Powered YouTube Conversations",
    description:
      "Ask questions and get instant answers from any YouTube channel. Transform video content into interactive conversations with our AI-powered platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat with YouTube Channel - AI-Powered YouTube Conversations",
    description:
      "Ask questions and get instant answers from any YouTube channel. Transform video content into interactive conversations with our AI-powered platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
