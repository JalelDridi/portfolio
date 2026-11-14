import { FileDown, Mail } from "lucide-react";
import { profile } from "@/content";
import { CopyButton } from "../copy-button";
import { GitHubIcon, LinkedInIcon } from "../icons";
import { LinkButton } from "../link-button";
import { Door, DoorFrame } from "../motifs";

/**
 * The last house on the street: the invitation on the left, a small yellow
 * door on the right whose step rests on the footer's tiles.
 */
export function Contact() {
  const { email } = profile.links;
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      // The footer opens with a 4 rem margin; pull the door's step down onto its tiles.
      className="mx-auto -mb-16 grid w-full max-w-[1280px] items-end gap-12 px-5 pt-[4.4rem] *:min-w-0 min-[920px]:grid-cols-[1.3fr_0.7fr]"
    >
      <div className="min-[920px]:pb-10">
        <p className="flex items-center gap-3">
          <span
            lang="ar"
            className="font-kufi text-[1.2rem] font-bold text-brand"
          >
            مرحبا
          </span>
          <span className="font-mono text-[0.8rem] tracking-[0.1em] text-muted-foreground uppercase">
            Marhba · welcome
          </span>
        </p>
        <h2
          id="contact-title"
          className="mt-2 mb-5 font-display text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.92] font-black tracking-[-0.04em] text-balance"
        >
          Hiring for payments or full-stack TypeScript?{" "}
          <span className="text-brand">Knock.</span>
        </h2>
        <p className="max-w-[33rem] text-[1.12rem] text-pretty text-muted-foreground">
          I am open to remote roles. Email is the quickest way to reach me.
        </p>
        <p className="mt-5 inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 border-b-[3px] border-sun pb-1">
          <span className="font-mono text-[clamp(0.95rem,2.6vw,1.1rem)] break-all">
            {email}
          </span>
          <CopyButton text={email} />
        </p>
        <div className="mt-7 flex flex-wrap gap-2.5">
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

      <div className="w-[min(100%,250px)] min-[920px]:justify-self-end">
        <DoorFrame small>
          <Door motif="sun" paint="yellow" />
        </DoorFrame>
      </div>
    </section>
  );
}
