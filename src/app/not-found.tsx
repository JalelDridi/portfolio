import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { LinkButton } from "@/components/link-button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-start justify-center px-5 pt-28 pb-16">
      <p className="font-mono text-sm font-medium tracking-widest text-brand uppercase">
        404
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        This page does not exist
      </h1>
      <p className="mt-5 text-xl text-pretty text-muted-foreground">
        The link may be old or mistyped. Everything on this site is one click
        from the home page.
      </p>
      <LinkButton variant="primary" href="/" className="mt-8">
        <ArrowLeft aria-hidden="true" /> Back to the home page
      </LinkButton>
    </main>
  );
}
