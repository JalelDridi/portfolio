import { ArrowDown, FileDown, Mail, MapPin } from "lucide-react";
import { profile } from "@/content";
import { AccountSummary } from "../account-summary";
import { GitHubIcon, LinkedInIcon } from "../icons";
import { LinkButton } from "../link-button";
import { LocalTime } from "../local-time";
import { Rise } from "../rise";

export function Hero() {
  const nameLines = profile.name.split(" ");

  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-12 px-5 pt-10 pb-6 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div className="flex flex-col gap-7">
          <Rise>
            <h1
              aria-label={profile.name}
              className="font-display text-[clamp(3.4rem,8.4vw,7.6rem)] leading-[0.86] font-extrabold tracking-[-0.035em] [font-variation-settings:'opsz'_96,'wdth'_88]"
            >
              {nameLines.map((line, index) => (
                <span
                  key={line}
                  className={
                    index === nameLines.length - 1
                      ? "block font-light"
                      : "block"
                  }
                >
                  {line}
                </span>
              ))}
            </h1>
          </Rise>

          <Rise delay={80} className="flex flex-col gap-5">
            <p className="text-[1.55rem] leading-tight tracking-[-0.01em] text-balance">
              <b className="font-semibold">Founding Engineer at Potluck.</b>{" "}
              {profile.headline}.
            </p>
            <p className="max-w-xl text-[1.15rem] text-pretty text-muted-foreground">
              {profile.intro}
            </p>
          </Rise>

          <Rise delay={160}>
            <ul className="flex flex-col gap-1.5 text-base text-muted-foreground">
              {profile.facts.map((fact) => (
                <li key={fact} className="flex items-baseline gap-2">
                  <span aria-hidden="true" className="font-mono text-brand">
                    ·
                  </span>
                  {fact}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <MapPin className="size-3.5 text-brand" aria-hidden="true" />
                <span>
                  {profile.location}
                  <LocalTime />
                </span>
              </li>
            </ul>
          </Rise>

          <Rise delay={240}>
            <div className="flex flex-wrap items-center gap-3">
              <LinkButton variant="primary" href="#work">
                See the work <ArrowDown aria-hidden="true" />
              </LinkButton>
              <LinkButton href={`mailto:${profile.links.email}`}>
                <Mail aria-hidden="true" /> Email me
              </LinkButton>
              <LinkButton href={profile.links.cv}>
                <FileDown aria-hidden="true" /> CV
              </LinkButton>
              <LinkButton
                href={profile.links.github}
                aria-label="GitHub profile"
                className="px-3"
              >
                <GitHubIcon />
              </LinkButton>
              <LinkButton
                href={profile.links.linkedin}
                aria-label="LinkedIn profile"
                className="px-3"
              >
                <LinkedInIcon />
              </LinkButton>
            </div>
          </Rise>
        </div>

        <Rise delay={320}>
          <AccountSummary />
        </Rise>
      </div>
    </section>
  );
}
