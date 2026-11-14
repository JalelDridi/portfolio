import { ArrowUpRight } from "lucide-react";
import { leadership } from "@/content";
import { cn } from "@/lib/utils";
import { Plaque } from "../motifs";
import { Section } from "../section";

/** Splits the title so its last words can be set in blue. */
const ACCENT = "outside of code";

export function Leadership() {
  const { organisation, roles, activity, also } = leadership;
  const title = leadership.title.endsWith(ACCENT)
    ? leadership.title.slice(0, -ACCENT.length).trim()
    : leadership.title;
  const accent = leadership.title.endsWith(ACCENT) ? ACCENT : undefined;

  return (
    <Section
      id="leadership"
      eyebrow="Leadership"
      title={title}
      accent={accent}
      description={leadership.intro}
    >
      <div className="grid gap-12 *:min-w-0 min-[920px]:grid-cols-[1.1fr_0.9fr]">
        <div>
          {/* Three steps up, one per role; the last is the one I hold now. */}
          <ol className="grid grid-cols-3 items-end gap-3 sm:gap-4">
            {roles.map((item, index) => (
              <li
                key={item.year}
                className={cn(
                  "flex flex-col justify-end border-t-4 px-2.5 pt-3 pb-4 sm:px-4",
                  index === roles.length - 1
                    ? "min-h-[9.5rem] border-sun bg-brand text-white dark:bg-brand-deep"
                    : "border-brand bg-wall-2",
                  index === 0 && "min-h-[6.5rem]",
                  index === 1 && "min-h-[8rem]",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[0.8rem]",
                    index === roles.length - 1
                      ? "text-[#dce8f6]"
                      : "text-muted-foreground",
                  )}
                >
                  {item.year}
                </span>{" "}
                <span className="mt-1 font-display text-[clamp(0.92rem,2vw,1.3rem)] leading-[1.1] font-extrabold tracking-[-0.02em] [overflow-wrap:anywhere]">
                  {item.role}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[1.08rem] text-pretty">
            <span className="font-semibold">{organisation.name}</span>{" "}
            <span className="text-muted-foreground">
              · {organisation.detail}
            </span>
          </p>
          <a
            href={organisation.href}
            className="mt-3 inline-flex items-center gap-1 border-b-[3px] border-sun pb-0.5 font-mono text-[0.9rem] transition-colors hover:text-brand"
          >
            {organisation.linkLabel}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <div className="flex flex-col gap-5 text-[1.08rem] text-pretty">
          <div>
            <h3 className="font-mono text-[0.8rem] tracking-[0.1em] text-brand uppercase">
              {activity.label}
            </h3>
            <ul className="mt-3 grid gap-2">
              {activity.items.map((item) => (
                <li key={item} className="grid grid-cols-[1.2rem_1fr] gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-[0.5rem] size-[0.55rem] rounded-full bg-foreground/80"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p>{leadership.bridge}</p>
          {also.map((item) => (
            <p key={item.organisation} className="text-muted-foreground">
              {item.role} · {item.organisation}
            </p>
          ))}
          {/* The column closes on the town's street plaque, as the hero opens on Bizerte's. */}
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-4 bg-wall-2 px-5 py-6 shadow-[0_0_0_1px_var(--border)] sm:px-6">
            <Plaque arabic="العالية" latin="EL ALIA · BIZERTE" />
            <p className="min-w-[14rem] flex-1">{leadership.place}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
