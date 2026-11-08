import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LinkButton } from "@/components/link-button";
import { Rise } from "@/components/rise";
import { Tags } from "@/components/tags";
import { profile, SITE_URL } from "@/content";
import { formatShortDate } from "@/lib/dates";
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

const LABEL =
  "font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase";

/** A ruled row: the label in its own column, the content beside it. */
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
      className="grid gap-x-8 gap-y-4 border-t border-border py-8 first:border-t-0 md:grid-cols-[10rem_1fr]"
    >
      {id ? (
        <h2 id={id} className={LABEL}>
          {label}
        </h2>
      ) : (
        <p className={LABEL}>{label}</p>
      )}
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 className="mt-8 font-display text-3xl font-bold tracking-[-0.02em] text-balance">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="text-[1.2rem] leading-relaxed text-pretty">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ol className="border-t border-border">
          {block.items.map((item, index) => (
            <li
              key={item.lead}
              className="grid grid-cols-[2rem_1fr] border-b border-border py-4"
            >
              <span
                aria-hidden="true"
                className="pt-1 font-mono text-[0.85rem] text-muted-foreground"
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
        <figure className="overflow-hidden border border-foreground bg-card">
          <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-2 font-mono text-[0.85rem] text-muted-foreground">
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
    <main className="mx-auto w-full max-w-6xl px-5 pt-24 pb-16 sm:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Rise>
        <Link
          href="/#writing"
          className="inline-flex items-center gap-1.5 text-base font-medium text-muted-foreground transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> All writing
        </Link>
        <p className={`mt-8 ${LABEL}`}>
          <time dateTime={article.date}>{formatShortDate(article.date)}</time> ·{" "}
          {article.minutes} minute read
        </p>
        <h1 className="mt-3 max-w-5xl font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-balance">
          {article.title}
        </h1>
        <p className="mt-6 max-w-3xl text-[1.3rem] text-pretty text-muted-foreground">
          {article.summary}
        </p>
        <div className="mt-6">
          <Tags items={article.tags} />
        </div>
      </Rise>

      {/* The body sits in the content column, under the strong rule. */}
      <div className="mt-12 border-t-2 border-foreground pt-8 md:pl-[12rem]">
        <div className="flex max-w-3xl flex-col gap-6">
          {article.blocks.map((block, blockIndex) => (
            <BlockView key={blockIndex} block={block} />
          ))}
        </div>
      </div>

      <div className="mt-12 border-t-2 border-foreground">
        <Row label="In the repository" id="sources">
          <ul className="flex flex-wrap gap-3">
            {article.links.map((link) => (
              <li key={link.href}>
                <LinkButton href={link.href} className="h-auto min-h-11 py-2">
                  {link.label}
                  <ArrowUpRight className="shrink-0" aria-hidden="true" />
                </LinkButton>
              </li>
            ))}
          </ul>
        </Row>
      </div>

      {next.slug !== article.slug && (
        <Link
          href={`/writing/${next.slug}`}
          className="group grid gap-x-8 gap-y-2 border-y-2 border-foreground py-6 transition-colors hover:text-brand md:grid-cols-[10rem_1fr]"
        >
          <span className={`pt-2 ${LABEL}`}>Next</span>
          <span className="flex items-center justify-between gap-4 font-display text-2xl font-bold tracking-[-0.02em] text-balance">
            {next.title}
            <ArrowRight
              className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </Link>
      )}
    </main>
  );
}
