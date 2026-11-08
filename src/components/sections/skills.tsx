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
      <dl className="border-t-2 border-foreground">
        {skills.map((group) => (
          <div
            key={group.group}
            className="grid gap-x-6 border-b border-border py-3.5 sm:grid-cols-[10rem_1fr]"
          >
            <dt className="font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase">
              {group.group}
            </dt>
            <dd className="text-[1.1rem] text-pretty">
              {group.items.join(" · ")}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
