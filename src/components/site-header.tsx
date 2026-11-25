"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { shell } from "@/content";
import { cn } from "@/lib/utils";

/**
 * The handle and four links, in one row at every width. Fixed over the home
 * page's reel from 768px up, where the reel fills the screen; in the flow of
 * the page everywhere else, so on a phone it never covers a card.
 */
export function SiteHeader() {
  const home = usePathname() === "/";
  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-50 font-mono text-[0.8rem] sm:text-[0.85rem]",
        home
          ? "relative bg-background md:fixed md:bg-transparent"
          : "relative bg-background",
      )}
    >
      <div className="mx-auto flex w-full items-baseline justify-between gap-4 px-4 py-5 sm:px-11 sm:py-7">
        <Link href="/" className="whitespace-nowrap text-foreground">
          {shell.handle}
          <span className="text-brand">.</span>
        </Link>
        <nav aria-label="Site">
          <ul className="flex gap-3 sm:gap-7">
            {shell.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    // Over a still, muted text would be too faint.
                    home
                      ? "text-foreground hover:text-brand"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
