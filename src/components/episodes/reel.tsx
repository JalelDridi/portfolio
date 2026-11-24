"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  ViewTransition,
  type KeyboardEvent,
} from "react";
import { decode } from "@/components/episodes/decode";
import { profile, ui, type Episode } from "@/content";

/** How long an episode stays on screen while the reel plays on its own. */
const HOLD_MS = 6000;

/** The reel plays on its own only on a wide screen, with motion allowed. */
const AUTO_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/** Any of these on the page stops the reel for good. */
const STOP_EVENTS = [
  "pointerdown",
  "keydown",
  "touchstart",
  "wheel",
  "scroll",
] as const;

// Made once, on first use in the browser, and kept.
let autoQuery: MediaQueryList | undefined;
let reduceQuery: MediaQueryList | undefined;
const auto = () => (autoQuery ??= matchMedia(AUTO_QUERY));
const reduce = () => (reduceQuery ??= matchMedia(REDUCE_QUERY));

function subscribeAuto(onChange: () => void) {
  const query = auto();
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The home page: one episode at a time, as a title card over a still of the
 * real product, with the list of episodes at the right. Below 768px, every
 * episode is its own card, stacked. The server HTML shows the first episode,
 * and every episode is a link, so nothing depends on JavaScript or hover.
 */
export function Reel({ episodes }: { episodes: Episode[] }) {
  const [index, setIndex] = useState(0);
  // False until the episode first changes, so the first card is not cut on first paint.
  const [changed, setChanged] = useState(false);
  // The first pointer, key, touch, wheel or scroll on the page stops the reel for good.
  const [touched, setTouched] = useState(false);
  const autoAllowed = useSyncExternalStore(
    subscribeAuto,
    () => auto().matches,
    () => false,
  );
  const tabVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => false,
  );
  const playing = autoAllowed && tabVisible && !touched;

  const titles = useRef<(HTMLHeadingElement | null)[]>([]);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const shown = useRef(index);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (touched) return;
    const stop = () => setTouched(true);
    const options = { capture: true, passive: true } as const;
    for (const type of STOP_EVENTS)
      window.addEventListener(type, stop, options);
    return () => {
      for (const type of STOP_EVENTS)
        window.removeEventListener(type, stop, options);
    };
  }, [touched]);

  // Hydrated, and listening for the input that stops the reel (tests wait on it).
  useEffect(() => {
    if (root.current) root.current.dataset.ready = "";
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      setChanged(true);
      setIndex((current) => (current + 1) % episodes.length);
    }, HOLD_MS);
    return () => clearTimeout(timer);
  }, [playing, index, episodes.length]);

  // A change of episode decodes the new title, unless motion is reduced.
  useEffect(() => {
    if (shown.current === index) return;
    shown.current = index;
    const title = titles.current[index];
    if (!title || reduce().matches) return;
    return decode(title, episodes[index].title);
  }, [index, episodes]);

  const select = (next: number) => {
    setTouched(true);
    if (next !== index) setChanged(true);
    setIndex(next);
  };

  // Arrow keys move through the list, only while focus is inside it.
  const onListKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    event.preventDefault();
    const focused = links.current.findIndex(
      (link) => link === document.activeElement,
    );
    const from = focused === -1 ? index : focused;
    const step = event.key === "ArrowDown" ? 1 : -1;
    links.current[(from + step + episodes.length) % episodes.length]?.focus();
  };

  return (
    <div
      ref={root}
      data-cut={changed ? "" : undefined}
      className="reel relative md:h-svh md:min-h-[36rem] md:overflow-hidden"
    >
      {/* First in the page, so the name comes before every title; at the bottom on a wide screen. */}
      <div className="relative z-20 flex flex-col gap-1 px-4 pt-20 pb-6 font-mono sm:px-11 text-[0.8rem] text-muted-foreground md:absolute md:inset-x-0 md:bottom-0 md:flex-row md:items-center md:gap-[18px] md:pt-0 md:pb-7">
        <h1 className="font-medium whitespace-nowrap text-foreground">
          {profile.name}
        </h1>
        <span
          className="hidden whitespace-nowrap tabular-nums md:inline"
          aria-hidden="true"
        >
          {pad(index + 1)} / {pad(episodes.length)}
        </span>
        <div
          className="relative hidden h-[2px] min-w-16 flex-1 overflow-hidden bg-border md:block"
          aria-hidden="true"
        >
          <i
            key={playing ? `${index}-playing` : "still"}
            className={`absolute inset-0 origin-left bg-red ${playing ? "reel-progress" : ""}`}
            style={
              playing
                ? undefined
                : { transform: `scaleX(${(index + 1) / episodes.length})` }
            }
          />
        </div>
        <p className="md:text-right">{ui.tagline}</p>
      </div>

      {episodes.map((episode, i) => (
        <article
          key={episode.slug}
          data-on={i === index ? "" : undefined}
          className="reel-episode relative h-[78svh] min-h-[30rem] overflow-hidden md:absolute md:inset-0 md:h-auto md:min-h-0"
        >
          <ViewTransition
            name={`episode-still-${episode.slug}`}
            share="morph"
            default="none"
          >
            <div className="reel-still absolute inset-0">
              <Image
                src={episode.still.src}
                alt=""
                fill
                sizes="100vw"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                className="object-cover object-top"
              />
            </div>
          </ViewTransition>
          <div className="reel-tint absolute inset-0" aria-hidden="true" />
          <div className="reel-card absolute inset-x-0 bottom-0 px-4 pb-10 sm:px-11 md:right-[calc(300px+2.75rem+40px)] md:pr-0 md:pb-24 lg:right-[calc(400px+2.75rem+40px)]">
            <p className="font-mono text-[0.8rem] text-muted-foreground md:text-[15px]">
              {episode.file} · <span className="lowercase">{episode.kind}</span>{" "}
              · {episode.year}
            </p>
            <h2
              ref={(node) => {
                titles.current[i] = node;
              }}
              className="reel-title mt-3 font-display font-black text-red uppercase md:mt-3.5"
            >
              {episode.title}
            </h2>
            <p className="mt-5 max-w-[34ch] font-mono text-base leading-[1.45] text-foreground md:mt-[26px] md:text-[19px]">
              {episode.line}
            </p>
            <Link
              href={episode.href}
              className="mt-6 inline-flex items-center gap-3 border border-foreground px-5 py-[13px] font-mono text-sm tracking-[0.06em] text-foreground uppercase transition-colors hover:bg-foreground hover:text-background md:mt-7"
            >
              {ui.play} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      ))}

      <nav
        aria-label="Episodes"
        onKeyDown={onListKey}
        className="absolute right-11 bottom-24 z-20 hidden w-[300px] border border-border bg-[rgba(7,7,7,0.78)] px-4 py-1.5 lg:px-[22px] font-mono backdrop-blur-[10px] md:block lg:w-[400px]"
      >
        <ul>
          {episodes.map((episode, i) => (
            <li
              key={episode.slug}
              className="border-b border-border last:border-b-0"
            >
              <Link
                ref={(node) => {
                  links.current[i] = node;
                }}
                href={episode.href}
                aria-current={i === index ? "true" : undefined}
                onPointerEnter={() => select(i)}
                onFocus={() => select(i)}
                className="group flex justify-between gap-3 py-[13px] text-[13px] text-muted-foreground lg:text-[14.5px] transition-[color,padding] duration-150 hover:pl-2 hover:text-foreground aria-[current=true]:pl-2 aria-[current=true]:text-foreground"
              >
                <span className="min-w-0 truncate">
                  <span
                    aria-hidden="true"
                    className="hidden align-[2px] text-[10px] text-brand group-aria-[current=true]:inline"
                  >
                    ▶{" "}
                  </span>
                  {episode.file}
                </span>
                <span className="text-xs tracking-[0.08em] group-aria-[current=true]:text-brand">
                  {episode.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
