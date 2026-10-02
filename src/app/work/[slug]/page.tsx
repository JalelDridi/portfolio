import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/link-button";
import { ClipFigure, ShotFigure } from "@/components/media";
import { DiagramPanel } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { Rise } from "@/components/rise";
import { Tags } from "@/components/tags";
import { type Project, projects, type Shot } from "@/content";

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
  };
}

function DiagramFigure({ project }: { project: Project }) {
  if (project.visual.kind !== "diagram") return null;
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card">
      <DiagramPanel project={project} size="page" />
      <figcaption className="border-t border-border px-5 py-3 text-base text-muted-foreground">
        {project.visual.diagram.caption}
      </figcaption>
    </figure>
  );
}

function SectionLabel({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="font-mono text-sm font-medium tracking-widest text-brand uppercase"
    >
      {children}
    </h2>
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
    ...(visual.kind === "image" && (lead !== "visual" || cover)
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
  const showDiagramBelow = visual.kind === "diagram" && lead !== "visual";

  return (
    <main className="mx-auto w-full max-w-5xl px-5 pt-28 pb-16 sm:pb-24">
      <Rise>
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> All work
        </Link>
        <p className="mt-8 font-mono text-sm font-medium tracking-widest text-brand uppercase">
          {project.company} · {project.year}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-5 max-w-3xl text-xl text-pretty text-muted-foreground sm:text-2xl">
          {project.summary}
        </p>
      </Rise>

      <Rise delay={100} className="mt-10">
        {lead === "clip" && clip && <ClipFigure clip={clip} />}
        {lead === "cover" && cover && <ShotFigure shot={cover} priority />}
        {lead === "visual" && visual.kind === "diagram" && (
          <DiagramFigure project={project} />
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

      <div className="mt-14 grid gap-12 md:grid-cols-[1fr_16rem]">
        <div className="flex flex-col gap-12">
          <Reveal>
            <section aria-labelledby="why">
              <SectionLabel id="why">Why it existed</SectionLabel>
              <p className="mt-4 text-xl leading-relaxed text-pretty">
                {project.why}
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section aria-labelledby="built">
              <SectionLabel id="built">What I built</SectionLabel>
              <ul className="mt-5 flex flex-col gap-4">
                {project.built.map((item) => (
                  <li key={item} className="flex gap-3 text-lg leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-3 size-1.5 shrink-0 rounded-full bg-brand"
                    />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          {project.outcome && (
            <Reveal>
              <section aria-labelledby="outcome">
                <SectionLabel id="outcome">Outcome</SectionLabel>
                <p className="mt-4 text-xl leading-relaxed text-pretty">
                  {project.outcome}
                </p>
              </section>
            </Reveal>
          )}

          {project.note && (
            <p className="rounded-xl border border-border bg-muted/50 p-4 text-base text-muted-foreground">
              {project.note}
            </p>
          )}
        </div>

        <Reveal delay={0.1}>
          <aside className="flex flex-col gap-7">
            <div>
              <h2 className="mb-3 text-base font-semibold">Stack</h2>
              <Tags items={project.stack} />
            </div>
            {project.links.length > 0 && (
              <div>
                <h2 className="mb-3 text-base font-semibold">Links</h2>
                <ul className="flex flex-col items-start gap-2">
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
              </div>
            )}
          </aside>
        </Reveal>
      </div>

      {stills.length > 0 && (
        <section aria-labelledby="screens" className="mt-16">
          <Reveal>
            <SectionLabel id="screens">On screen</SectionLabel>
          </Reveal>
          <div className="mt-6 flex flex-col gap-12">
            {stills.map((shot) => (
              <Reveal key={shot.src}>
                <ShotFigure shot={shot} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {showDiagramBelow && (
        <section aria-labelledby="architecture" className="mt-16">
          <Reveal>
            <SectionLabel id="architecture">How it fits together</SectionLabel>
            <div className="mt-6">
              <DiagramFigure project={project} />
            </div>
          </Reveal>
        </section>
      )}

      <Link
        href={`/work/${next.slug}`}
        className="group mt-16 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/50"
      >
        <span>
          <span className="block font-mono text-sm text-muted-foreground">
            Next
          </span>
          <span className="mt-1 block text-2xl font-semibold tracking-tight">
            {next.title}
          </span>
        </span>
        <ArrowRight
          className="size-5 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </main>
  );
}
