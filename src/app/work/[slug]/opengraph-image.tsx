import { projects } from "@/content";
import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return ogCard({
    eyebrow: project ? `${project.company} · ${project.year}` : "Case study",
    title: project?.title ?? "Case study",
    text: project?.summary ?? "",
  });
}
