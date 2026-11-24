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

/** Column heads of the ledger book. */
const LABEL =
  "font-display text-[0.85rem] font-bold tracking-[-0.01em] text-muted-foreground";

/** Labels of the totals under the book. */
const TOTAL = "font-mono text-[0.8rem] tracking-[0.1em] text-brand uppercase";

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
  wait: "text-red",
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
    <div className="grid items-start gap-12 min-[920px]:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col gap-6 min-[920px]:max-w-[26rem]">
        {intro}

        <div className="flex flex-wrap gap-2.5">
          {SCENARIOS.map((scenario, index) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => run(scenario.id)}
              disabled={busy}
              className={cn(
                "inline-flex h-12 items-center rounded-[999px_999px_10px_10px] border-2 px-[1.3rem] font-sans text-base font-semibold transition-colors disabled:opacity-50",
                index === 0
                  ? "border-brand bg-brand text-background hover:border-foreground hover:bg-foreground"
                  : "border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
              )}
            >
              {scenario.label}
            </button>
          ))}
        </div>

        <p
          role="status"
          aria-live="polite"
          className="min-h-[3.25rem] border-l-[3px] border-sun pl-3 font-mono text-[0.88rem] leading-snug"
        >
          {message}
        </p>
      </div>

      <div className="min-w-0 bg-card px-4 pt-3 pb-5 shadow-[0_0_0_1px_var(--border)] sm:px-6">
        <table
          aria-label="Ledger entries"
          className="w-full font-mono text-[0.85rem]"
        >
          <thead>
            <tr className="border-b border-foreground/25 text-left">
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

        <dl className="grid grid-cols-3 gap-3 pt-5">
          {[
            ["Stored", state.stored],
            ["Applied", state.applied],
            ["Owed to seller", formatCents(state.balance)],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className={TOTAL}>{label}</dt>
              <dd className="mt-1 font-display text-[clamp(1.25rem,4vw,1.9rem)] leading-none font-black tracking-[-0.03em] tabular-nums">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {footer}
      </div>
    </div>
  );
}
