import { ArrowUpRight } from "lucide-react";
import { education, experience } from "@/content";
import { Section } from "../section";

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I have worked">
      <ol className="border-t-2 border-foreground">
        {experience.map((job) => (
          <li
            key={`${job.company}-${job.period}`}
            className="grid gap-x-6 border-b border-border py-5 sm:grid-cols-[9rem_1fr]"
          >
            <p className="pt-1.5 font-mono text-[0.85rem] text-muted-foreground">
              {job.period}
            </p>
            <div>
              <h3 className="font-display text-2xl font-bold tracking-[-0.02em]">
                {job.role} <span className="text-muted-foreground">·</span>{" "}
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
              <p className="mt-1 text-base text-muted-foreground">
                {job.detail}
              </p>
              <p className="mt-3 max-w-2xl text-[1.1rem] text-pretty">
                {job.summary}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8 max-w-2xl text-[1.1rem] text-pretty text-muted-foreground">
        {education}
      </p>
    </Section>
  );
}
