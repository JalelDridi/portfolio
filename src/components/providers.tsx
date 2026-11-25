"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // Honour the system "reduce motion" setting in every animation.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
