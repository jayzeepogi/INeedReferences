import { Link } from "wouter";

export default function Header() {
  return (
    <header className="border-b py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" data-testid="link-home">
            <h1 className="text-2xl font-bold text-foreground hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded-md">
              INeedReferences
            </h1>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/about" data-testid="link-about">
              <span className="text-foreground hover:text-muted-foreground transition-colors">About</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
