import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { LinkButton } from "@/components/link-button";
import { Door, DoorFrame } from "@/components/motifs";

export const metadata: Metadata = { title: "Page not found" };

/** A door that stays shut, and the way back to the street. */
export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] w-full max-w-[1280px] items-center gap-12 px-5 pt-[4.2rem] pb-16 *:min-w-0 md:grid-cols-[1fr_auto]">
      <div>
        <p className="font-mono text-[0.8rem] tracking-[0.1em] text-muted-foreground uppercase">
          404
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[0.92] font-black tracking-[-0.04em] text-balance">
          This page does not exist
        </h1>
        <p className="mt-6 max-w-3xl text-[1.25rem] text-pretty text-muted-foreground">
          The link may be old or mistyped. Everything on this site is one click
          from the home page.
        </p>
        <LinkButton variant="primary" href="/" className="mt-8">
          <ArrowLeft aria-hidden="true" /> Back to the home page
        </LinkButton>
      </div>
      <div className="w-[min(100%,170px)] md:w-[220px]">
        <DoorFrame small>
          <Door motif="rows" paint="night" />
        </DoorFrame>
      </div>
    </main>
  );
}
