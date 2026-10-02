import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const STYLES = {
  primary: "bg-foreground text-background hover:opacity-85",
  brand:
    "bg-brand text-background hover:opacity-90 dark:text-[oklch(0.17_0.012_220)]",
  outline: "border border-border bg-background/60 hover:bg-muted",
};

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
        "inline-flex h-11 items-center gap-2 rounded-full px-5 text-base font-medium transition-all active:translate-y-px [&_svg]:size-4",
        STYLES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
