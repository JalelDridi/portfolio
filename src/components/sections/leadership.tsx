import { ArrowUpRight } from "lucide-react";
import { leadership } from "@/content";
import { cn } from "@/lib/utils";
import { Section } from "../section";

export function Leadership() {
  const { organisation, roles, activity, also } = leadership;
  return (
    <Section
      id="leadership"
      eyebrow="Leadership"
      title={leadership.title}
      description={leadership.intro}
    >
      <div className="grid gap-10 *:min-w-0 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-[1.1rem]">
            <span className="font-semibold">{organisation.name}</span>{" "}
            <span className="text-muted-foreground">
              · {organisation.detail}
            </span>
          </p>
          <ol className="flex flex-wrap gap-x-6 gap-y-2 text-[1.1rem]">
            {roles.map((item, index) => (
              <li
                key={item.year}
                className={cn(index === roles.length - 1 && "font-semibold")}
              >
                <span className="font-mono text-[0.85rem] text-muted-foreground">
                  {item.year}
                </span>{" "}
                {item.role}
              </li>
            ))}
          </ol>
          <a
            href={organisation.href}
            className="mt-6 inline-flex items-center gap-1 text-base font-medium underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
          >
            {organisation.linkLabel}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <div className="flex flex-col gap-4 text-[1.1rem] text-pretty">
          <p>{leadership.bridge}</p>
          <div>
            <h3 className="font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase">
              {activity.label}
            </h3>
            <ul className="mt-2">
              {activity.items.map((item) => (
                <li key={item} className="border-t border-border py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {also.map((item) => (
            <p key={item.organisation} className="text-muted-foreground">
              {item.role} · {item.organisation}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
