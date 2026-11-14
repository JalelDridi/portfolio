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
import { cn } from "@/lib/utils";
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
  "font-mono text-[0.8rem] tracking-[0.1em] text-muted-foreground uppercase";

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
        <h2 id={id} className={cn(LABEL, "text-brand")}>
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
        <h2 className="mt-8 font-display text-[clamp(1.7rem,3.4vw,2.3rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">
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
        <figure className="overflow-hidden bg-wall-2 px-[9px] pb-[9px] shadow-[0_0_0_1px_var(--border)]">
          <figcaption className="flex items-center justify-between gap-3 py-2 font-mono text-[0.8rem] text-muted-foreground">
            <span className="truncate">{block.caption ?? block.language}</span>
            {block.caption && <span>{block.language}</span>}
          </figcaption>
          {/* Focusable, so a keyboard can scroll code wider than the screen. */}
          <pre
            tabIndex={0}
            aria-label={`${block.language} code`}
            className="overflow-x-auto bg-card p-4 font-mono text-[0.9rem] leading-relaxed"
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
    <main className="mx-auto w-full max-w-[1280px] px-5 pt-[4.2rem] pb-16 sm:pb-24">
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
        <p className={`mt-10 ${LABEL}`}>
          <time dateTime={article.date}>{formatShortDate(article.date)}</time> ·{" "}
          {article.minutes} minute read
        </p>
        <h1 className="mt-3 max-w-5xl font-display text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[0.92] font-black tracking-[-0.04em] text-balance">
          {article.title}
        </h1>
        <p className="mt-6 max-w-3xl text-[1.25rem] text-pretty text-muted-foreground">
          {article.summary}
        </p>
        <div className="mt-6">
          <Tags items={article.tags} />
        </div>
      </Rise>

      {/* The body sits in the content column, under a hairline. */}
      <div className="mt-12 border-t border-border pt-9 md:pl-[13rem]">
        <div className="flex max-w-3xl flex-col gap-6">
          {article.blocks.map((block, blockIndex) => (
            <BlockView key={blockIndex} block={block} />
          ))}
        </div>
      </div>

      <div className="mt-12 border-t border-border">
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
          className="group grid gap-x-8 gap-y-2 border-y border-border py-7 transition-colors hover:text-brand md:grid-cols-[11rem_1fr]"
        >
          <span className={`pt-2 ${LABEL}`}>Next</span>
          <span className="flex items-center justify-between gap-4 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight font-extrabold tracking-[-0.03em] text-balance">
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
