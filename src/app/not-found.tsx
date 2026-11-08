import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { LinkButton } from "@/components/link-button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-start justify-center px-5 pt-24 pb-16">
      <p className="font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase">
        404
      </p>
      <h1 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-balance">
        This page does not exist
      </h1>
      <p className="mt-6 max-w-3xl text-[1.3rem] text-pretty text-muted-foreground">
        The link may be old or mistyped. Everything on this site is one click
        from the home page.
      </p>
      <LinkButton variant="primary" href="/" className="mt-8">
        <ArrowLeft aria-hidden="true" /> Back to the home page
      </LinkButton>
    </main>
  );
}
