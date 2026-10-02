import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { articles } from "@/writing";
import { Reveal } from "../reveal";
import { Section } from "../section";
import { Tags } from "../tags";

export function Writing() {
  return (
    <Section
      id="writing"
      eyebrow="Writing"
      title="Decisions, explained"
      description="Short pieces on choices I made in Payout Ledger: the options, the one I took and what it costs."
    >
      <ul className="grid gap-6 *:min-w-0 md:grid-cols-2">
        {articles.map((article, index) => (
          <li key={article.slug}>
            <Reveal delay={index * 0.06} className="h-full">
              <article className="group relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl hover:shadow-black/5 sm:p-8 dark:hover:shadow-black/30">
                <p className="font-mono text-sm text-muted-foreground">
                  {article.minutes} minute read
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                  <Link
                    href={`/writing/${article.slug}`}
                    className="after:absolute after:inset-0"
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="flex-1 text-lg text-pretty text-muted-foreground">
                  {article.summary}
                </p>
                <Tags items={article.tags} />
                <p
                  aria-hidden="true"
                  className="flex items-center gap-1.5 text-base font-medium"
                >
                  Read it
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
