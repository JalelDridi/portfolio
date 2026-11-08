import Link from "next/link";
import { site } from "@/content";
import { StatusClocks } from "./status-clocks";

const ZONES = [
  { city: "Bizerte", zone: "Africa/Tunis" },
  { city: "New York", zone: "America/New_York" },
  { city: "San Francisco", zone: "America/Los_Angeles" },
];

// Evaluated when the page is built, so it is the date of the deploy.
const BUILT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date());

/** The status strip: clocks, version, deploy date and source. */
export function SiteFooter() {
  return (
    <footer className="border-t border-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-x-6 gap-y-2 px-5 py-5 font-mono text-[0.85rem] text-muted-foreground">
        <StatusClocks zones={ZONES} />
        <span>
          Site v{site.version} ·{" "}
          <Link
            className="underline underline-offset-4 hover:text-brand"
            href="/changelog"
          >
            changelog
          </Link>
        </span>
        <span>Last deploy {BUILT}</span>
        <a
          className="underline underline-offset-4 hover:text-brand"
          href={site.repo}
        >
          Source on GitHub
        </a>
      </div>
    </footer>
  );
}
