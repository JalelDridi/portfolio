import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A plain browser window around a screenshot or video. */
export function BrowserFrame({
  url,
  children,
  className,
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/10 dark:shadow-black/40",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-md bg-background/70 px-3 py-1 text-center font-mono text-xs text-muted-foreground">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}
