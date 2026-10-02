"use client";

import {
  Activity,
  Bell,
  Box,
  ChartNoAxesColumn,
  CircleCheck,
  CreditCard,
  Database,
  Gift,
  GitBranch,
  Layers,
  Mail,
  MessageSquare,
  Network,
  Radio,
  Rocket,
  Route,
  Send,
  Server,
  ShieldCheck,
  Smartphone,
  Ticket,
  User,
  Video,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { createRef, useRef, useState, type RefObject } from "react";
import type { DiagramSpec, IconName } from "@/content";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "./ui/animated-beam";

const ICONS: Record<IconName, LucideIcon> = {
  user: User,
  server: Server,
  database: Database,
  card: CreditCard,
  webhook: Webhook,
  shield: ShieldCheck,
  bell: Bell,
  radio: Radio,
  send: Send,
  route: Route,
  mail: Mail,
  message: MessageSquare,
  chart: ChartNoAxesColumn,
  ticket: Ticket,
  gift: Gift,
  video: Video,
  git: GitBranch,
  rocket: Rocket,
  check: CircleCheck,
  layers: Layers,
  gateway: Network,
  phone: Smartphone,
  box: Box,
  activity: Activity,
};

/**
 * An architecture sketch: labelled nodes in columns, joined by animated
 * beams. The whole figure is one image to assistive technology, described by
 * its caption.
 */
export function Diagram({
  spec,
  compact = false,
  className,
}: {
  spec: DiagramSpec;
  compact?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // One stable ref object per node, looked up by ID when drawing edges.
  const [refs] = useState<Record<string, RefObject<HTMLDivElement | null>>>(
    () =>
      Object.fromEntries(
        spec.columns
          .flat()
          .map((node) => [node.id, createRef<HTMLDivElement>()]),
      ),
  );

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={spec.caption}
      className={cn(
        "relative flex w-full items-stretch justify-between",
        compact ? "gap-3" : "gap-4 sm:gap-8",
        className,
      )}
    >
      {spec.columns.map((column, index) => (
        <div
          key={index}
          className={cn(
            "z-10 flex flex-col items-center justify-center",
            compact ? "gap-3" : "gap-4 sm:gap-5",
          )}
        >
          {column.map((node) => {
            const Icon = ICONS[node.icon];
            return (
              <div
                key={node.id}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <div
                  ref={refs[node.id]}
                  className={cn(
                    "flex items-center justify-center rounded-xl border border-border bg-card text-brand shadow-sm",
                    compact ? "size-9" : "size-10 sm:size-12",
                  )}
                >
                  <Icon
                    className={compact ? "size-4" : "size-4 sm:size-5"}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={cn(
                    "leading-tight font-medium text-muted-foreground",
                    compact
                      ? "max-w-16 text-[0.625rem]"
                      : "max-w-20 text-[0.6875rem] sm:max-w-24 sm:text-xs",
                  )}
                >
                  {node.label}
                </span>
              </div>
            );
          })}
        </div>
      ))}

      {spec.edges.map(([from, to], index) => (
        <AnimatedBeam
          key={`${from}-${to}`}
          containerRef={containerRef}
          fromRef={refs[from]}
          toRef={refs[to]}
          duration={4}
          delay={index * 0.35}
          pathColor="var(--border)"
          pathOpacity={1}
          pathWidth={1.5}
          gradientStartColor="var(--brand-bright)"
          gradientStopColor="var(--brand-2)"
        />
      ))}
    </div>
  );
}
