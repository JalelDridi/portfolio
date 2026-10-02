import Image from "next/image";
import type { ReactNode } from "react";
import type { Clip, Shot } from "@/content";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "./browser-frame";

/** A phone outline around a tall screenshot or recording. */
function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[17rem] overflow-hidden rounded-[2.25rem] border-[6px] border-foreground/85 bg-black shadow-2xl shadow-black/15 dark:border-foreground/25 dark:shadow-black/50">
      {children}
    </div>
  );
}

function Frame({
  frame,
  url,
  children,
}: {
  frame: "browser" | "phone";
  url?: string;
  children: ReactNode;
}) {
  return frame === "phone" ? (
    <PhoneFrame>{children}</PhoneFrame>
  ) : (
    <BrowserFrame url={url ?? ""}>{children}</BrowserFrame>
  );
}

export function ShotFigure({
  shot,
  priority = false,
  className,
}: {
  shot: Shot;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <Frame frame={shot.frame} url={shot.url}>
        <Image
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          priority={priority}
          sizes={
            shot.frame === "phone"
              ? "272px"
              : "(min-width: 1024px) 960px, 100vw"
          }
          className="w-full"
        />
      </Frame>
      <figcaption className="text-center text-base text-pretty text-muted-foreground">
        {shot.caption}
      </figcaption>
    </figure>
  );
}

export function ClipFigure({
  clip,
  className,
}: {
  clip: Clip;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <Frame frame={clip.frame} url={clip.url}>
        {/* Silent, with controls so it can be paused. */}
        <video
          className="w-full bg-black"
          poster={clip.poster}
          aria-label={clip.label}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
        >
          <source src={clip.webm} type="video/webm" />
          <source src={clip.mp4} type="video/mp4" />
        </video>
      </Frame>
      <figcaption className="text-center text-base text-pretty text-muted-foreground">
        {clip.caption}
      </figcaption>
    </figure>
  );
}
