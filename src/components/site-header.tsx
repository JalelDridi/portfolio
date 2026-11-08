import Link from "next/link";
import { profile } from "@/content";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/#project", label: "Flagship" },
  { href: "/#work", label: "Work" },
  { href: "/#writing", label: "Notes" },
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="font-display text-lg font-semibold whitespace-nowrap"
        >
          {profile.shortName}
        </Link>
        <nav
          aria-label="Sections"
          className="hidden items-center gap-6 md:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-base transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileNav items={NAV} />
        </div>
      </div>
    </header>
  );
}
