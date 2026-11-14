import Image from "next/image";
import Link from "next/link";
import {
  type Door as DoorSpec,
  flagship,
  projects,
  type Street,
} from "@/content";
import { Door, DoorFrame } from "./motifs";

type Address = {
  key: string;
  href: string;
  title: string;
  door: DoorSpec;
  street: Street;
  /** The picture behind the door; a project without one shows its name. */
  image?: string;
};

/** The doors on the street, in house-number order, the flagship among them. */
function addresses(): Address[] {
  const doors: Address[] = projects.flatMap((project) => {
    if (!project.street) return [];
    const image =
      project.cover?.src ??
      (project.visual.kind === "image" ? project.visual.src : undefined);
    return [
      {
        key: project.slug,
        href: `/work/${project.slug}`,
        title: project.title,
        door: project.door,
        street: project.street,
        image,
      },
    ];
  });
  doors.push({
    key: "flagship",
    href: "#project",
    title: flagship.name,
    door: flagship.door,
    street: flagship.street,
    image: flagship.video.poster,
  });
  return doors.sort((a, b) => a.street.no.localeCompare(b.street.no));
}

/**
 * Five project doors in a row. A door opens on hover or keyboard focus, and
 * stands ajar on touch screens (`globals.css`); the whole door is the link.
 */
export function DoorStreet() {
  const others = projects.filter((project) => !project.street);

  return (
    <>
      <ol className="grid grid-cols-2 items-start gap-[1.4rem] min-[920px]:grid-cols-5">
        {addresses().map((address) => (
          <li key={address.key}>
            {/* Named by the title, described by the line; the door is decoration. */}
            <Link
              href={address.href}
              aria-labelledby={`door-${address.key}-title`}
              aria-describedby={`door-${address.key}-line`}
              className="door-link flex flex-col gap-2"
            >
              <DoorFrame small>
                <Door motif={address.door.motif} paint={address.door.paint}>
                  {/* Inset by 2 px so the picture never shows along a closed leaf's edge. */}
                  <div className="absolute inset-[2px] flex flex-col justify-end overflow-hidden text-[#eef2f5]">
                    {address.image ? (
                      <Image
                        src={address.image}
                        alt=""
                        fill
                        sizes="(min-width: 920px) 240px, 45vw"
                        className="object-cover object-left-top opacity-[0.92]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 grid place-items-center [@media(hover:none)]:pl-[50%] [@media(hover:none)]:pr-[16%] [@media(hover:none)]:text-[1.1rem] bg-[radial-gradient(120%_60%_at_50%_40%,#1b2a3c,#0c1520_70%)] font-display text-[1.6rem] font-black tracking-[-0.03em]"
                      >
                        {address.title}
                      </span>
                    )}
                    <span
                      aria-hidden="true"
                      className="relative bg-[linear-gradient(transparent,rgba(8,14,22,0.92)_35%)] px-[14%] pt-6 pb-4 font-mono text-[0.7rem] tracking-[0.12em] [@media(hover:none)]:pr-[18%] [@media(hover:none)]:pl-[52%] [@media(hover:none)]:text-[0.62rem] [@media(hover:none)]:tracking-[0.06em] text-sun uppercase"
                    >
                      Read the case study →
                    </span>
                  </div>
                </Door>
              </DoorFrame>
              <span className="mt-2.5 flex justify-between gap-2 font-mono text-[0.75rem] text-muted-foreground">
                <span>{address.street.no}</span>
                <span>{address.street.note}</span>
              </span>
              <h3
                id={`door-${address.key}-title`}
                className="font-display text-[1.35rem] leading-[1.1] font-extrabold tracking-[-0.02em]"
              >
                {address.title}
              </h3>
              <span
                id={`door-${address.key}-line`}
                className="text-[0.95rem] text-muted-foreground"
              >
                {address.street.line}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-dashed pt-4 text-[0.98rem] text-muted-foreground">
        <span
          id="also-on-this-street"
          className="font-semibold text-foreground"
        >
          Also on this street:
        </span>
        <ul
          aria-labelledby="also-on-this-street"
          className="flex flex-wrap gap-x-8 gap-y-2"
        >
          {others.map((project) => (
            <li key={project.slug} className="flex items-baseline gap-1.5">
              <h3 className="font-semibold text-foreground">
                <Link
                  href={`/work/${project.slug}`}
                  className="transition-colors hover:text-brand"
                >
                  {project.title}
                </Link>
              </h3>
              <span>
                · {project.company} · {project.year}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
