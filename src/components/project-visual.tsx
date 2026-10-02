import Image from "next/image";
import type { Project } from "@/content";
import { Diagram } from "./diagram";

/** A project's architecture sketch on a dotted background. */
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
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0 opacity-60"
      />
      <Diagram spec={project.visual.diagram} compact={size === "card"} />
    </div>
  );
}

/** The picture on a project card: a real screenshot when there is one. */
export function CardVisual({ project }: { project: Project }) {
  const image =
    project.cover ?? (project.visual.kind === "image" ? project.visual : null);

  if (!image) return <DiagramPanel project={project} size="card" />;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
      className="h-64 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
}
