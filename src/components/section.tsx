import type { ReactNode } from "react";

/** A home-page section: a label column and the title under a strong rule. */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24"
    >
      <div className="grid gap-3 border-t-2 border-foreground pt-3 lg:grid-cols-[10rem_1fr] lg:gap-8">
        <p className="font-mono text-[0.85rem] tracking-[0.08em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <div>
          <h2
            id={`${id}-title`}
            className="font-display text-[clamp(2rem,4.2vw,3.2rem)] leading-none font-bold tracking-[-0.025em] text-balance"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-3xl text-[1.15rem] text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="mt-8 sm:mt-10">{children}</div>
    </section>
  );
}
