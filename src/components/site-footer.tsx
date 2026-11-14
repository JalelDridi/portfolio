import Link from "next/link";
import { site } from "@/content";
import { TileBand } from "./motifs";
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

/** The ground line of tiles, then the status strip. */
export function SiteFooter() {
  return (
    <footer className="mt-16">
      <TileBand />
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap gap-x-6 gap-y-2 px-5 pt-4 pb-6 font-mono text-[0.78rem] text-muted-foreground [&_time]:font-medium [&_time]:text-foreground">
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
        <span>
          Tiles after the Qallaline workshops of Tunis · doors after the medina
        </span>
        <span className="flex items-baseline gap-2">
          <span lang="ar" className="font-kufi text-[0.95rem] text-brand">
            بالسلامة
          </span>
          Bislema · goodbye
        </span>
      </div>
    </footer>
  );
}
