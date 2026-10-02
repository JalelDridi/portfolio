import { ArrowUpRight, BookOpen } from "lucide-react";
import { flagship } from "@/content";
import { BrowserFrame } from "../browser-frame";
import { GitHubIcon } from "../icons";
import { LazyVideo } from "../lazy-video";
import { LinkButton } from "../link-button";
import { Reveal } from "../reveal";
import { Section } from "../section";
import { Tags } from "../tags";
import { BorderBeam } from "../ui/border-beam";

export function Flagship() {
  return (
    <Section
      id="project"
      eyebrow="Open-source project"
      title={`${flagship.name}: ${flagship.tagline.toLowerCase()}`}
      description={flagship.summary}
    >
      <div className="grid items-start gap-10 *:min-w-0 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <BrowserFrame url="payout-ledger-gamma.vercel.app">
            <LazyVideo
              className="aspect-[16/10] w-full bg-black"
              webm={flagship.video.webm}
              mp4={flagship.video.mp4}
              poster={flagship.video.poster}
              label={flagship.video.label}
            />
            <BorderBeam
              size={160}
              duration={10}
              colorFrom="var(--brand-bright)"
              colorTo="var(--brand-2)"
            />
          </BrowserFrame>
          <p className="mt-3 text-base text-muted-foreground">
            A dropped webhook is sent, the checks run, and reconciliation flags
            the payout the ledger has fallen behind on.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6">
          <ul className="grid gap-3">
            {flagship.points.map((point, index) => (
              <li key={point.title}>
                <Reveal delay={index * 0.06}>
                  <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/50">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-base text-pretty text-muted-foreground">
                      {point.text}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal delay={0.25}>
            <Tags items={flagship.stack} />
            <div className="mt-5 flex flex-wrap gap-3">
              <LinkButton variant="primary" href={flagship.demo}>
                Try the live demo <ArrowUpRight aria-hidden="true" />
              </LinkButton>
              <LinkButton href={flagship.repo}>
                <GitHubIcon /> Read the code
              </LinkButton>
              <LinkButton href={flagship.decisions}>
                <BookOpen aria-hidden="true" /> Design decisions
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
