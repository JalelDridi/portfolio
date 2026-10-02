"use client";

import { Box, Database, Webhook, type LucideIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import {
  formatCents,
  initialState,
  play,
  SCENARIOS,
  type Scenario,
  type Stage,
  type Step,
} from "@/lib/pipeline-sim";
import { cn } from "@/lib/utils";

const STAGES: { id: Stage; label: string; icon: LucideIcon }[] = [
  { id: "webhook", label: "Webhook", icon: Webhook },
  { id: "inbox", label: "Inbox", icon: Box },
  { id: "ledger", label: "Ledger", icon: Database },
];

const TONE_RING = {
  ok: "border-brand-bright bg-brand-bright/15 text-brand",
  skip: "border-muted-foreground bg-muted text-muted-foreground",
  wait: "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A toy version of the Payout Ledger pipeline that runs in the browser.
 * Visitors send it a duplicate or an out-of-order webhook and watch what
 * the real system does with one.
 */
export function PipelinePlayground() {
  const [state, setState] = useState(initialState);
  const [active, setActive] = useState<Step | null>(null);
  const [message, setMessage] = useState(
    "Press a button to send the pipeline a webhook.",
  );
  const [busy, setBusy] = useState(false);
  const reduceMotion = useReducedMotion();
  const stateRef = useRef(state);

  async function run(scenario: Scenario) {
    if (busy) return;
    setBusy(true);
    const { steps, next } = play(scenario, stateRef.current);
    const pause = reduceMotion ? 0 : 850;

    for (const step of steps) {
      setActive(step);
      setMessage(step.text);
      // Totals move as each step lands, not all at once at the end.
      setState((current) => ({ ...current, ...step.after }));
      await wait(pause);
    }
    stateRef.current = next;
    setState(next);
    setActive(null);
    // With motion reduced the steps are instant, so leave the last one up.
    if (!reduceMotion) await wait(200);
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <ol
        aria-label="Pipeline stages"
        className="flex items-start justify-between gap-2"
      >
        {STAGES.map((stage, index) => {
          const lit = active?.stage === stage.id ? active.tone : null;
          return (
            <li
              key={stage.id}
              className="relative flex flex-1 flex-col items-center gap-2 text-center"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-6 right-1/2 h-px w-full -translate-y-1/2 bg-border"
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-12 items-center justify-center rounded-xl border bg-card transition-all duration-300",
                  lit
                    ? cn(TONE_RING[lit], "scale-110")
                    : "border-border text-muted-foreground",
                )}
              >
                <stage.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium">{stage.label}</span>
            </li>
          );
        })}
      </ol>

      <p
        role="status"
        aria-live="polite"
        className="min-h-[3.25rem] rounded-lg bg-muted/70 px-3 py-2 font-mono text-sm leading-snug"
      >
        {message}
      </p>

      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          ["Stored", state.stored],
          ["Applied", state.applied],
          ["Owed to seller", formatCents(state.balance)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border p-2">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-lg font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={() => run(scenario.id)}
            disabled={busy}
            className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-medium transition-colors hover:border-brand hover:bg-brand/10 disabled:opacity-50"
          >
            {scenario.label}
          </button>
        ))}
      </div>
    </div>
  );
}
