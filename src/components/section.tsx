import type { ReactNode } from "react";
import { LABEL, SECTION_TITLE } from "@/lib/styles";

/**
 * A section of /about: a hairline above, then the mono label, the title and
 * an optional description and aside at the left, and the content at the
 * right. One column below 1024px.
 */
export function Section({
  id,
  label,
  title,
  description,
  aside,
  children,
}: {
  id: string;
  label: string;
  title: string;
  description?: string;
  /** Under the head, in the left column: the portrait on the About section. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="grid gap-x-14 gap-y-10 border-t border-border pt-10 *:min-w-0 sm:pt-14 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
    >
      <div>
        <p className={LABEL}>{label}</p>
        <h2 id={`${id}-title`} className={SECTION_TITLE}>
          {title}
        </h2>
        {description && (
          <p className="mt-5 max-w-[30rem] text-[1.05rem] leading-[1.6] text-pretty text-muted-foreground">
            {description}
          </p>
        )}
        {aside}
      </div>
      <div>{children}</div>
    </section>
  );
}
