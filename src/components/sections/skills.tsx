import { skills } from "@/content";
import { Reveal } from "../reveal";
import { Section } from "../section";
import { Marquee } from "../ui/marquee";

const all = skills.flatMap((group) => group.items);
const half = Math.ceil(all.length / 2);

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-border bg-card px-4 py-1.5 text-base font-medium whitespace-nowrap">
      {children}
    </span>
  );
}

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="The stack I work in"
      description="TypeScript end to end, PostgreSQL underneath, and the infrastructure to ship it."
    >
      {/* Decorative: the same items are listed properly below. */}
      <div
        aria-hidden="true"
        className="relative mb-10 flex flex-col gap-3 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <Marquee pauseOnHover className="p-0 [--duration:45s] [--gap:0.75rem]">
          {all.slice(0, half).map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </Marquee>
        <Marquee
          reverse
          pauseOnHover
          className="p-0 [--duration:45s] [--gap:0.75rem]"
        >
          {all.slice(half).map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </Marquee>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, index) => (
          <li key={group.group}>
            <Reveal delay={(index % 3) * 0.06} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-5">
                <h3 className="font-mono text-sm font-medium tracking-widest text-brand uppercase">
                  {group.group}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-pretty">
                  {group.items.join(" · ")}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
