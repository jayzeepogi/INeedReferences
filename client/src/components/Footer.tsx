import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t py-6 mt-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} INeedReferences</span>
          <span>•</span>
          <Link href="/privacy" data-testid="link-privacy">
            <span className="hover:text-foreground transition-colors">Privacy Policy</span>
          </Link>
          <span>•</span>
          <Link href="/terms" data-testid="link-terms">
            <span className="hover:text-foreground transition-colors">Terms of Service</span>
          </Link>
          <span>•</span>
          <Link href="/contact" data-testid="link-contact">
            <span className="hover:text-foreground transition-colors">Contact</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
