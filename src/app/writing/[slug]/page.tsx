import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/link-button";
import { Reveal } from "@/components/reveal";
import { Rise } from "@/components/rise";
import { Tags } from "@/components/tags";
import { profile, SITE_URL } from "@/content";
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

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="text-xl leading-relaxed text-pretty">{block.text}</p>
      );
    case "list":
      return (
        <ol className="flex flex-col gap-4">
          {block.items.map((item, index) => (
            <li
              key={item.lead}
              className="flex gap-4 rounded-xl border border-border bg-card p-5"
            >
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-sm font-medium text-brand"
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
        <figure className="overflow-hidden rounded-xl border border-border bg-card">
          <figcaption className="flex items-center justify-between gap-3 border-b border-border bg-muted/60 px-4 py-2.5 font-mono text-sm text-muted-foreground">
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
    <main className="mx-auto w-full max-w-3xl px-5 pt-28 pb-16 sm:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Rise>
        <Link
          href="/#writing"
          className="inline-flex items-center gap-1.5 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> All writing
        </Link>
        <p className="mt-8 font-mono text-sm font-medium tracking-widest text-brand uppercase">
          <time dateTime={article.date}>{formatDate(article.date)}</time> ·{" "}
          {article.minutes} minute read
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {article.title}
        </h1>
        <p className="mt-5 text-xl text-pretty text-muted-foreground sm:text-2xl">
          {article.summary}
        </p>
        <div className="mt-6">
          <Tags items={article.tags} />
        </div>
      </Rise>

      <div className="mt-12 flex flex-col gap-6">
        {article.blocks.map((block, blockIndex) => (
          <Reveal key={blockIndex}>
            <BlockView block={block} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <section aria-labelledby="sources" className="mt-14">
          <h2
            id="sources"
            className="font-mono text-sm font-medium tracking-widest text-brand uppercase"
          >
            In the repository
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {article.links.map((link) => (
              <li key={link.href}>
                <LinkButton href={link.href} className="h-auto min-h-11 py-2">
                  {link.label}
                  <ArrowUpRight className="shrink-0" aria-hidden="true" />
                </LinkButton>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {next.slug !== article.slug && (
        <Link
          href={`/writing/${next.slug}`}
          className="group mt-16 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/50"
        >
          <span>
            <span className="block font-mono text-sm text-muted-foreground">
              Next
            </span>
            <span className="mt-1 block text-2xl font-semibold tracking-tight text-balance">
              {next.title}
            </span>
          </span>
          <ArrowRight
            className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
    </main>
  );
}
