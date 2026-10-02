import type { ReactNode } from "react";
import { BlurFade } from "./ui/blur-fade";

/** Fades content in the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <BlurFade inView delay={delay} className={className} inViewMargin="-60px">
      {children}
    </BlurFade>
  );
}
