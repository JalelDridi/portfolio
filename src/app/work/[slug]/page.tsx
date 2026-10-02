import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowserFrame } from "@/components/browser-frame";
import { LinkButton } from "@/components/link-button";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { Tags } from "@/components/tags";
import { projects } from "@/content";

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

export default async function CaseStudy(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const { visual } = project;

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pt-28 pb-16 sm:pb-24">
      <Reveal>
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> All work
        </Link>
        <p className="mt-8 font-mono text-xs font-medium tracking-widest text-brand uppercase">
          {project.company} · {project.year}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-pretty text-muted-foreground">
          {project.summary}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        {visual.kind === "image" ? (
          <BrowserFrame url={new URL(project.links[0].href).hostname}>
            <ProjectVisual project={project} size="page" />
          </BrowserFrame>
        ) : (
          <figure className="overflow-hidden rounded-2xl border border-border bg-card">
            <ProjectVisual project={project} size="page" />
            <figcaption className="border-t border-border px-5 py-3 text-sm text-muted-foreground">
              {visual.diagram.caption}
            </figcaption>
          </figure>
        )}
      </Reveal>

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_15rem]">
        <div className="flex flex-col gap-10">
          <Reveal>
            <section aria-labelledby="why">
              <h2
                id="why"
                className="font-mono text-xs font-medium tracking-widest text-brand uppercase"
              >
                Why it existed
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-pretty">
                {project.why}
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section aria-labelledby="built">
              <h2
                id="built"
                className="font-mono text-xs font-medium tracking-widest text-brand uppercase"
              >
                What I built
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {project.built.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand"
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
                <h2
                  id="outcome"
                  className="font-mono text-xs font-medium tracking-widest text-brand uppercase"
                >
                  Outcome
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-pretty">
                  {project.outcome}
                </p>
              </section>
            </Reveal>
          )}

          {project.note && (
            <p className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
              {project.note}
            </p>
          )}
        </div>

        <Reveal delay={0.1}>
          <aside className="flex flex-col gap-6">
            <div>
              <h2 className="mb-3 text-sm font-semibold">Stack</h2>
              <Tags items={project.stack} />
            </div>
            {project.links.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold">Links</h2>
                <ul className="flex flex-col items-start gap-2">
                  {project.links.map((link, linkIndex) => (
                    <li key={link.href}>
                      <LinkButton
                        href={link.href}
                        variant={linkIndex === 0 ? "primary" : "outline"}
                        className="h-auto min-h-10 py-2 text-left"
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

      <Link
        href={`/work/${next.slug}`}
        className="group mt-16 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/50"
      >
        <span>
          <span className="block font-mono text-xs text-muted-foreground">
            Next
          </span>
          <span className="mt-1 block text-xl font-semibold tracking-tight">
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
