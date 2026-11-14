import { ArrowUpRight } from "lucide-react";
import { education, experience } from "@/content";
import { cn } from "@/lib/utils";
import { Section } from "../section";

/**
 * One row per role along a dashed line of studs, newest first; the current
 * role's stud (the one whose period runs to the present) is door yellow.
 */
export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I have worked">
      <ol>
        {experience.map((job) => (
          <li
            key={`${job.company}-${job.period}`}
            className="grid gap-x-8 sm:grid-cols-[10rem_1fr]"
          >
            <p className="pt-1 font-mono text-[0.8rem] text-muted-foreground sm:pt-7">
              {job.period}
            </p>
            <div className="relative border-l border-dashed border-foreground/30 pt-2 pb-8 pl-7 sm:pt-6">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-[0.95rem] rounded-full sm:top-[2.1rem]",
                  job.period.endsWith("present")
                    ? "-left-[7px] size-[13px] bg-sun shadow-[0_0_0_3px_var(--background)]"
                    : "-left-[5px] size-[9px] bg-foreground/80 shadow-[inset_-1px_-1px_0_rgba(255,255,255,0.3)]",
                )}
              />
              <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.75rem)] leading-[1.1] font-extrabold tracking-[-0.025em]">
                {job.role}{" "}
                <span className="font-medium text-muted-foreground">·</span>{" "}
                {job.href ? (
                  <a
                    href={job.href}
                    className="inline-flex items-center gap-0.5 text-brand transition-colors hover:text-foreground"
                  >
                    {job.company}
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </a>
                ) : (
                  job.company
                )}
              </h3>
              <p className="mt-1.5 font-mono text-[0.8rem] text-muted-foreground">
                {job.detail}
              </p>
              <p className="mt-3 max-w-[44rem] text-[1.08rem] text-pretty">
                {job.summary}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 max-w-[44rem] text-[1.05rem] text-pretty text-muted-foreground">
        {education}
      </p>
    </Section>
  );
}
