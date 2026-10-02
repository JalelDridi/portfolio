import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { projects } from "@/content";
import { CardVisual } from "../project-visual";
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
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => {
          const external = project.links[0];
          return (
            <li key={project.slug}>
              <Reveal delay={(index % 2) * 0.06} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30">
                  <div className="overflow-hidden border-b border-border bg-muted/40">
                    <CardVisual project={project} />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <p className="font-mono text-sm text-muted-foreground">
                      {project.company} · {project.year}
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {/* The link stretches over the whole card. */}
                      <Link
                        href={`/work/${project.slug}`}
                        className="after:absolute after:inset-0"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    <p className="flex-1 text-base text-pretty text-muted-foreground">
                      {project.summary}
                    </p>
                    <Tags items={project.stack.slice(0, 4)} />
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <p
                        aria-hidden="true"
                        className="flex items-center gap-1.5 text-base font-medium"
                      >
                        Read the case study
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </p>
                      {external && (
                        <a
                          href={external.href}
                          aria-label={`${external.label} (opens ${new URL(external.href).hostname})`}
                          className="relative z-10 inline-flex h-9 items-center gap-1 rounded-full border border-border px-3.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
                        >
                          Visit
                          <ArrowUpRight
                            className="size-3.5"
                            aria-hidden="true"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
