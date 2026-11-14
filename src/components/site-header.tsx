import Link from "next/link";
import { profile } from "@/content";
import { MobileNav } from "./mobile-nav";
import { StatusClocks } from "./status-clocks";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#project", label: "Flagship" },
  { href: "/#writing", label: "Notes" },
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

const BIZERTE = [{ city: "Bizerte", zone: "Africa/Tunis" }];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex items-baseline gap-2.5 font-display text-[1.05rem] font-extrabold whitespace-nowrap"
        >
          {profile.shortName}
          <span
            lang="ar"
            className="font-kufi text-[1.15rem] font-bold text-brand"
          >
            جلال
          </span>
        </Link>
        <nav
          aria-label="Sections"
          className="hidden items-center gap-6 font-medium md:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[0.8rem] whitespace-nowrap text-muted-foreground xl:inline">
            <StatusClocks zones={BIZERTE} /> · {profile.coordinates}
          </span>
          <ThemeToggle />
          <MobileNav items={NAV} />
        </div>
      </div>
    </header>
  );
}
