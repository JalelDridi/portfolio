import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LinkButton } from "@/components/link-button";
import { Rise } from "@/components/rise";
import { Tags } from "@/components/tags";
import { profile, SITE_URL } from "@/content";
import { formatShortDate } from "@/lib/dates";
import { CONTAINER, LABEL, LABEL_MUTED, WIDE_TITLE } from "@/lib/styles";
import { articles, type Block } from "@/writing";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

// Only the listed articles exist; anything else is a 404.
export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/writing/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `/writing/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `/writing/${article.slug}`,
      type: "article",
      publishedTime: article.date,
      authors: [profile.name],
    },
  };
}

/** A row under a hairline: the label in its own column, the content beside it. */
function Row({
  label,
  id,
  children,
}: {
  label: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-x-8 gap-y-4 border-t border-border py-9 first:border-t-0 md:grid-cols-[11rem_1fr]"
    >
      {id ? (
        <h2 id={id} className={LABEL}>
          {label}
        </h2>
      ) : (
        <p className={LABEL_MUTED}>{label}</p>
      )}
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 className="mt-8 font-display text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="text-[1.15rem] leading-[1.7] text-pretty">{block.text}</p>
      );
    case "list":
      return (
        <ol className="border-y border-border">
          {block.items.map((item, index) => (
            <li
              key={item.lead}
              className="grid grid-cols-[2rem_1fr] border-b border-border py-4 last:border-b-0"
            >
              <span
                aria-hidden="true"
                className="pt-1 font-mono text-[0.85rem] text-brand"
              >
                {index + 1}
              </span>
              <p className="text-lg leading-relaxed text-pretty">
                <strong className="font-semibold">{item.lead}</strong>{" "}
                <span className="text-muted-foreground">{item.text}</span>
              </p>
            </li>
          ))}
        </ol>
      );
    case "code":
      return (
        <figure className="overflow-hidden border border-border bg-card">
          <figcaption className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-2.5 font-mono text-[0.8rem] text-muted-foreground">
            <span className="truncate">{block.caption ?? block.language}</span>
            {block.caption && <span>{block.language}</span>}
          </figcaption>
          {/* Focusable, so a keyboard can scroll code wider than the screen. */}
          <pre
            tabIndex={0}
            aria-label={`${block.language} code`}
            className="overflow-x-auto p-4 font-mono text-[0.9rem] leading-relaxed"
          >
            <code>{block.code}</code>
          </pre>
        </figure>
      );
  }
}

export default async function ArticlePage(props: PageProps<"/writing/[slug]">) {
  const { slug } = await props.params;
  const index = articles.findIndex((a) => a.slug === slug);
  if (index === -1) notFound();

  const article = articles[index];
  const next = articles[(index + 1) % articles.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    url: `${SITE_URL}/writing/${article.slug}`,
    author: { "@type": "Person", name: profile.name, url: SITE_URL },
  };

  return (
    <main className={`${CONTAINER} pt-4 pb-8 sm:pt-6`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Rise>
        <Link
          href="/work/payout-ledger#writing"
          className="font-mono text-sm text-muted-foreground lowercase transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">← </span>All writing
        </Link>
        <p className={`mt-10 ${LABEL_MUTED}`}>
          <time dateTime={article.date}>{formatShortDate(article.date)}</time> ·{" "}
          {article.minutes} minute read
        </p>
        <h1
          className={`${WIDE_TITLE} mt-3 max-w-[22ch] text-[clamp(28px,5vw,4.4rem)] text-red`}
        >
          {article.title}
        </h1>
        <p className="mt-6 max-w-[40rem] text-[1.2rem] leading-[1.6] text-pretty text-muted-foreground">
          {article.summary}
        </p>
        <div className="mt-6">
          <Tags items={article.tags} />
        </div>
      </Rise>

      {/* The body sits in the content column, under a hairline. */}
      <div className="mt-12 max-w-[64rem] border-t border-border pt-9 md:pl-[13rem]">
        <div className="flex max-w-[40rem] flex-col gap-6">
          {article.blocks.map((block, blockIndex) => (
            <BlockView key={blockIndex} block={block} />
          ))}
        </div>
      </div>

      <div className="mt-12 max-w-[64rem] border-t border-border">
        <Row label="In the repository" id="sources">
          <ul className="flex flex-wrap gap-3">
            {article.links.map((link) => (
              <li key={link.href}>
                <LinkButton href={link.href} className="h-auto min-h-11 py-2">
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </LinkButton>
              </li>
            ))}
          </ul>
        </Row>
      </div>

      {next.slug !== article.slug && (
        <Link
          href={`/writing/${next.slug}`}
          className="group grid max-w-[64rem] gap-x-8 gap-y-2 border-y border-border py-7 transition-colors hover:text-brand md:grid-cols-[11rem_1fr]"
        >
          <span className={`pt-2 ${LABEL_MUTED}`}>Next</span>
          <span className="flex items-center justify-between gap-4 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-extrabold tracking-[-0.03em] text-balance">
            {next.title}
            <span
              aria-hidden="true"
              className="shrink-0 text-brand transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Link>
      )}
    </main>
  );
}
