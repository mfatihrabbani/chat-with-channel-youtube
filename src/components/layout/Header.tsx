import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-3xl font-bold">
            Chat with YouTube Channel
          </Link>
          <p className="text-muted-foreground">
            Ask questions and get answers from YouTube channels
          </p>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
