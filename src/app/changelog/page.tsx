import type { Metadata } from "next";
import { changelog } from "@/content";
import { formatShortDate } from "@/lib/dates";

export const metadata: Metadata = { title: "Changelog" };

const LABEL =
  "font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase";

export default function ChangelogPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 pt-24 pb-16">
      <p className={LABEL}>Site</p>
      <h1 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-balance">
        Changelog
      </h1>
      <p className="mt-6 max-w-3xl text-[1.3rem] text-pretty text-muted-foreground">
        Every version of this site, newest first. The version number is in the
        status strip at the bottom of every page.
      </p>
      <ol className="mt-12 border-t-2 border-foreground">
        {changelog.map((entry) => (
          <li
            key={entry.version}
            className="grid gap-x-8 gap-y-3 border-b border-border py-6 md:grid-cols-[10rem_1fr]"
          >
            <div className="font-mono text-[0.85rem] text-muted-foreground">
              <p className="text-base text-foreground">v{entry.version}</p>
              <p className="mt-1">
                <time dateTime={entry.date}>{formatShortDate(entry.date)}</time>
              </p>
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">
                {entry.title}
              </h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-lg leading-relaxed">
                {entry.items.map((item) => (
                  <li key={item} className="text-pretty">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
