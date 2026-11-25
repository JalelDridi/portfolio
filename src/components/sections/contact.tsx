import { FileDown, Mail } from "lucide-react";
import { profile, shell } from "@/content";
import { CopyButton } from "../copy-button";
import { GitHubIcon, LinkedInIcon } from "../icons";
import { LinkButton } from "../link-button";
import { LocalTime } from "../local-time";
import { Section } from "../section";

const LABEL =
  shell.nav.find((item) => item.href === "/about#contact")?.label ?? "";

/** The invitation, the address to copy, the time here, and the four ways in. */
export function Contact() {
  const { email } = profile.links;
  return (
    <Section
      id="contact"
      label={LABEL}
      title="Hiring for payments or full-stack TypeScript? Let’s write the next episode."
    >
      <p className="max-w-[36rem] text-[1.3rem] leading-[1.5] text-pretty">
        I am open to remote roles. Email is the quickest way to reach me.
      </p>
      <p className="mt-6 flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 border-y border-border py-4">
        <span className="font-mono text-[clamp(0.95rem,2.6vw,1.1rem)] break-all">
          {email}
        </span>
        <CopyButton text={email} />
      </p>
      <p className="mt-4 font-mono text-[0.8rem] text-muted-foreground">
        {profile.location}
        <LocalTime />
      </p>
      <div className="mt-8 flex flex-wrap gap-2.5">
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
    </Section>
  );
}
