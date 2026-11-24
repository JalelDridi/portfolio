import { episodes, flagship } from "@/content";
import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = flagship.name;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  const episode = episodes.find((item) => item.slug === "payout-ledger");
  return ogCard({
    eyebrow: episode ? `${episode.kind} · ${episode.year}` : flagship.tagline,
    title: flagship.name,
    text: flagship.summary,
  });
}
