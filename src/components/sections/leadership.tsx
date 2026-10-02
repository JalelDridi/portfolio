import { ArrowUpRight, Check } from "lucide-react";
import { leadership } from "@/content";
import { cn } from "@/lib/utils";
import { Reveal } from "../reveal";
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
      <div className="grid gap-6 *:min-w-0 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="h-full">
          <div className="h-full rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-2xl font-semibold tracking-tight">
              {organisation.name}
            </h3>
            <p className="mt-1 text-base text-muted-foreground">
              {organisation.detail}
            </p>

            {/* The three roles, joined by a line that fills left to right. */}
            <ol className="relative mt-8 grid grid-cols-3 gap-3">
              <span
                aria-hidden="true"
                className="absolute top-[0.6875rem] right-[16.6%] left-[16.6%] h-0.5 bg-gradient-to-r from-border via-brand/60 to-brand-bright"
              />
              {roles.map((item, index) => {
                const current = index === roles.length - 1;
                return (
                  <li
                    key={item.year}
                    className="relative flex flex-col items-center gap-2 text-center"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative flex size-6 items-center justify-center rounded-full ring-4 ring-card",
                        current ? "bg-brand-bright" : "bg-muted-foreground/50",
                      )}
                    >
                      {current && (
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-bright opacity-50" />
                      )}
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">
                      {item.year}
                    </span>
                    <span
                      className={cn(
                        "text-lg leading-snug font-semibold text-balance",
                        !current && "font-medium",
                      )}
                    >
                      {item.role}
                    </span>
                  </li>
                );
              })}
            </ol>

            <p className="mt-8 text-lg text-pretty">{leadership.bridge}</p>

            <a
              href={organisation.href}
              className="mt-6 inline-flex items-center gap-1 text-base font-medium underline decoration-border underline-offset-4 hover:decoration-brand"
            >
              {organisation.linkLabel}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal delay={0.06}>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-mono text-sm font-medium tracking-widest text-brand uppercase">
                {activity.label}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {activity.items.map((item) => (
                  <li key={item} className="flex gap-3 text-lg">
                    <Check
                      className="mt-1.5 size-4 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          {also.map((item) => (
            <Reveal key={item.organisation} delay={0.12}>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-mono text-sm font-medium tracking-widest text-brand uppercase">
                  Also
                </h3>
                <p className="mt-3 text-lg">
                  <span className="font-semibold">{item.role}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {item.organisation}
                  </span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
