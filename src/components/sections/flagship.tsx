import { ArrowUpRight, BookOpen } from "lucide-react";
import { flagship } from "@/content";
import { GitHubIcon } from "../icons";
import { LazyVideo } from "../lazy-video";
import { LinkButton } from "../link-button";
import { ArchFrame, StudBand } from "../motifs";
import { Tags } from "../tags";

/**
 * The flagship on a full-bleed blue band between two rails of studs: the
 * story on the left, the whole recording under a shallow arch on the right.
 */
export function Flagship() {
  return (
    <section
      id="project"
      aria-labelledby="project-title"
      className="focus-white mt-[4.4rem] bg-brand text-white dark:bg-brand-deep"
    >
      <StudBand />
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-x-12 gap-y-6 px-5 pt-[2.6rem] pb-[3.2rem] *:min-w-0 min-[920px]:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-mono text-[0.8rem] tracking-[0.1em] text-[#dce8f6] uppercase">
            Flagship · open source
          </p>
          <h2
            id="project-title"
            className="mt-2.5 mb-4 font-display text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[0.95] font-black tracking-[-0.035em] text-balance"
          >
            {flagship.name}: {flagship.tagline.toLowerCase()}
          </h2>
          <p className="max-w-[31rem] text-[1.1rem] text-pretty text-[#e3edf8]">
            {flagship.summary}
          </p>
          <ul className="mt-5 mb-5 grid gap-2.5">
            {flagship.points.map((point) => (
              <li
                key={point.title}
                className="grid grid-cols-[1.2rem_1fr] gap-2.5 text-base"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.45rem] size-[0.6rem] rounded-full bg-stud shadow-[inset_-1px_-1px_0_rgba(255,255,255,0.25)]"
                />
                <span className="text-pretty">
                  <b className="font-semibold">{point.title}:</b> {point.text}
                </span>
              </li>
            ))}
          </ul>
          <Tags items={flagship.stack} />
        </div>

        {/*
         * The buttons are their own row so that on wide screens they can run
         * under both columns and stay on one line.
         */}
        <div className="flex flex-wrap gap-2 min-[920px]:col-span-2 min-[920px]:row-start-2">
          <LinkButton variant="sun" href={flagship.demo}>
            Try the live demo <ArrowUpRight aria-hidden="true" />
          </LinkButton>
          <LinkButton variant="light" href={flagship.repo} className="px-4">
            <GitHubIcon /> Read the code
          </LinkButton>
          <LinkButton
            variant="light"
            href={flagship.decisions}
            className="px-4"
          >
            <BookOpen aria-hidden="true" /> Design decisions
          </LinkButton>
        </div>

        <figure className="mx-auto mt-6 w-full min-[920px]:col-start-2 min-[920px]:row-start-1 min-[920px]:mt-0">
          {/*
           * A wide segmental arch over the whole 16:10 recording. The recording
           * stands on the sill, 2% in from each side, so the arc (9% of the
           * height) clears its top corners: nothing of it is cut.
           */}
          <ArchFrame
            ratio={16 / 10.6}
            shape="segmental"
            className="w-full bg-room"
          >
            <LazyVideo
              className="absolute inset-x-[2%] bottom-0 aspect-[16/10] w-[96%] object-contain"
              webm={flagship.video.webm}
              mp4={flagship.video.mp4}
              poster={flagship.video.poster}
              label={flagship.video.label}
            />
          </ArchFrame>
          <figcaption className="mt-3 text-center">
            <span className="block font-mono text-[0.76rem] text-[#dce8f6]">
              payout-ledger-gamma.vercel.app · screen recording
            </span>
            <span className="mx-auto mt-1.5 block max-w-[26rem] text-[0.95rem] text-pretty text-[#e3edf8]">
              A dropped webhook is sent, the checks run, and reconciliation
              flags the payout the ledger has fallen behind on.
            </span>
          </figcaption>
        </figure>
      </div>
      <StudBand />
    </section>
  );
}
