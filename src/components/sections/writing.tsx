import Link from "next/link";
import { formatShortDate } from "@/lib/dates";
import { flagship } from "@/content";
import { articles } from "@/writing";
import { ClosedDoor } from "../motifs";
import { Section } from "../section";

/**
 * A row per note, each behind a small closed door: the flagship's, since every
 * note is about Payout Ledger. The door sits beside the date on wide screens
 * and to the left of the title on phones.
 */
export function Writing() {
  return (
    <Section
      id="writing"
      eyebrow="Notes"
      title="Decisions,"
      accent="explained"
      description="Short pieces on choices I made in Payout Ledger: the options, the one I took and what it costs."
    >
      <ol className="grid">
        {articles.map((article) => (
          <li
            key={article.slug}
            className="group relative grid grid-cols-[2.75rem_1fr] items-start gap-x-5 gap-y-1.5 border-t py-6 sm:grid-cols-[3.5rem_7rem_1fr_auto] sm:gap-x-8"
          >
            <ClosedDoor
              motif={flagship.door.motif}
              paint={flagship.door.paint}
              className="row-span-3 sm:row-span-1"
            />
            <time
              dateTime={article.date}
              className="font-mono text-[0.8rem] tracking-[0.04em] text-muted-foreground sm:pt-1.5"
            >
              {formatShortDate(article.date)}
            </time>
            <div>
              <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.75rem)] leading-[1.1] font-extrabold tracking-[-0.025em] text-balance transition-colors group-focus-within:text-brand group-hover:text-brand">
                <Link
                  href={`/writing/${article.slug}`}
                  className="after:absolute after:inset-0"
                >
                  {article.title}
                </Link>
              </h3>
              <p className="mt-2 max-w-[44rem] text-[1.05rem] text-pretty text-muted-foreground">
                {article.summary}
              </p>
            </div>
            <span className="font-mono text-[0.8rem] whitespace-nowrap text-muted-foreground sm:pt-1.5">
              {article.minutes} min{" "}
              <span
                aria-hidden="true"
                className="inline-block text-brand transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
