import { earlierEpisodes, episodes } from "@/content";

/** Every episode page, in the order "Next episode" walks them. */
const ORDER: { href: string; file: string; title: string }[] = [
  ...episodes,
  ...earlierEpisodes,
];

function position(slug: string) {
  const index = ORDER.findIndex((item) => item.href === `/work/${slug}`);
  if (index === -1) throw new Error(`No episode for the slug "${slug}"`);
  return index;
}

/** The file name an episode page shows, e.g. "eps1.2_potluck.ts". */
export function episodeFile(slug: string) {
  return ORDER[position(slug)].file;
}

/** The episode after this one: the reel, then the earlier ones, then the first again. */
export function episodeAfter(slug: string) {
  return ORDER[(position(slug) + 1) % ORDER.length];
}
