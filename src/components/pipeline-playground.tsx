"use client";

import { useReducedMotion } from "motion/react";
import { type ReactNode, useRef, useState } from "react";
import {
  type Counters,
  formatCents,
  initialState,
  play,
  SCENARIOS,
  type Scenario,
  type Step,
} from "@/lib/pipeline-sim";
import { cn } from "@/lib/utils";

/** The book keeps only the latest entries so it never grows past a screen. */
const MAX_ENTRIES = 12;

const LABEL =
  "font-mono text-[0.85rem] font-normal tracking-[0.08em] text-muted-foreground uppercase";

type Entry = Step & { id: number; result: string };

/** What the ledger did with a step, in one word. */
function resultOf(step: Step, before: Counters): string {
  if (step.tone === "skip") return "skipped";
  if (step.tone === "wait") return "held";
  if (
    step.after.applied > before.applied ||
    step.after.balance !== before.balance
  ) {
    return "applied";
  }
  if (step.after.stored > before.stored) return "stored";
  return "ok";
}

const RESULT_TONE = {
  ok: "text-brand",
  skip: "text-muted-foreground",
  wait: "text-debit",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A toy version of the Payout Ledger pipeline that runs in the browser.
 * Visitors send it a duplicate or an out-of-order webhook and watch each
 * step post an entry in the ledger book. `intro` sits above the buttons and
 * `footer` under the totals, so the section can frame the two columns.
 */
export function PipelinePlayground({
  intro,
  footer,
}: {
  intro?: ReactNode;
  footer?: ReactNode;
}) {
  const [state, setState] = useState(initialState);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [message, setMessage] = useState(
    "Press a button to send the pipeline a webhook.",
  );
  const [busy, setBusy] = useState(false);
  const reduceMotion = useReducedMotion();
  const stateRef = useRef(state);
  const nextEntry = useRef(0);

  async function run(scenario: Scenario) {
    if (busy) return;
    setBusy(true);
    const { steps, next } = play(scenario, stateRef.current);
    const pause = reduceMotion ? 0 : 850;
    let before: Counters = stateRef.current;

    for (const step of steps) {
      const entry = {
        ...step,
        id: nextEntry.current++,
        result: resultOf(step, before),
      };
      before = step.after;
      setEntries((current) => [...current, entry].slice(-MAX_ENTRIES));
      setMessage(step.text);
      // Totals move as each step lands, not all at once at the end.
      setState((current) => ({ ...current, ...step.after }));
      await wait(pause);
    }
    stateRef.current = next;
    setState(next);
    // With motion reduced the steps are instant, so leave the last one up.
    if (!reduceMotion) await wait(200);
    setBusy(false);
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col gap-6 lg:max-w-[22rem]">
        {intro}

        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((scenario, index) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => run(scenario.id)}
              disabled={busy}
              className={cn(
                "inline-flex h-11 items-center border border-foreground px-4 font-sans text-base font-medium transition-colors hover:border-brand hover:bg-brand hover:text-background disabled:opacity-50",
                index === 0 && "border-brand text-brand",
              )}
            >
              {scenario.label}
            </button>
          ))}
        </div>

        <p
          role="status"
          aria-live="polite"
          className="min-h-[3.25rem] font-mono text-[0.9rem] leading-snug"
        >
          {message}
        </p>
      </div>

      <div className="min-w-0">
        <table
          aria-label="Ledger entries"
          className="w-full border-t-2 border-foreground font-mono text-[0.9rem]"
        >
          <thead>
            <tr className="border-b border-border text-left">
              <th
                scope="col"
                className={cn(LABEL, "hidden py-2 pr-3 sm:table-cell")}
              >
                Stage
              </th>
              <th scope="col" className={cn(LABEL, "py-2 pr-3")}>
                Event
              </th>
              <th scope="col" className={cn(LABEL, "py-2 pr-3")}>
                Entry
              </th>
              <th
                scope="col"
                className={cn(
                  LABEL,
                  "hidden py-2 pr-3 text-right sm:table-cell",
                )}
              >
                Owed to seller
              </th>
              <th scope="col" className={cn(LABEL, "py-2 text-right")}>
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr className="border-b border-border align-baseline">
                <td colSpan={5} className="py-3 text-muted-foreground">
                  No entries yet. Press a button to send the pipeline a webhook.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-border align-baseline"
                >
                  <td className="hidden py-2 pr-3 sm:table-cell">
                    {entry.stage}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">{entry.event}</td>
                  <td className="py-2 pr-3">{entry.text}</td>
                  <td className="hidden py-2 pr-3 text-right tabular-nums sm:table-cell">
                    {formatCents(entry.after.balance)}
                  </td>
                  <td
                    className={cn("py-2 text-right", RESULT_TONE[entry.tone])}
                  >
                    {entry.result}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <dl className="grid grid-cols-3 border-b-2 border-foreground py-3">
          {[
            ["Stored", state.stored],
            ["Applied", state.applied],
            ["Owed to seller", formatCents(state.balance)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className={LABEL}>{label}</dt>
              <dd className="font-mono text-xl tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        {footer}
      </div>
    </div>
  );
}
