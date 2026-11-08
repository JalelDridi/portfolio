"use client";

import { useEffect, useState } from "react";

const TICK_MS = 30_000;

/** The local time in each city, as HH:MM; "--:--" until the browser has a clock. */
export function StatusClocks({
  zones,
}: {
  zones: { city: string; zone: string }[];
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return zones.map(({ city, zone }) => (
    <span key={zone}>
      {city}{" "}
      <time className="tabular-nums">
        {now
          ? new Intl.DateTimeFormat("en-GB", {
              timeZone: zone,
              hour: "2-digit",
              minute: "2-digit",
              hourCycle: "h23",
            }).format(now)
          : "--:--"}
      </time>
    </span>
  ));
}
