import Image from "next/image";
import { about, shell } from "@/content";
import { LABEL_MUTED } from "@/lib/styles";
import { Section } from "../section";
import { WorldClocks } from "../world-clocks";

const LABEL = shell.nav.find((item) => item.href === "/about")?.label ?? "";

/** The story, the facts and the clocks at the right; the portrait under the title. */
export function About() {
  const { portrait, figure } = about;
  return (
    <Section
      id="about"
      label={LABEL}
      title={about.title}
      aside={
        <figure className="mt-10 max-w-[26rem]">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            sizes="(min-width: 640px) 442px, calc(100vw - 2rem)"
            loading="eager"
            className="aspect-square w-full object-cover"
          />
          <figcaption className="mt-3 font-mono text-[0.8rem] text-muted-foreground">
            {figure.label} · {figure.coordinates}
          </figcaption>
        </figure>
      }
    >
      {about.paragraphs.map((paragraph, index) => (
        <p
          key={paragraph}
          className={
            index === 0
              ? "mb-6 max-w-[44rem] text-[1.3rem] leading-[1.5] text-pretty"
              : "mb-5 max-w-[44rem] text-[1.1rem] leading-[1.65] text-pretty"
          }
        >
          {paragraph}
        </p>
      ))}

      <dl className="mt-10 grid border-t border-border sm:grid-cols-2 sm:gap-x-12">
        {about.facts.map((fact) => (
          <div key={fact.label} className="border-b border-border py-4">
            <dt className={LABEL_MUTED}>{fact.label}</dt>
            <dd className="mt-1.5 text-[1.05rem] text-pretty">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12">
        <WorldClocks
          clocks={about.clocks}
          className="grid-cols-2 min-[640px]:grid-cols-4"
        />
        <p className="mt-6 text-[0.95rem] text-muted-foreground">
          {about.clocksCaption}
        </p>
      </div>
    </Section>
  );
}
