import Image from "next/image";
import type { Project } from "@/content";
import { Diagram } from "./diagram";

/** The picture for a project: a real screenshot, or an architecture sketch. */
export function ProjectVisual({
  project,
  size,
}: {
  project: Project;
  size: "card" | "page";
}) {
  const { visual } = project;

  if (visual.kind === "image") {
    return (
      <Image
        src={visual.src}
        alt={visual.alt}
        width={visual.width}
        height={visual.height}
        sizes={
          size === "card"
            ? "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            : "(min-width: 1024px) 960px, 100vw"
        }
        priority={size === "page"}
        className={
          size === "card"
            ? "aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            : "w-full"
        }
      />
    );
  }

  return (
    <div
      className={
        size === "card"
          ? "relative flex aspect-[16/10] w-full items-center overflow-hidden px-5"
          : "relative flex w-full items-center overflow-hidden px-4 py-12 sm:px-12 sm:py-16"
      }
    >
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0 opacity-60"
      />
      <Diagram spec={visual.diagram} compact={size === "card"} />
    </div>
  );
}
