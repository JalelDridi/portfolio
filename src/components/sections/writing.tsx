import Link from "next/link";
import { formatShortDate } from "@/lib/dates";
import { articles } from "@/writing";
import { Section } from "../section";

/** A row per note: the date, the title and summary, the reading time. */
export function Writing() {
  return (
    <Section
      id="writing"
      label="Notes"
      title="Decisions, explained"
      description="Short pieces on choices I made in Payout Ledger: the options, the one I took and what it costs."
    >
      <ol>
        {articles.map((article) => (
          <li
            key={article.slug}
            className="group relative grid gap-x-8 gap-y-2 border-b border-border py-7 first:pt-0 sm:grid-cols-[8rem_minmax(0,1fr)_auto]"
          >
            <time
              dateTime={article.date}
              className="font-mono text-[0.8rem] text-muted-foreground sm:pt-1.5"
            >
              {formatShortDate(article.date)}
            </time>
            <div>
              <h3 className="text-[1.3rem] leading-[1.3] font-semibold text-balance transition-colors group-focus-within:text-brand group-hover:text-brand">
                <Link
                  href={`/writing/${article.slug}`}
                  className="after:absolute after:inset-0"
                >
                  {article.title}
                </Link>
              </h3>
              <p className="mt-2 max-w-[40rem] text-[1.02rem] leading-[1.6] text-pretty text-muted-foreground">
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
