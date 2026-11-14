import type { Metadata } from "next";
import { changelog } from "@/content";
import { formatShortDate } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Changelog",
  alternates: { canonical: "/changelog" },
  // Without this a shared changelog would show the home page's card.
  openGraph: {
    title: "Changelog",
    description: "Every version of this site, newest first.",
    url: "/changelog",
    type: "website",
  },
};

const LABEL =
  "font-mono text-[0.8rem] tracking-[0.1em] text-muted-foreground uppercase";

export default function ChangelogPage() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-5 pt-[4.2rem] pb-16">
      <p className={LABEL}>Site</p>
      <h1 className="mt-3 font-display text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[0.92] font-black tracking-[-0.04em] text-balance">
        Changelog
      </h1>
      <p className="mt-6 max-w-3xl text-[1.25rem] text-pretty text-muted-foreground">
        Every version of this site, newest first. The version number is in the
        status strip at the bottom of every page.
      </p>
      <ol className="mt-12 border-t border-border">
        {changelog.map((entry) => (
          <li
            key={entry.version}
            className="grid gap-x-8 gap-y-3 border-b border-border py-8 md:grid-cols-[11rem_1fr]"
          >
            <div className="font-mono text-[0.8rem] tracking-[0.1em] text-muted-foreground">
              <p className="text-[0.95rem] font-medium tracking-normal text-brand">
                v{entry.version}
              </p>
              <p className="mt-1 uppercase">
                <time dateTime={entry.date}>{formatShortDate(entry.date)}</time>
              </p>
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-extrabold tracking-[-0.03em] text-balance">
                {entry.title}
              </h2>
              <ul className="mt-4 grid max-w-3xl gap-2 text-[1.1rem] leading-relaxed">
                {entry.items.map((item) => (
                  <li key={item} className="grid grid-cols-[1.2rem_1fr] gap-2">
                    {/* A nail head for a bullet. */}
                    <span
                      aria-hidden="true"
                      className="mt-[0.62rem] size-[0.5rem] rounded-full bg-brand"
                    />
                    <span className="text-pretty">{item}</span>
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
