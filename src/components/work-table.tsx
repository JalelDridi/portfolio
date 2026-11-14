"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "./browser-frame";

type Row = {
  slug: string;
  title: string;
  company: string;
  year: string;
  summary: string;
  url?: string;
  earlier?: boolean;
};

/** The projects as a table; hovering or focusing a row shows its preview. */
export function WorkTable({
  rows,
  previews,
}: {
  rows: Row[];
  previews: Record<string, ReactNode>;
}) {
  const [active, setActive] = useState(rows[0].slug);
  const firstEarlier = rows.findIndex((row) => row.earlier);
  const activeRow = rows.find((row) => row.slug === active);

  return (
    <div className="grid items-start gap-10 *:min-w-0 lg:grid-cols-[1.15fr_0.85fr]">
      <ol className="border-t-2 border-foreground">
        {rows.map((row, index) => (
          <RowItem
            key={row.slug}
            row={row}
            divider={index === firstEarlier}
            onActive={() => setActive(row.slug)}
          />
        ))}
      </ol>

      <div
        data-preview={active}
        aria-hidden="true"
        className="sticky top-20 hidden lg:block"
      >
        <BrowserFrame
          url={activeRow?.url ?? "private work, drawn as a diagram"}
        >
          {previews[active]}
        </BrowserFrame>
        <p className="mt-2 font-mono text-[0.85rem] text-muted-foreground">
          Hover a row to preview it. Real screenshots and recordings of public
          pages; private work is drawn as a diagram.
        </p>
      </div>
    </div>
  );
}

function RowItem({
  row,
  divider,
  onActive,
}: {
  row: Row;
  divider: boolean;
  onActive: () => void;
}) {
  return (
    <>
      {divider && (
        <li className="border-b border-border py-2 font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase">
          Earlier
        </li>
      )}
      <li
        className="group relative border-b border-border"
        onMouseEnter={onActive}
      >
        <div className="grid grid-cols-[3.4rem_1fr_1.4rem] items-baseline gap-4 py-4 group-hover:text-brand group-has-[a:focus-visible]:text-brand sm:grid-cols-[3.4rem_1fr_1.2fr_1.4rem]">
          <span className="font-mono text-[0.85rem] text-muted-foreground">
            {row.year}
          </span>
          <div>
            <h3
              className={cn(
                "font-display font-bold tracking-[-0.02em]",
                row.earlier ? "text-xl" : "text-2xl",
              )}
            >
              {/* The link stretches over the whole row. */}
              <Link
                href={`/work/${row.slug}`}
                onFocus={onActive}
                className="after:absolute after:inset-0"
              >
                {row.title}
              </Link>
            </h3>
            <p className="text-[0.92rem] text-muted-foreground">
              {row.company} · {row.year}
            </p>
          </div>
          <p className="col-start-2 text-muted-foreground sm:col-auto">
            {row.summary}
          </p>
          <span
            aria-hidden="true"
            className="col-start-3 row-start-1 text-right sm:col-start-4"
          >
            →
          </span>
        </div>
      </li>
    </>
  );
}
