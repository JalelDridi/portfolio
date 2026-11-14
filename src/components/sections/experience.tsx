import { ArrowUpRight } from "lucide-react";
import { education, experience } from "@/content";
import { cn } from "@/lib/utils";
import { ClosedDoor } from "../motifs";
import { Section } from "../section";

/** A vertical rail of studs, drawn as a repeating dot. */
const RAIL =
  "bg-[radial-gradient(circle,color-mix(in_oklch,var(--foreground)_55%,transparent)_2.4px,transparent_3px)] bg-[length:8px_16px] bg-repeat-y";

/**
 * One row per role, newest first, each behind a small closed door in the
 * paint of its work, with the period under the door. A rail of studs runs
 * down the rows; the current role (the one whose period runs to the present)
 * carries a door-yellow stud on it.
 */
export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I have worked">
      <ol>
        {experience.map((job) => (
          <li
            key={`${job.company}-${job.period}`}
            className="grid grid-cols-[2.75rem_1fr] gap-x-5 sm:grid-cols-[10rem_1fr] sm:gap-x-8"
          >
            <ClosedDoor
              motif={job.door.motif}
              paint={job.door.paint}
              className="row-span-2 mt-2 self-start sm:row-span-1 sm:mt-6 sm:w-14"
            />
            <p className="col-start-2 pt-2 font-mono text-[0.8rem] text-muted-foreground sm:col-start-1 sm:row-start-2 sm:pt-3 sm:pb-8">
              {job.period}
            </p>
            <div className="relative col-start-2 pt-1 pb-8 pl-7 sm:row-span-2 sm:row-start-1 sm:pt-6">
              <span
                aria-hidden="true"
                className={cn("absolute inset-y-0 left-0 w-2", RAIL)}
              />
              {job.period.endsWith("present") && (
                <span
                  aria-hidden="true"
                  className="absolute top-[0.55rem] -left-[3px] size-[14px] rounded-full bg-sun shadow-[0_0_0_3px_var(--background)] sm:top-[2.1rem]"
                />
              )}
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
