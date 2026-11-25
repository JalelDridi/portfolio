import Link from "next/link";
import { titleStyle } from "@/components/episodes/episode-head";
import { episodeAfter } from "@/components/episodes/order";
import { ui } from "@/content";

/** The link to the following episode, at the foot of every episode page. */
export function NextEpisode({ slug }: { slug: string }) {
  const next = episodeAfter(slug);
  return (
    <Link
      href={next.href}
      className="group mt-8 block border-y border-border py-10 sm:py-14"
    >
      <span className="font-mono text-[0.8rem] tracking-[0.1em] text-brand uppercase">
        {ui.next}{" "}
        <span
          aria-hidden="true"
          className="inline-block transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </span>
      <span className="mt-4 block font-mono text-[0.85rem] text-muted-foreground transition-colors group-hover:text-foreground">
        {next.file}
      </span>
      <span
        className="episode-next-title mt-3 block font-display font-black text-red uppercase"
        style={titleStyle(next.title)}
      >
        {next.title}
      </span>
    </Link>
  );
}
