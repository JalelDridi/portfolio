import type { ReactNode } from "react";
import { Reveal } from "./reveal";

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
      <Reveal>
        <p className="font-mono text-sm font-medium tracking-widest text-brand uppercase">
          {eyebrow}
        </p>
        <h2
          id={`${id}-title`}
          className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-5 max-w-3xl text-xl text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </Reveal>
      <div className="mt-10 sm:mt-12">{children}</div>
    </section>
  );
}
