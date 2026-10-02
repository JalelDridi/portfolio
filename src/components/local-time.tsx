"use client";

import { useEffect, useState } from "react";

const ZONE = "Africa/Tunis";

/** Minutes east of UTC for a time zone at a given moment. */
function offsetMinutes(zone: string | undefined, at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).formatToParts(at);
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
  );
  return Math.round((asUtc - at.getTime()) / 60_000);
}

function difference(now: Date): string {
  const minutes = offsetMinutes(ZONE, now) - offsetMinutes(undefined, now);
  if (minutes === 0) return "the same time as you";
  const hours = Math.abs(minutes) / 60;
  const amount = `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hour${hours === 1 ? "" : "s"}`;
  return `${amount} ${minutes > 0 ? "ahead of" : "behind"} you`;
}

/**
 * The current time where I live, and how far that is from the visitor.
 * Rendered only in the browser: the server cannot know either.
 */
export function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  return (
    <span>
      {" "}
      · {time} here now, {difference(now)}
    </span>
  );
}
