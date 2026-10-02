import Image from "next/image";
import { about } from "@/content";
import { Reveal } from "../reveal";
import { Section } from "../section";
import { BorderBeam } from "../ui/border-beam";
import { WorldClocks } from "../world-clocks";

export function About() {
  const { portrait } = about;
  return (
    <Section id="about" eyebrow="About" title={about.title}>
      <div className="grid items-start gap-10 *:min-w-0 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal>
          <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-border bg-card lg:mx-0">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              sizes="(min-width: 1024px) 400px, 384px"
              className="aspect-square w-full object-cover"
            />
            <dl className="flex flex-col divide-y divide-border">
              {about.facts.map((fact) => (
                <div key={fact.label} className="px-5 py-3.5">
                  <dt className="font-mono text-sm tracking-widest text-brand uppercase">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-lg text-pretty">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <BorderBeam
              size={160}
              duration={11}
              colorFrom="var(--brand-bright)"
              colorTo="var(--brand-2)"
            />
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          {about.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph} delay={index * 0.06}>
              <p
                className={
                  index === 0
                    ? "text-2xl leading-relaxed text-pretty"
                    : "text-xl leading-relaxed text-pretty text-muted-foreground"
                }
              >
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <div className="mt-4 rounded-2xl border border-border bg-card p-6">
              <WorldClocks clocks={about.clocks} />
              <p className="mt-5 text-center text-base text-muted-foreground">
                {about.clocksCaption}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
