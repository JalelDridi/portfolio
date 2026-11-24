import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ui } from "@/content";

/** Characters in the longest word of a title; the title is sized so it fits. */
export function longestWord(title: string) {
  return Math.max(...title.split(/[\s-]+/).map((word) => word.length));
}

/** A title's longest word, handed to the CSS that sizes it. */
export function titleStyle(title: string) {
  return { "--longest": longestWord(title) } as CSSProperties;
}

/** A stack as one line of names; each separator stays with the name before it. */
export function StackLine({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item, index) => (
        <span key={item}>
          {item}
          {index < items.length - 1 && " · "}
        </span>
      ))}
    </>
  );
}

/** The links of an episode, one per line, each marked as leaving the site. */
export function FactLinks({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  return (
    <ul className="flex flex-col gap-1.5">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            className="underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
          >
            {link.label}
            <span aria-hidden="true" className="text-brand">
              {" "}
              ↗
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The top of an episode page: the way back, the file name, the title in wide
 * red capitals, the summary and the facts on the left, the lead picture on the
 * right. One column below 900px. The whole head is wiped in from the top once.
 */
export function EpisodeHead({
  file,
  title,
  summary,
  facts,
  children,
}: {
  file: string;
  title: string;
  summary: string;
  facts: { label: string; value: ReactNode }[];
  children: ReactNode;
}) {
  return (
    <header className="episode-head mx-auto w-full max-w-[calc(1360px+5.5rem)] px-4 pt-4 sm:px-11 sm:pt-6">
      <Link
        href="/"
        className="font-mono text-sm text-muted-foreground lowercase transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">← </span>
        {ui.back}
      </Link>
      <div className="mt-10 grid items-start gap-x-14 gap-y-12 min-[900px]:mt-12 min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="min-w-0">
          <p className="font-mono text-[0.85rem] text-muted-foreground sm:text-[0.9rem]">
            {file}
          </p>
          <h1
            className="episode-title mt-3 font-display font-black text-red uppercase"
            style={titleStyle(title)}
          >
            {title}
          </h1>
          <p className="mt-6 max-w-[40ch] text-[1.15rem] leading-[1.55] text-pretty sm:text-[1.2rem]">
            {summary}
          </p>
          <dl className="mt-9 border-t border-border font-mono text-[0.85rem]">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 border-b border-border py-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]"
              >
                <dt className="text-muted-foreground">{fact.label}</dt>
                <dd className="min-w-0 text-pretty">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </header>
  );
}
