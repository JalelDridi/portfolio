import { ArrowUpRight, BookOpen } from "lucide-react";
import { flagship } from "@/content";
import { BrowserFrame } from "../browser-frame";
import { GitHubIcon } from "../icons";
import { LazyVideo } from "../lazy-video";
import { LinkButton } from "../link-button";
import { Section } from "../section";
import { Tags } from "../tags";

const LETTERS = ["a", "b", "c", "d"];

export function Flagship() {
  return (
    <Section
      id="project"
      eyebrow="Open-source project"
      title={`${flagship.name}: ${flagship.tagline.toLowerCase()}`}
      description={flagship.summary}
    >
      <div className="grid items-start gap-10 *:min-w-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <BrowserFrame
            url="payout-ledger-gamma.vercel.app"
            note="screen recording"
          >
            <LazyVideo
              className="aspect-[16/10] w-full bg-black"
              webm={flagship.video.webm}
              mp4={flagship.video.mp4}
              poster={flagship.video.poster}
              label={flagship.video.label}
            />
          </BrowserFrame>
          <p className="mt-3 text-[0.95rem] text-muted-foreground">
            A dropped webhook is sent, the checks run, and reconciliation flags
            the payout the ledger has fallen behind on.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <dl className="border-t border-border">
            {flagship.points.map((point, index) => (
              <div
                key={point.title}
                className="grid grid-cols-[1.6rem_1fr] border-b border-border py-3.5"
              >
                <dt className="font-mono text-[0.85rem] text-brand">
                  {LETTERS[index]}
                </dt>
                <dd>
                  <b className="block text-[1.1rem] font-semibold">
                    {point.title}
                  </b>
                  <span className="text-muted-foreground">{point.text}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div>
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
          </div>
        </div>
      </div>
    </Section>
  );
}
