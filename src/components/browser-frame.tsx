import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A square frame around a screenshot or video, with its address in a bar. */
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
      className={cn(
        "relative overflow-hidden border border-foreground bg-card",
        className,
      )}
    >
      <div className="flex justify-between gap-3 border-b border-border px-3 py-2 font-mono text-[0.8rem] text-muted-foreground">
        <span className="min-w-0 truncate">{url}</span>
        {note && <span className="shrink-0">{note}</span>}
      </div>
      {children}
    </div>
  );
}
