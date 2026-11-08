import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LinkButton } from "@/components/link-button";
import { ClipFigure, ShotFigure } from "@/components/media";
import { DiagramPanel } from "@/components/project-visual";
import { Rise } from "@/components/rise";
import { Tags } from "@/components/tags";
import { type DiagramSpec, projects, type Shot } from "@/content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Only the listed projects exist; anything else is a 404.
export const dynamicParams = false;

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

const LABEL =
  "font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase";

function DiagramFigure({ spec }: { spec: DiagramSpec }) {
  return (
    <figure className="overflow-hidden border border-foreground bg-card">
      <DiagramPanel spec={spec} size="page" />
      <figcaption className="border-t border-border px-4 py-2 font-mono text-[0.85rem] text-muted-foreground">
        {spec.caption}
      </figcaption>
    </figure>
  );
}

/** What was built, as a lettered list. */
function BuiltList({ items }: { items: string[] }) {
  return (
    <ol className="max-w-3xl">
      {items.map((item, itemIndex) => (
        <li
          key={item}
          className="grid grid-cols-[1.6rem_1fr] border-b border-border py-3 text-lg leading-relaxed"
        >
          <span
            aria-hidden="true"
            className="pt-0.5 font-mono text-[0.85rem] text-muted-foreground"
          >
            {String.fromCharCode(97 + itemIndex)}
          </span>
          <span className="text-pretty">{item}</span>
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

export default async function CaseStudy(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const { visual, clip, cover } = project;

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
    <main className="mx-auto w-full max-w-6xl px-5 pt-24 pb-16 sm:pb-24">
      <Rise>
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-base font-medium text-muted-foreground transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> All work
        </Link>
        <p className={`mt-8 ${LABEL}`}>
          {project.company} · {project.year}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-balance">
          {project.title}
        </h1>
        <p className="mt-6 max-w-3xl text-[1.3rem] text-pretty text-muted-foreground">
          {project.summary}
        </p>
      </Rise>

      <Rise delay={100} className="mt-10">
        {lead === "clip" && clip && <ClipFigure clip={clip} />}
        {lead === "cover" && cover && <ShotFigure shot={cover} priority />}
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
      </Rise>

      <div className="mt-12 border-t-2 border-foreground">
        <Row label="Why it existed" id="why">
          <p className="max-w-3xl text-[1.2rem] leading-relaxed text-pretty">
            {project.why}
          </p>
        </Row>

        {project.parts?.map((part) => (
          <Row key={part.title} label={part.title} id={partId(part.title)}>
            <div className="flex flex-col gap-8">
              {part.why && (
                <p className="max-w-3xl text-[1.2rem] leading-relaxed text-pretty">
                  {part.why}
                </p>
              )}
              <BuiltList items={part.built} />
              {part.outcome && (
                <p className="max-w-3xl text-[1.2rem] leading-relaxed text-pretty">
                  {part.outcome}
                </p>
              )}
              {part.diagram && <DiagramFigure spec={part.diagram} />}
            </div>
          </Row>
        ))}

        {project.built.length > 0 && (
          <Row label="What I built" id="built">
            <BuiltList items={project.built} />
          </Row>
        )}

        {project.outcome && (
          <Row label="Outcome" id="outcome">
            <p className="max-w-3xl text-[1.2rem] leading-relaxed text-pretty">
              {project.outcome}
            </p>
          </Row>
        )}

        {project.note && (
          <div className="grid gap-x-8 border-t border-border py-8 md:grid-cols-[10rem_1fr]">
            <p className="max-w-3xl text-base text-pretty text-muted-foreground md:col-start-2">
              {project.note}
            </p>
          </div>
        )}

        <Row label="Stack" id="stack">
          <Tags items={project.stack} />
        </Row>

        {project.links.length > 0 && (
          <Row label="Links" id="links">
            <ul className="flex flex-wrap gap-3">
              {project.links.map((link, linkIndex) => (
                <li key={link.href}>
                  <LinkButton
                    href={link.href}
                    variant={linkIndex === 0 ? "primary" : "outline"}
                    className="h-auto min-h-11 py-2 text-left"
                  >
                    {link.label}
                    <ArrowUpRight className="shrink-0" aria-hidden="true" />
                  </LinkButton>
                </li>
              ))}
            </ul>
          </Row>
        )}

        {stills.length > 0 && (
          <Row label="On screen" id="screens">
            <div className="flex flex-col gap-12">
              {stills.map((shot) => (
                <ShotFigure key={shot.src} shot={shot} />
              ))}
            </div>
          </Row>
        )}

        {showDiagramBelow && (
          <Row label="How it fits together" id="architecture">
            <DiagramFigure spec={visual.diagram} />
          </Row>
        )}
      </div>

      <Link
        href={`/work/${next.slug}`}
        className="group mt-12 grid gap-x-8 gap-y-2 border-y-2 border-foreground py-6 transition-colors hover:text-brand md:grid-cols-[10rem_1fr]"
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
    </main>
  );
}
