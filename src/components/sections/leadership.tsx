import { leadership } from "@/content";
import { LABEL_MUTED } from "@/lib/styles";
import { Section } from "../section";

/** The three JCI roles in order, the chapter, its year, and the town it is named after. */
export function Leadership() {
  const { organisation, roles, activity, also } = leadership;
  return (
    <Section
      id="leadership"
      label="Leadership"
      title={leadership.title}
      description={leadership.intro}
    >
      <ol>
        {roles.map((item) => (
          <li
            key={item.year}
            className="grid grid-cols-[5rem_minmax(0,1fr)] items-baseline gap-x-6 border-b border-border py-4 first:pt-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-x-8"
          >
            <span className="font-mono text-[0.8rem] text-muted-foreground">
              {item.year}
            </span>{" "}
            <span className="text-[1.3rem] leading-[1.3] font-semibold">
              {item.role}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[1.05rem] leading-[1.6] text-pretty">
        <span className="font-semibold">{organisation.name}</span>{" "}
        <span className="text-muted-foreground">· {organisation.detail}</span>
      </p>
      <a
        href={organisation.href}
        className="mt-2 inline-block font-mono text-[0.9rem] underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
      >
        {organisation.linkLabel}
        <span aria-hidden="true" className="text-brand">
          {" "}
          ↗
        </span>
      </a>

      <h3 className={`mt-12 ${LABEL_MUTED}`}>{activity.label}</h3>
      <ul className="mt-3 max-w-[44rem] border-t border-border">
        {activity.items.map((item) => (
          <li
            key={item}
            className="border-b border-border py-3 text-[1.05rem] text-pretty"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex max-w-[44rem] flex-col gap-4 text-[1.05rem] leading-[1.6] text-pretty">
        <p>{leadership.bridge}</p>
        {also.map((item) => (
          <p key={item.organisation} className="text-muted-foreground">
            {item.role} · {item.organisation}
          </p>
        ))}
        <p className="text-muted-foreground">{leadership.place}</p>
      </div>
    </Section>
  );
}
