import { skills } from "@/content";
import { Section } from "../section";

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="The stack I work in"
      description="TypeScript end to end, PostgreSQL underneath, and the infrastructure to ship it."
    >
      <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 min-[920px]:grid-cols-3">
        {skills.map((group) => (
          <div key={group.group}>
            <dt className="font-mono text-[0.78rem] tracking-[0.1em] text-brand uppercase">
              {group.group}
            </dt>
            <dd className="mt-2 font-display text-[1.25rem] leading-[1.35] font-bold tracking-[-0.015em] text-pretty">
              {group.items.join(" · ")}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
