import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A thin dark frame around a screenshot or video; its bar shows the address. */
export function BrowserFrame({
  url,
  note,
  children,
  className,
}: {
  url: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("overflow-hidden border border-border bg-card", className)}
    >
      <div className="flex items-center gap-[7px] border-b border-border px-3.5 py-[11px] font-mono text-xs text-muted-foreground">
        <span
          aria-hidden="true"
          className="size-[9px] shrink-0 rounded-full bg-red"
        />
        <span
          aria-hidden="true"
          className="size-[9px] shrink-0 rounded-full bg-border"
        />
        <span
          aria-hidden="true"
          className="size-[9px] shrink-0 rounded-full bg-border"
        />
        <span className="ml-2.5 min-w-0 truncate">{url}</span>
        {note && <span className="ml-auto shrink-0">{note}</span>}
      </div>
      {children}
    </div>
  );
}
