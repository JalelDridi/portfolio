import Image from "next/image";
import { type ReactNode, ViewTransition } from "react";
import type { Clip, Shot } from "@/content";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "./browser-frame";
import { LazyVideo } from "./lazy-video";

/** A phone outline around a tall screenshot or recording, in a thin dark frame. */
function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="border border-border bg-card px-5 py-8">
      <div className="mx-auto w-full max-w-[17rem] overflow-hidden rounded-[2.25rem] border-[6px] border-[#1d1c1b] bg-black">
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

const CAPTION =
  "text-left font-mono text-[0.8rem] leading-relaxed text-pretty text-muted-foreground";

export function ShotFigure({
  shot,
  priority = false,
  transitionName,
  className,
}: {
  shot: Shot;
  priority?: boolean;
  /** Shared with the home page's still, so the still grows into this picture. */
  transitionName?: string;
  className?: string;
}) {
  const image = (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={shot.width}
      height={shot.height}
      priority={priority}
      sizes={
        shot.frame === "phone" ? "272px" : "(min-width: 1024px) 960px, 100vw"
      }
      className="block w-full"
    />
  );
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <Frame frame={shot.frame} url={shot.url}>
        {transitionName ? (
          <ViewTransition name={transitionName} share="morph" default="none">
            <div>{image}</div>
          </ViewTransition>
        ) : (
          image
        )}
      </Frame>
      {shot.caption && (
        <figcaption className={CAPTION}>{shot.caption}</figcaption>
      )}
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
            "block w-full bg-black",
            clip.frame === "phone" ? "aspect-[390/844]" : "aspect-[16/10]",
          )}
          webm={clip.webm}
          mp4={clip.mp4}
          poster={clip.poster}
          label={clip.label}
        />
      </Frame>
      <figcaption className={CAPTION}>{clip.caption}</figcaption>
    </figure>
  );
}
