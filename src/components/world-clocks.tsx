"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Clock = { city: string; zone: string };

function partsIn(zone: string, at: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(at);
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { hour: get("hour"), minute: get("minute") };
}

const TICKS = Array.from({ length: 12 }, (_, index) => index * 30);

function Face({
  hour,
  minute,
  home,
}: {
  hour: number;
  minute: number;
  home: boolean;
}) {
  const minuteAngle = minute * 6;
  const hourAngle = (hour % 12) * 30 + minute / 2;
  // Roughly: is it a working hour there?
  const day = hour >= 7 && hour < 19;
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn(
        "size-20 sm:size-24",
        day ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        className={cn(
          "stroke-border",
          day ? "fill-card" : "fill-muted",
          home && "stroke-brand",
        )}
        strokeWidth={home ? 3 : 2}
      />
      {TICKS.map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="9"
          x2="50"
          y2={angle % 90 === 0 ? 16 : 13}
          transform={`rotate(${angle} 50 50)`}
          stroke="currentColor"
          strokeOpacity={0.45}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="28"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        style={{
          transform: `rotate(${hourAngle}deg)`,
          transformOrigin: "50px 50px",
          transition: "transform 0.8s ease-out",
        }}
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="17"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-brand"
        style={{
          transform: `rotate(${minuteAngle}deg)`,
          transformOrigin: "50px 50px",
          transition: "transform 0.8s ease-out",
        }}
      />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

/**
 * Analogue clocks for home and the places I work with. The hands sweep into
 * place once the browser knows the time; the server cannot.
 */
export function WorldClocks({ clocks }: { clocks: Clock[] }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
      {clocks.map((clock, index) => {
        const time = now ? partsIn(clock.zone, now) : { hour: 0, minute: 0 };
        const label = now
          ? `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`
          : "--:--";
        return (
          <li key={clock.zone} className="flex flex-col items-center gap-2">
            <Face hour={time.hour} minute={time.minute} home={index === 0} />
            <p className="text-center">
              <span className="block text-base font-medium">{clock.city}</span>
              <span className="block font-mono text-sm text-muted-foreground">
                {label}
              </span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
