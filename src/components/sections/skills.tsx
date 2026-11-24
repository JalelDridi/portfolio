import { skills } from "@/content";
import { LABEL_MUTED } from "@/lib/styles";
import { Section } from "../section";

/** One row per group: its name in mono, then the tools. */
export function Skills() {
  return (
    <Section
      id="skills"
      label="Skills"
      title="The stack I work in"
      description="TypeScript end to end, PostgreSQL underneath, and the infrastructure to ship it."
    >
      <dl className="grid sm:grid-cols-2 sm:gap-x-12">
        {skills.map((group) => (
          <div
            key={group.group}
            className="border-b border-border py-5 first:pt-0 sm:nth-2:pt-0"
          >
            <dt className={LABEL_MUTED}>{group.group}</dt>
            <dd className="mt-2 text-[1.1rem] leading-[1.5] text-pretty">
              {group.items.join(" · ")}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
