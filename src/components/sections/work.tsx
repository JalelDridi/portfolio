import { projects } from "@/content";
import { PreviewVisual } from "../project-visual";
import { Section } from "../section";
import { WorkTable } from "../work-table";

export function Work() {
  const rows = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    company: project.company,
    year: project.year,
    summary: project.summary,
    url:
      project.cover?.url ??
      (project.links[0] ? new URL(project.links[0].href).hostname : undefined),
  }));
  const previews = Object.fromEntries(
    projects.map((p) => [p.slug, <PreviewVisual key={p.slug} project={p} />]),
  );

  return (
    <Section
      id="work"
      eyebrow="Work"
      title="Built and shipped"
      description="Most of this lives in private company repositories, so each one has a short case study: why it existed, what I built and what came of it."
    >
      <WorkTable rows={rows} previews={previews} />
    </Section>
  );
}
