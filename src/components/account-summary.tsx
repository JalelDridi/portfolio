import type { ReactNode } from "react";
import { ledger } from "@/content";

/** Wraps every number in a value (14,000+, 99.99%, 2026) in the brand colour. */
export function highlightNumbers(value: string): ReactNode[] {
  return value
    .split(/(\d[\d,.%+]*)/)
    .filter(Boolean)
    .map((part, index) =>
      /^\d/.test(part) ? (
        <span key={index} className="text-brand">
          {part}
        </span>
      ) : (
        part
      ),
    );
}

/** The hero's ruled list: one row per project and a total, like a statement. */
export function AccountSummary() {
  return (
    <div>
      {/* The top rule draws from the left on load; the rows stay still. */}
      <div
        aria-hidden="true"
        className="animate-draw origin-left border-t-2 border-foreground"
      />
      <div className="flex justify-between border-b border-border py-2 font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase">
        <span>{ledger.title}</span>
        <span>{ledger.asOf}</span>
      </div>
      <ul aria-label={ledger.title}>
        {ledger.rows.map((row) => (
          <li
            key={row.name}
            className="grid grid-cols-1 items-baseline gap-x-4 border-b border-border py-3 sm:grid-cols-[1fr_auto]"
          >
            <div>
              {row.href ? (
                <a
                  href={row.href}
                  className="font-medium underline decoration-border underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                >
                  {row.name}
                </a>
              ) : (
                <span className="font-medium">{row.name}</span>
              )}
              <p className="text-[0.95rem] text-muted-foreground">
                {row.detail}
              </p>
            </div>
            <p className="font-mono text-[0.95rem] sm:text-right">
              {highlightNumbers(row.value)}
            </p>
          </li>
        ))}
        <li className="flex justify-between gap-4 border-b-2 border-foreground py-3 font-semibold">
          <span>{ledger.total.label}</span>
          <span className="font-mono text-brand">{ledger.total.value}</span>
        </li>
      </ul>
    </div>
  );
}
