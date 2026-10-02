import { FileDown, Mail } from "lucide-react";
import { profile } from "@/content";
import { GitHubIcon, LinkedInIcon } from "../icons";
import { LinkButton } from "../link-button";
import { Reveal } from "../reveal";
import { BorderBeam } from "../ui/border-beam";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24"
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-brand-bright/15 blur-3xl"
          />
          <div className="relative">
            <p className="font-mono text-sm font-medium tracking-widest text-brand uppercase">
              Contact
            </p>
            <h2
              id="contact-title"
              className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl"
            >
              Hiring for payments or full-stack TypeScript?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-xl text-pretty text-muted-foreground">
              I am open to remote roles. Email is the quickest way to reach me.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <LinkButton
                variant="primary"
                href={`mailto:${profile.links.email}`}
              >
                <Mail aria-hidden="true" /> {profile.links.email}
              </LinkButton>
              <LinkButton href={profile.links.cv}>
                <FileDown aria-hidden="true" /> Download CV
              </LinkButton>
              <LinkButton href={profile.links.linkedin}>
                <LinkedInIcon /> LinkedIn
              </LinkButton>
              <LinkButton href={profile.links.github}>
                <GitHubIcon /> GitHub
              </LinkButton>
            </div>
          </div>
          <BorderBeam
            size={200}
            duration={12}
            colorFrom="var(--brand-bright)"
            colorTo="var(--brand-2)"
          />
        </div>
      </Reveal>
    </section>
  );
}
