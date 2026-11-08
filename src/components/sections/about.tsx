import Image from "next/image";
import { about } from "@/content";
import { Section } from "../section";
import { WorldClocks } from "../world-clocks";

export function About() {
  const { portrait, figure } = about;
  return (
    <Section id="about" eyebrow="About" title={about.title}>
      <div className="grid items-start gap-10 *:min-w-0 lg:grid-cols-[0.7fr_1.3fr]">
        <figure className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <div className="border border-foreground">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              sizes="(min-width: 1024px) 400px, 384px"
              className="aspect-square w-full object-cover"
            />
          </div>
          <figcaption className="mt-2 flex justify-between font-mono text-[0.85rem] text-muted-foreground">
            <span>{figure.label}</span>
            <span>{figure.coordinates}</span>
          </figcaption>
        </figure>

        <div className="flex flex-col gap-6">
          {about.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0
                  ? "text-[1.45rem] leading-snug text-pretty"
                  : "text-[1.15rem] leading-relaxed text-pretty text-muted-foreground"
              }
            >
              {paragraph}
            </p>
          ))}

          <dl className="grid gap-x-5 gap-y-4 border-t border-border pt-4 sm:grid-cols-3">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-medium text-pretty">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="border-y border-border py-5">
            <WorldClocks clocks={about.clocks} />
            <p className="mt-5 text-center text-base text-muted-foreground">
              {about.clocksCaption}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
