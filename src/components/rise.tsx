import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Entrance animation for content that is on screen at load. It is pure CSS,
 * so the text paints immediately instead of waiting for JavaScript.
 */
export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-700",
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
