import { OG_SIZE, ogCard } from "@/lib/og";
import { articles } from "@/writing";

export const alt = "Article";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  return ogCard({
    eyebrow: "Writing",
    title: article?.title ?? "Writing",
    text: article?.summary ?? "",
  });
}
