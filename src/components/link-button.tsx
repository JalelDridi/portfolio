import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const STYLES = {
  // Red fill with black text: white on this red is under 4.5:1.
  primary:
    "border-brand bg-brand text-background hover:border-foreground hover:bg-foreground",
  outline:
    "border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
  // Door yellow with ink, the same in both themes.
  sun: "border-sun bg-sun text-[#101922] hover:brightness-95",
  // On the blue band.
  light:
    "border-white bg-transparent text-white hover:bg-white hover:text-brand-deep",
};

/** A link drawn as an arch-topped button. */
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
        "inline-flex h-12 items-center gap-2 rounded-[999px_999px_10px_10px] border-2 px-[1.3rem] text-base font-semibold transition-colors [&_svg]:size-4",
        STYLES[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
