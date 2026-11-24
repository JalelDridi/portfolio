import type { Metadata } from "next";
import { LinkButton } from "@/components/link-button";

export const metadata: Metadata = { title: "Page not found" };

/** No episode here, and the way back to the list. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[calc(1360px+5.5rem)] flex-col justify-center px-4 pt-10 pb-16 sm:px-11">
      <p className="font-mono text-[0.8rem] tracking-[0.1em] text-brand uppercase">
        404
      </p>
      <h1 className="mt-3 max-w-[14ch] font-display text-[clamp(28px,6.4vw,5.4rem)] leading-[0.9] font-black tracking-[-0.03em] text-red uppercase [font-stretch:125%] [overflow-wrap:anywhere] text-balance">
        This page does not exist
      </h1>
      <p className="mt-6 max-w-[40rem] text-[1.2rem] leading-[1.6] text-pretty text-muted-foreground">
        The link may be old or mistyped. Everything on this site is one click
        from the home page.
      </p>
      <div>
        <LinkButton variant="primary" href="/" className="mt-8">
          <span aria-hidden="true">←</span> Back to the home page
        </LinkButton>
      </div>
    </main>
  );
}
