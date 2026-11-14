import { ArrowUpRight } from "lucide-react";
import { flagship } from "@/content";
import { LinkButton } from "../link-button";
import { PipelinePlayground } from "../pipeline-playground";

/** A quiet full-width band: the playground and its ledger book. */
export function Playground() {
  return (
    <section
      id="playground"
      aria-labelledby="playground-title"
      className="bg-wall-2"
    >
      <div className="mx-auto w-full max-w-[1280px] px-5 py-[4.2rem]">
        <PipelinePlayground
          intro={
            <div>
              <p className="font-mono text-[0.8rem] tracking-[0.1em] text-muted-foreground uppercase">
                Try it
              </p>
              <h2
                id="playground-title"
                className="mt-2 mb-4 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] font-black tracking-[-0.035em] text-balance"
              >
                Break my pipeline.
              </h2>
              <p className="text-[1.08rem] text-pretty text-muted-foreground">
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
