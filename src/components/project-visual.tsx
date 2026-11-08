import Image from "next/image";
import type { Project } from "@/content";
import { Diagram } from "./diagram";

/** A project's architecture sketch. */
export function DiagramPanel({
  project,
  size,
}: {
  project: Project;
  size: "card" | "page";
}) {
  if (project.visual.kind !== "diagram") return null;
  return (
    <div
      className={
        size === "card"
          ? "relative flex h-64 w-full items-center overflow-hidden px-5"
          : "relative flex w-full items-center overflow-hidden px-4 py-12 sm:px-12 sm:py-16"
      }
    >
      <Diagram spec={project.visual.diagram} compact={size === "card"} />
    </div>
  );
}

/** The preview beside the work table: a real screenshot when there is one. */
export function PreviewVisual({ project }: { project: Project }) {
  const image =
    project.cover ?? (project.visual.kind === "image" ? project.visual : null);

  if (!image) return <DiagramPanel project={project} size="card" />;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes="(min-width: 1024px) 480px, 1px"
      className="aspect-[4/3] w-full object-cover object-top"
    />
  );
}
