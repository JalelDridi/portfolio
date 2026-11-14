import type { ReactNode } from "react";

/**
 * Was a fade-in on scroll; the Statement design keeps the page still, so this
 * only passes its children through until the sections stop using it.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  /** Accepted for the callers that still pass it; ignored. */
  delay?: number;
  className?: string;
}) {
  return className ? (
    <div className={className}>{children}</div>
  ) : (
    <>{children}</>
  );
}
