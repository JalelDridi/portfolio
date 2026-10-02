import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { projects } from "@/content";
import { ProjectVisual } from "../project-visual";
import { Reveal } from "../reveal";
import { Section } from "../section";
import { Tags } from "../tags";

export function Work() {
  return (
    <Section
      id="work"
      eyebrow="Work"
      title="Things I have built and shipped"
      description="Most of this lives in private company repositories, so each one has a short case study: why it existed, what I built and what came of it."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const external = project.links[0];
          return (
            <li key={project.slug}>
              <Reveal delay={(index % 3) * 0.06} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30">
                  <div className="overflow-hidden border-b border-border bg-muted/40">
                    <ProjectVisual project={project} size="card" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="font-mono text-xs text-muted-foreground">
                      {project.company} · {project.year}
                    </p>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {/* The link stretches over the whole card. */}
                      <Link
                        href={`/work/${project.slug}`}
                        className="after:absolute after:inset-0"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    <p className="flex-1 text-sm text-pretty text-muted-foreground">
                      {project.summary}
                    </p>
                    <Tags items={project.stack.slice(0, 4)} />
                    <p
                      aria-hidden="true"
                      className="flex items-center gap-1.5 pt-1 text-sm font-medium"
                    >
                      Read the case study
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                  {external && (
                    <a
                      href={external.href}
                      aria-label={`${external.label} (opens ${new URL(external.href).hostname})`}
                      className="absolute top-3 right-3 z-10 inline-flex h-8 items-center gap-1 rounded-full border border-border bg-background/90 px-3 text-xs font-medium backdrop-blur transition-colors hover:bg-foreground hover:text-background"
                    >
                      Visit
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  )}
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
