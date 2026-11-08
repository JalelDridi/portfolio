import Link from "next/link";
import { formatShortDate } from "@/lib/dates";
import { articles } from "@/writing";
import { Section } from "../section";

export function Writing() {
  return (
    <Section
      id="writing"
      eyebrow="Notes"
      title="Decisions, explained"
      description="Short pieces on choices I made in Payout Ledger: the options, the one I took and what it costs."
    >
      <ol className="border-t-2 border-foreground">
        {articles.map((article) => (
          <li
            key={article.slug}
            className="relative grid grid-cols-1 items-baseline gap-x-5 gap-y-1 border-b border-border py-4 sm:grid-cols-[9rem_1fr_auto]"
          >
            <time
              dateTime={article.date}
              className="font-mono text-[0.85rem] text-muted-foreground"
            >
              {formatShortDate(article.date)}
            </time>
            <div>
              <h3 className="font-display text-2xl font-bold tracking-[-0.02em]">
                <Link
                  href={`/writing/${article.slug}`}
                  className="after:absolute after:inset-0 hover:text-brand"
                >
                  {article.title}
                </Link>
              </h3>
              <p className="mt-1 text-muted-foreground">{article.summary}</p>
            </div>
            <span className="font-mono text-[0.85rem] text-muted-foreground">
              {article.minutes} min
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
