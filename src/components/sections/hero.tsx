import { ArrowDown } from "lucide-react";
import { Fragment } from "react";
import { profile } from "@/content";
import { HeroDoor } from "../hero-door";
import { GitHubIcon, LinkedInIcon } from "../icons";
import { LinkButton } from "../link-button";
import { LocalTime } from "../local-time";
import { Rise } from "../rise";
import { TileBand } from "../motifs";

const OPEN_TO = "Open to ";

export function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.pop();
  const availability = profile.availability.startsWith(OPEN_TO) ? (
    <>
      {OPEN_TO}
      <b className="font-medium text-foreground">
        {profile.availability.slice(OPEN_TO.length)}
      </b>
    </>
  ) : (
    profile.availability
  );

  return (
    <section>
      <div className="mx-auto grid w-full max-w-[1280px] items-end gap-12 px-5 pt-6 min-[920px]:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Rise>
            <p className="mb-2.5 flex flex-wrap items-baseline gap-x-[0.9rem] gap-y-1">
              <span
                lang="ar"
                className="font-kufi text-[2.3rem] leading-none font-bold text-brand"
              >
                عسلامة
              </span>
              <span className="font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase">
                Aslema · hello from Tunisia
              </span>
            </p>
            <h1
              aria-label={profile.name}
              className="font-display text-[clamp(3.6rem,9.4vw,9rem)] leading-[0.9] font-black tracking-[-0.04em]"
            >
              <span className="mb-[0.35em] block text-[0.3em] font-medium tracking-[-0.01em] text-muted-foreground">
                {first}
              </span>
              {rest.map((word) => (
                <Fragment key={word}>
                  {" "}
                  <span className="block">{word}</span>
                </Fragment>
              ))}{" "}
              <span className="block">
                {last}
                <span aria-hidden="true" className="text-sun">
                  .
                </span>
              </span>
            </h1>
          </Rise>

          <Rise delay={100}>
            <p className="mt-6 mb-3 max-w-[34rem] font-display text-[1.5rem] leading-[1.2] font-bold tracking-[-0.02em]">
              {profile.role}.{" "}
              <b className="font-extrabold text-brand">{profile.headline}.</b>
            </p>
            <p className="mb-6 max-w-[33rem] text-[1.12rem] text-pretty text-muted-foreground">
              {profile.heroLine}
            </p>
          </Rise>

          <Rise delay={220}>
            <div className="flex flex-wrap gap-2.5">
              <LinkButton variant="primary" href="#work">
                Open a door <ArrowDown aria-hidden="true" />
              </LinkButton>
              <LinkButton href={`mailto:${profile.links.email}`}>
                Email me
              </LinkButton>
              <LinkButton href={profile.links.cv}>CV</LinkButton>
              <LinkButton
                href={profile.links.github}
                aria-label="GitHub profile"
                className="px-3.5"
              >
                <GitHubIcon />
              </LinkButton>
              <LinkButton
                href={profile.links.linkedin}
                aria-label="LinkedIn profile"
                className="px-3.5"
              >
                <LinkedInIcon />
              </LinkButton>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.82rem] text-muted-foreground">
              <li>
                Remote with US teams{" "}
                <b className="font-medium text-foreground">since Jan 2026</b>
              </li>
              <li>
                <b className="font-medium text-foreground">
                  English C2 · French C1 · Arabic
                </b>
              </li>
              <li>{availability}</li>
            </ul>
            <p className="mt-2 mb-10 font-mono text-[0.82rem] text-muted-foreground">
              {profile.location}
              <LocalTime />
            </p>
          </Rise>
        </div>

        <Rise delay={340}>
          <HeroDoor />
        </Rise>
      </div>
      <TileBand />
    </section>
  );
}
