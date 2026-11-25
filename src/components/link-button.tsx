import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const STYLES = {
  // Red fill with black text: white on this red is under 4.5:1.
  primary:
    "border-brand bg-brand text-background hover:border-foreground hover:bg-foreground",
  outline:
    "border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
};

/** A link drawn as a square button with a mono, upper-case label. */
export function LinkButton({
  href,
  variant = "outline",
  children,
  className,
  ...rest
}: {
  href: string;
  variant?: keyof typeof STYLES;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-12 items-center gap-2 border px-5 font-mono text-[0.8rem] tracking-[0.06em] uppercase transition-colors [&_svg]:size-4",
        STYLES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
