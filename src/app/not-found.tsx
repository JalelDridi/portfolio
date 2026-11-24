import type { Metadata } from "next";
import { LinkButton } from "@/components/link-button";
import { CONTAINER, LABEL, WIDE_TITLE } from "@/lib/styles";

export const metadata: Metadata = { title: "Page not found" };

/** No episode here, and the way back to the list. */
export default function NotFound() {
  return (
    <main
      className={`${CONTAINER} flex min-h-[70vh] flex-col justify-center pt-10 pb-16`}
    >
      <p className={LABEL}>404</p>
      <h1
        className={`${WIDE_TITLE} mt-3 max-w-[14ch] text-[clamp(28px,6.4vw,5.4rem)] text-red`}
      >
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
