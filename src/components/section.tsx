import type { ReactNode } from "react";

/**
 * A home-page section head: a kicker (an optional Arabic word, then the mono
 * label), the title with an optional accent in blue, and an optional
 * description to the right on wide screens.
 */
export function Section({
  id,
  eyebrow,
  title,
  accent,
  arabic,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  /** Appended to the title in blue; part of the heading's name. */
  accent?: string;
  /** An Arabic word from the spec's list; `eyebrow` carries its meaning. */
  arabic?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto w-full max-w-[1280px] px-5 pt-[4.2rem]"
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="flex items-center gap-3">
            {arabic && (
              <span
                lang="ar"
                className="font-kufi text-[1.2rem] font-bold text-brand"
              >
                {arabic}
              </span>
            )}
            <span className="font-mono text-[0.8rem] tracking-[0.1em] text-muted-foreground uppercase">
              {eyebrow}
            </span>
          </p>
          <h2
            id={`${id}-title`}
            className="mt-2 max-w-[16ch] font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] font-black tracking-[-0.035em] text-balance"
          >
            {title}
            {accent && (
              <>
                {" "}
                <span className="text-brand">{accent}</span>
              </>
            )}
          </h2>
        </div>
        {description && (
          <p className="max-w-[26rem] text-[1.08rem] text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
