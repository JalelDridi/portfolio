import { education, experience } from "@/content";
import { Section } from "../section";

/** One row per role, newest first: the period, then the role, the company and what I did. */
export function Experience() {
  return (
    <Section id="experience" label="Experience" title="Where I have worked">
      <ol>
        {experience.map((job) => (
          <li
            key={`${job.company}-${job.period}`}
            className="grid gap-x-8 gap-y-2 border-b border-border py-7 first:pt-0 sm:grid-cols-[10rem_minmax(0,1fr)]"
          >
            <p className="font-mono text-[0.8rem] text-muted-foreground sm:pt-1.5">
              {job.period}
            </p>
            <div>
              <h3 className="text-[1.3rem] leading-[1.3] font-semibold text-balance">
                {job.role} <span className="text-muted-foreground">·</span>{" "}
                {job.href ? (
                  <a
                    href={job.href}
                    className="underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                  >
                    {job.company}
                    <span aria-hidden="true" className="text-brand">
                      {" "}
                      ↗
                    </span>
                  </a>
                ) : (
                  job.company
                )}
              </h3>
              <p className="mt-1.5 font-mono text-[0.8rem] text-muted-foreground">
                {job.detail}
              </p>
              <p className="mt-3 max-w-[44rem] text-[1.05rem] leading-[1.6] text-pretty">
                {job.summary}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 max-w-[44rem] text-[1.02rem] leading-[1.6] text-pretty text-muted-foreground">
        {education}
      </p>
    </Section>
  );
}
