"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A silent, looping recording that costs nothing until it is close to the
 * screen: the poster loads when the video is near, and the video itself only
 * when it is in view. People who ask for less motion press play themselves.
 */
export function LazyVideo({
  webm,
  mp4,
  poster,
  label,
  className,
}: {
  webm: string;
  mp4: string;
  poster: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        approach.disconnect();
      },
      { rootMargin: "600px" },
    );
    approach.observe(video);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const visible = new IntersectionObserver(
      ([entry]) => {
        if (still) return;
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    visible.observe(video);

    return () => {
      approach.disconnect();
      visible.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={near ? poster : undefined}
      aria-label={label}
      muted
      loop
      playsInline
      controls
      preload="none"
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
