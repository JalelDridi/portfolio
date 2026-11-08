import { FileDown, Mail } from "lucide-react";
import { profile } from "@/content";
import { CopyButton } from "../copy-button";
import { GitHubIcon, LinkedInIcon } from "../icons";
import { LinkButton } from "../link-button";

export function Contact() {
  const { email } = profile.links;
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-20"
    >
      <div className="grid items-end gap-8 border-t-2 border-foreground pt-6 *:min-w-0 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase">
            Contact
          </p>
          <h2
            id="contact-title"
            className="mt-3 font-display text-[clamp(2.2rem,5vw,4rem)] leading-none font-bold tracking-[-0.03em] text-balance"
          >
            Hiring for payments or full-stack TypeScript?
          </h2>
        </div>
        <div>
          <p className="text-[1.15rem] text-pretty text-muted-foreground">
            I am open to remote roles. Email is the quickest way to reach me.
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-3">
            <span className="border-b-2 border-brand pb-0.5 font-mono text-lg break-all">
              {email}
            </span>
            <CopyButton text={email} />
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton variant="primary" href={`mailto:${email}`}>
              <Mail aria-hidden="true" /> Email me
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
      </div>
    </section>
  );
}
