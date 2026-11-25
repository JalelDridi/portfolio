import type { Metadata } from "next";
import Link from "next/link";
import {
  EpisodeHead,
  FactLinks,
  StackLine,
} from "@/components/episodes/episode-head";
import { NextEpisode } from "@/components/episodes/next-episode";
import { episodeFile } from "@/components/episodes/order";
import { LinkButton } from "@/components/link-button";
import { ClipFigure } from "@/components/media";
import { PipelinePlayground } from "@/components/pipeline-playground";
import { episodes, flagship, ui } from "@/content";
import { formatShortDate } from "@/lib/dates";
import { CONTAINER, LABEL, WIDE_TITLE } from "@/lib/styles";
import { articles } from "@/writing";

const SLUG = "payout-ledger";

export const metadata: Metadata = {
  title: flagship.name,
  description: flagship.summary,
  alternates: { canonical: `/work/${SLUG}` },
  // Without this a shared page would show the home page's card.
  openGraph: {
    title: flagship.name,
    description: flagship.summary,
    url: `/work/${SLUG}`,
    type: "article",
  },
};

/** A section title in wide red capitals. */
const TITLE = `${WIDE_TITLE} mt-3 text-[clamp(28px,4.6vw,3.6rem)] text-red`;

/** The flagship as an episode: the recording, the four points, the playground, the notes. */
export default function PayoutLedger() {
  const episode = episodes.find((item) => item.slug === SLUG);
  return (
    <main className="pb-8">
      <EpisodeHead
        file={episodeFile(SLUG)}
        title={flagship.name}
        summary={flagship.summary}
        facts={[
          {
            label: ui.facts.role,
            value: episode ? `${episode.kind} · ${episode.year}` : "",
          },
          {
            label: ui.facts.stack,
            value: <StackLine items={flagship.stack} />,
          },
          {
            label: ui.facts.links,
            value: (
              <FactLinks
                links={[
                  { label: "Try the live demo", href: flagship.demo },
                  { label: "Read the code", href: flagship.repo },
                  { label: "Design decisions", href: flagship.decisions },
                ]}
              />
            ),
          },
        ]}
      >
        <ClipFigure
          clip={{
            ...flagship.video,
            frame: "browser",
            url: new URL(flagship.demo).host,
          }}
        />
      </EpisodeHead>

      <div className={`${CONTAINER} mt-16 sm:mt-24`}>
        <ul className="grid max-w-[64rem] border-t border-border sm:grid-cols-2 sm:gap-x-12">
          {flagship.points.map((point) => (
            <li key={point.title} className="border-b border-border py-7">
              <p className={LABEL}>{point.title}</p>
              <p className="mt-3 max-w-[32rem] text-[1.1rem] leading-[1.65] text-pretty">
                {point.text}
              </p>
            </li>
          ))}
        </ul>

        <section
          id="playground"
          aria-labelledby="playground-title"
          className="mt-20 border-t border-border pt-12 sm:mt-28 sm:pt-16"
        >
          <PipelinePlayground
            intro={
              <div>
                <p className={LABEL}>Try it</p>
                <h2 id="playground-title" className={TITLE}>
                  Break my pipeline.
                </h2>
                <p className="mt-5 text-[1.08rem] leading-[1.65] text-pretty text-muted-foreground">
                  A small model of Payout Ledger, my open-source payout monitor.
                  Send it the webhooks that break payment systems and watch the
                  ledger take only what it should.
                </p>
              </div>
            }
            footer={
              <LinkButton href={flagship.demo} className="mt-6">
                Open the real demo <span aria-hidden="true">↗</span>
              </LinkButton>
            }
          />
        </section>

        <section
          id="writing"
          aria-labelledby="writing-title"
          className="mt-20 border-t border-border pt-12 sm:mt-28 sm:pt-16"
        >
          <p className={LABEL}>Notes</p>
          <h2 id="writing-title" className={TITLE}>
            Decisions, explained
          </h2>
          <p className="mt-5 max-w-[40rem] text-[1.08rem] leading-[1.65] text-pretty text-muted-foreground">
            Short pieces on choices I made in Payout Ledger: the options, the
            one I took and what it costs.
          </p>
          <ol className="mt-10 max-w-[64rem] border-t border-border">
            {articles.map((article) => (
              <li
                key={article.slug}
                className="group relative grid gap-x-8 gap-y-2 border-b border-border py-7 sm:grid-cols-[8rem_1fr_auto]"
              >
                <time
                  dateTime={article.date}
                  className="font-mono text-[0.8rem] text-muted-foreground sm:pt-1.5"
                >
                  {formatShortDate(article.date)}
                </time>
                <div>
                  <h3 className="text-[1.35rem] leading-[1.25] font-semibold text-balance transition-colors group-focus-within:text-brand group-hover:text-brand">
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
        </section>

        <div className="mt-20 sm:mt-28">
          <NextEpisode slug={SLUG} />
        </div>
      </div>
    </main>
  );
}
