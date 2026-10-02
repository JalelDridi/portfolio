import { profile } from "@/content";
import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = `${profile.name}: ${profile.headline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return ogCard({
    eyebrow: profile.role,
    title: profile.name,
    text: `${profile.headline}. Case studies and Payout Ledger, an open-source payout monitor.`,
  });
}
