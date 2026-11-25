"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { shell, site } from "@/content";

/** One mono line: version, changelog, source, deploy date. Not on the home page. */
export function SiteFooter({ lastDeploy }: { lastDeploy: string }) {
  if (usePathname() === "/") return null;
  return (
    <footer className="mt-16 border-t border-border">
      <p className="px-4 py-6 font-mono text-[0.8rem] text-muted-foreground sm:px-11">
        v{site.version} ·{" "}
        <Link
          className="underline underline-offset-4 hover:text-foreground"
          href="/changelog"
        >
          {shell.footer.changelog}
        </Link>{" "}
        ·{" "}
        <a
          className="underline underline-offset-4 hover:text-foreground"
          href={site.repo}
        >
          {shell.footer.source}
        </a>{" "}
        · {shell.footer.lastDeploy} {lastDeploy}
      </p>
    </footer>
  );
}
