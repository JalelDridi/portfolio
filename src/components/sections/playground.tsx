import { ArrowUpRight } from "lucide-react";
import { flagship } from "@/content";
import { LinkButton } from "../link-button";
import { PipelinePlayground } from "../pipeline-playground";

/** A full-width band between two rules: the playground and its ledger book. */
export function Playground() {
  return (
    <section
      id="playground"
      aria-labelledby="playground-title"
      className="border-y border-foreground"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
        <PipelinePlayground
          intro={
            <div className="flex flex-col gap-4">
              <p className="font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase">
                Try it
              </p>
              <h2
                id="playground-title"
                className="font-display text-[clamp(2rem,4.2vw,3.2rem)] leading-none font-bold tracking-[-0.025em] text-balance"
              >
                Break my pipeline.
              </h2>
              <p className="text-[1.1rem] text-pretty text-muted-foreground">
                A small model of Payout Ledger, my open-source payout monitor.
                Send it the webhooks that break payment systems and watch the
                ledger take only what it should.
              </p>
            </div>
          }
          footer={
            <LinkButton href={flagship.demo} className="mt-6">
              Open the real demo <ArrowUpRight aria-hidden="true" />
            </LinkButton>
          }
        />
      </div>
    </section>
  );
}
