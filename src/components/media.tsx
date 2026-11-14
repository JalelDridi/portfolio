import Image from "next/image";
import type { ReactNode } from "react";
import type { Clip, Shot } from "@/content";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "./browser-frame";
import { LazyVideo } from "./lazy-video";

/** A phone outline around a tall screenshot or recording, on a whitewashed ground. */
function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="bg-wall-2 px-5 py-8 shadow-[0_0_0_1px_var(--border)]">
      <div className="mx-auto w-full max-w-[17rem] overflow-hidden rounded-[2.25rem] border-[6px] border-stud bg-black">
        {children}
      </div>
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
      <figcaption className="text-left font-mono text-[0.8rem] text-pretty text-muted-foreground">
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
        <LazyVideo
          // The shape is reserved up front, so nothing moves when it loads.
          className={cn(
            "w-full bg-black",
            clip.frame === "phone" ? "aspect-[390/844]" : "aspect-[16/10]",
          )}
          webm={clip.webm}
          mp4={clip.mp4}
          poster={clip.poster}
          label={clip.label}
        />
      </Frame>
      <figcaption className="text-left font-mono text-[0.8rem] text-pretty text-muted-foreground">
        {clip.caption}
      </figcaption>
    </figure>
  );
}
