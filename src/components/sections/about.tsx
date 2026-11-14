import Image from "next/image";
import { about, profile } from "@/content";
import { ArchFrame } from "../motifs";
import { Section } from "../section";
import { WorldClocks } from "../world-clocks";

/** The same place and coordinates the header shows. */
const TAG = `Bizerte · ${profile.coordinates}`;

/** Splits the title so its last words can be set in blue. */
const ACCENT = "to moving money";

export function About() {
  const { portrait } = about;
  const title = about.title.endsWith(ACCENT)
    ? about.title.slice(0, -ACCENT.length).trim()
    : about.title;
  const accent = about.title.endsWith(ACCENT) ? ACCENT : undefined;

  return (
    <Section
      id="about"
      arabic="دار"
      eyebrow="Dar · at home"
      title={title}
      accent={accent}
    >
      <div className="grid items-start gap-[3.2rem] *:min-w-0 min-[920px]:grid-cols-[0.8fr_1.2fr] min-[920px]:grid-rows-[auto_1fr] min-[920px]:gap-y-8">
        <figure className="relative">
          <ArchFrame ratio={4 / 5} className="w-full bg-wall-2">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              sizes="(min-width: 920px) 480px, 92vw"
              className="object-cover"
            />
          </ArchFrame>
          <figcaption className="absolute -right-4 bottom-[1.4rem] bg-sun px-[0.7rem] py-[0.4rem] font-mono text-[0.76rem] text-[#101922]">
            {TAG}
          </figcaption>
        </figure>

        <div className="min-[920px]:col-start-2 min-[920px]:row-span-2 min-[920px]:row-start-1">
          {about.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0
                  ? "mb-5 font-display text-[clamp(1.25rem,1.9vw,1.45rem)] leading-[1.25] font-bold tracking-[-0.02em] text-pretty"
                  : "mb-4 text-[1.15rem] text-pretty"
              }
            >
              {paragraph}
            </p>
          ))}

          <dl className="mt-7 grid grid-cols-2 gap-x-[1.4rem] gap-y-4 border-t pt-5 min-[920px]:grid-cols-3">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-[0.8rem] tracking-[0.1em] text-brand uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-medium text-pretty">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/*
         * Under the portrait on wide screens, after the story on phones. Only
         * `min-[…]` breakpoints here: Tailwind emits them before `sm:`.
         */}
        <div className="bg-wall-2 px-4 py-6 sm:px-6 min-[920px]:col-start-1 min-[920px]:row-start-2">
          <WorldClocks
            clocks={about.clocks}
            className="grid-cols-2 min-[640px]:grid-cols-4 min-[920px]:grid-cols-2 min-[1280px]:grid-cols-4"
          />
          <p className="mt-5 text-center text-[0.95rem] text-muted-foreground">
            {about.clocksCaption}
          </p>
        </div>
      </div>
    </Section>
  );
}
