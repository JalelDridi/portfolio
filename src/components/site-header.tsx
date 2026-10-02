import Link from "next/link";
import { profile } from "@/content";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/#project", label: "Project" },
  { href: "/#work", label: "Work" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-md bg-foreground font-mono text-xs text-background"
          >
            JD
          </span>
          {profile.shortName}
        </Link>
        <nav
          aria-label="Sections"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/#contact"
            className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-base font-medium text-background transition-opacity hover:opacity-85"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
