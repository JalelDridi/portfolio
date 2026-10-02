import { ArrowRight, Mail, MapPin } from "lucide-react";
import { flagship, heroDiagram, profile } from "@/content";
import { Diagram } from "../diagram";
import { GitHubIcon, LinkedInIcon } from "../icons";
import { LinkButton } from "../link-button";
import { Rise } from "../rise";
import { BorderBeam } from "../ui/border-beam";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14">
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-brand-bright/15 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <div className="flex flex-col gap-7">
          <Rise>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-sm font-medium">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-bright opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-bright" />
              </span>
              {profile.availability}
            </p>
          </Rise>

          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-4 text-xl font-medium tracking-tight text-balance sm:text-2xl">
              {profile.role}.{" "}
              <span className="text-gradient">{profile.headline}.</span>
            </p>
          </div>

          <div>
            <p className="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
              {profile.intro}
            </p>
          </div>

          <Rise delay={160}>
            <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              {profile.facts.map((fact) => (
                <li key={fact} className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-brand"
                  />
                  {fact}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <MapPin className="size-3.5 text-brand" aria-hidden="true" />
                {profile.location}
              </li>
            </ul>
          </Rise>

          <Rise delay={240}>
            <div className="flex flex-wrap items-center gap-3">
              <LinkButton variant="primary" href="#project">
                See my work <ArrowRight aria-hidden="true" />
              </LinkButton>
              <LinkButton href={`mailto:${profile.links.email}`}>
                <Mail aria-hidden="true" /> Email me
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
          <a
            href={flagship.demo}
            aria-label={`${flagship.name}: open the live demo`}
            className="group relative block overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur transition-transform hover:-translate-y-1 dark:shadow-black/30"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs font-medium tracking-widest text-brand uppercase">
                Open source
              </p>
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-brand-bright"
                />
                Live demo
              </p>
            </div>
            <p className="mt-3 text-xl font-semibold tracking-tight">
              {flagship.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {flagship.tagline}
            </p>
            <Diagram spec={heroDiagram} compact className="mt-8 mb-2" />
            <p className="mt-6 flex items-center gap-1.5 text-sm font-medium">
              Break it on purpose
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </p>
            <BorderBeam
              size={120}
              duration={9}
              colorFrom="var(--brand-bright)"
              colorTo="var(--brand-2)"
            />
          </a>
        </Rise>
      </div>
    </section>
  );
}
