import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  EpisodeHead,
  FactLinks,
  StackLine,
} from "@/components/episodes/episode-head";
import { NextEpisode } from "@/components/episodes/next-episode";
import { episodeFile } from "@/components/episodes/order";
import { ClipFigure, ShotFigure } from "@/components/media";
import { DiagramPanel } from "@/components/project-visual";
import { type DiagramSpec, episodes, projects, type Shot, ui } from "@/content";
import { CONTAINER, LABEL } from "@/lib/styles";

/*
 * Only the listed projects exist. Any other slug reaches `notFound()` below
 * and answers 404 (tested). `dynamicParams = false` gives the same 404 but
 * makes the server log a NoFallbackError for every unknown slug.
 */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    // Without this a shared case study would show the home page's card.
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/work/${project.slug}`,
      type: "article",
    },
  };
}

/** Long text: Onest, at a size that reads comfortably. */
const PROSE = "max-w-[40rem] text-[1.15rem] leading-[1.7] text-pretty";

const pad = (n: number) => String(n).padStart(2, "0");

/** An architecture sketch in a thin dark frame, captioned below. */
function DiagramFigure({ spec }: { spec: DiagramSpec }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="border border-border bg-card">
        <DiagramPanel spec={spec} size="page" />
      </div>
      <figcaption className="font-mono text-[0.8rem] leading-relaxed text-pretty text-muted-foreground">
        {spec.caption}
      </figcaption>
    </figure>
  );
}

/** What was built, as a numbered list under hairlines. */
function BuiltList({ items }: { items: string[] }) {
  return (
    <ol className="max-w-[44rem] border-t border-border">
      {items.map((item, index) => (
        <li
          key={item}
          className="grid grid-cols-[2.5rem_1fr] border-b border-border py-4"
        >
          <span
            aria-hidden="true"
            className="pt-[0.3rem] font-mono text-[0.8rem] text-brand"
          >
            {pad(index + 1)}
          </span>
          <span className="text-[1.08rem] leading-[1.65] text-pretty">
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** An id for a part's heading, from its title. */
function partId(title: string) {
  return `part-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

/** A section of the single column, under a hairline, with a mono label. */
function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-border py-12 sm:py-16"
    >
      <h2 id={id} className={LABEL}>
        {label}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function CaseStudy(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const { visual, clip, cover } = project;
  // A still on the home page grows into this page's lead picture when they
  // are the same picture.
  const still = episodes.find((episode) => episode.slug === slug)?.still.src;

  // The lead picture is the most vivid thing available: a recording, then a
  // screenshot, then the architecture sketch.
  const lead = clip ? "clip" : cover ? "cover" : "visual";
  // Everything not used as the lead goes in the gallery.
  const stills: Shot[] = [
    ...(cover && lead !== "cover" ? [cover] : []),
    ...(visual.kind === "image" &&
    (lead !== "visual" || cover) &&
    visual.src !== cover?.src
      ? [
          {
            ...visual,
            caption: "Where it starts: one address, a price, beds and baths.",
            frame: "browser" as const,
            url: "grade.offa.com",
          },
        ]
      : []),
    ...(project.gallery ?? []),
  ];
  // A case study in parts draws each part's diagram beside it instead.
  const showDiagramBelow =
    visual.kind === "diagram" && lead !== "visual" && !project.parts;

  return (
    <main className="pb-8">
      <EpisodeHead
        file={episodeFile(slug)}
        title={project.title}
        summary={project.summary}
        facts={[
          {
            label: ui.facts.role,
            value: `${project.company} · ${project.year}`,
          },
          { label: ui.facts.stack, value: <StackLine items={project.stack} /> },
          ...(project.links.length > 0
            ? [
                {
                  label: ui.facts.links,
                  value: <FactLinks links={project.links} />,
                },
              ]
            : []),
        ]}
      >
        {lead === "clip" && clip && <ClipFigure clip={clip} />}
        {lead === "cover" && cover && (
          <ShotFigure
            shot={cover}
            priority
            transitionName={
              cover.src === still ? `episode-still-${slug}` : undefined
            }
          />
        )}
        {lead === "visual" && visual.kind === "diagram" && (
          <DiagramFigure spec={visual.diagram} />
        )}
        {lead === "visual" && visual.kind === "image" && (
          <ShotFigure
            priority
            shot={{
              ...visual,
              caption: "",
              frame: "browser",
              url: "grade.offa.com",
            }}
          />
        )}
      </EpisodeHead>

      <div className={`${CONTAINER} mt-16 sm:mt-24`}>
        <div className="max-w-[64rem]">
          <Section id="why" label="Why it existed">
            <p className="max-w-[40rem] text-[1.3rem] leading-[1.55] text-pretty sm:text-[1.45rem]">
              {project.why}
            </p>
          </Section>

          {project.parts?.map((part, partIndex) => {
            const id = partId(part.title);
            return (
              <section
                key={part.title}
                aria-labelledby={id}
                className="border-t border-border py-12 sm:py-16"
              >
                <p aria-hidden="true" className={LABEL}>
                  {pad(partIndex + 1)} / {pad(project.parts?.length ?? 0)}
                </p>
                <h2
                  id={id}
                  className="mt-3 font-display text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance"
                >
                  {part.title}
                </h2>
                <div className="mt-7 flex flex-col gap-8">
                  {part.why && <p className={PROSE}>{part.why}</p>}
                  <BuiltList items={part.built} />
                  {part.outcome && <p className={PROSE}>{part.outcome}</p>}
                  {part.diagram && <DiagramFigure spec={part.diagram} />}
                </div>
              </section>
            );
          })}

          {project.built.length > 0 && (
            <Section id="built" label="What I built">
              <BuiltList items={project.built} />
            </Section>
          )}

          {project.outcome && (
            <Section id="outcome" label="Outcome">
              <p className={PROSE}>{project.outcome}</p>
            </Section>
          )}

          {project.note && (
            <p className="max-w-[40rem] border-t border-border py-10 text-base leading-relaxed text-pretty text-muted-foreground">
              {project.note}
            </p>
          )}

          {stills.length > 0 && (
            <Section id="screens" label="On screen">
              <div className="flex flex-col gap-14">
                {stills.map((shot) => (
                  <ShotFigure key={shot.src} shot={shot} />
                ))}
              </div>
            </Section>
          )}

          {showDiagramBelow && (
            <Section id="architecture" label="How it fits together">
              <DiagramFigure spec={visual.diagram} />
            </Section>
          )}
        </div>

        <NextEpisode slug={slug} />
      </div>
    </main>
  );
}
