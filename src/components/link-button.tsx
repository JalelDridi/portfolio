import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const STYLES = {
  primary:
    "border-foreground bg-foreground text-background hover:border-brand hover:bg-brand",
  outline:
    "border-foreground bg-transparent hover:bg-foreground hover:text-background",
  brand: "border-brand text-brand hover:bg-brand hover:text-background",
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
        "inline-flex h-11 items-center gap-2 border px-5 text-base font-medium transition-colors [&_svg]:size-4",
        STYLES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
