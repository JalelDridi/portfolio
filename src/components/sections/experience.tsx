import { ArrowUpRight } from "lucide-react";
import { education, experience } from "@/content";
import { cn } from "@/lib/utils";
import { Reveal } from "../reveal";
import { Section } from "../section";

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I have worked">
      <ol className="relative flex flex-col gap-10 border-l border-border pl-6 sm:pl-8">
        {experience.map((job, index) => (
          <li key={`${job.company}-${job.period}`} className="relative">
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1.5 -left-[1.8125rem] size-2.5 rounded-full ring-4 ring-background sm:-left-[2.3125rem]",
                index === 0 ? "bg-brand-bright" : "bg-muted-foreground/40",
              )}
            />
            <Reveal delay={index * 0.05}>
              <p className="font-mono text-xs text-muted-foreground">
                {job.period}
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">
                {job.role}
                <span className="text-muted-foreground"> · </span>
                {job.href ? (
                  <a
                    href={job.href}
                    className="inline-flex items-center gap-0.5 underline decoration-border underline-offset-4 hover:decoration-brand"
                  >
                    {job.company}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                ) : (
                  job.company
                )}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{job.detail}</p>
              <p className="mt-3 max-w-2xl text-pretty">{job.summary}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal>
        <p className="mt-10 max-w-2xl text-muted-foreground">{education}</p>
      </Reveal>
    </Section>
  );
}
