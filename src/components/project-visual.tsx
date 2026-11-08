import Image from "next/image";
import type { DiagramSpec, Project } from "@/content";
import { Diagram } from "./diagram";

/** An architecture sketch, sized for a card or a page. */
export function DiagramPanel({
  spec,
  size,
}: {
  spec: DiagramSpec;
  size: "card" | "page";
}) {
  return (
    <div
      className={
        size === "card"
          ? "relative flex h-72 w-full items-center overflow-hidden px-5"
          : "relative flex w-full items-center overflow-hidden px-4 py-12 sm:px-12 sm:py-16"
      }
    >
      <Diagram spec={spec} compact={size === "card"} />
    </div>
  );
}

/** The preview beside the work table: a real screenshot when there is one. */
export function PreviewVisual({ project }: { project: Project }) {
  const image =
    project.cover ?? (project.visual.kind === "image" ? project.visual : null);

  if (!image) {
    return project.visual.kind === "diagram" ? (
      <DiagramPanel spec={project.visual.diagram} size="card" />
    ) : null;
  }
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
