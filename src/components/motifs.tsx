import { type ReactNode, useId } from "react";
import {
  archClipPath,
  DOOR_PAINTS,
  type DoorMotif,
  type DoorPaint,
  doorStuds,
  studBandDots,
  TILE,
  TILE_CORNERS,
  TILE_QUARTER,
  TILE_ROTATIONS,
} from "@/lib/motifs";
import { cn } from "@/lib/utils";

/*
 * Decorative motifs, drawn on the server as inline SVG. Every SVG is hidden
 * from assistive technology; doors that open are wrapped in real links or
 * buttons by the sections that use them.
 */

const STUD = "#10151b";

/** A safe id for `url(#…)` references. */
const svgId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");

const f = (n: number) => n.toFixed(1);

/** One leaf of a 400 × 620 double door, stretched to fill its box. */
export function DoorLeaf({
  half,
  motif,
  paint,
  className,
}: {
  half: "left" | "right";
  motif: DoorMotif;
  paint: DoorPaint;
  className?: string;
}) {
  const { fill, shade } = DOOR_PAINTS[paint];
  const left = half === "left";
  // Only the studs that show in this half; the seam's studs show in both.
  const studs = doorStuds(motif).filter(([x, , k]) =>
    left ? x - 4.6 * k <= 200 : x + 4.6 * k >= 200,
  );
  const planks = left ? [80, 140] : [260, 320];
  const knocker = left ? 164 : 236;

  return (
    <svg
      viewBox={left ? "0 0 200 620" : "200 0 200 620"}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("block size-full", className)}
    >
      <rect x="0" y="0" width="400" height="620" fill={fill} />
      <rect
        x="10"
        y="10"
        width="380"
        height="600"
        fill="none"
        stroke={shade}
        strokeWidth="3"
      />
      {planks.map((x) => (
        <line
          key={x}
          x1={x}
          y1="12"
          x2={x}
          y2="608"
          stroke={shade}
          strokeWidth="1.5"
          opacity=".55"
        />
      ))}
      <line x1="200" y1="0" x2="200" y2="620" stroke={shade} strokeWidth="4" />
      {studs.map(([x, y, k], index) => {
        const r = 4.6 * k;
        return (
          <g key={index}>
            <circle cx={f(x)} cy={f(y)} r={f(r)} fill={STUD} />
            <circle
              cx={f(x - r * 0.3)}
              cy={f(y - r * 0.3)}
              r={f(r * 0.28)}
              fill="#fff"
              opacity=".35"
            />
          </g>
        );
      })}
      <circle
        cx={knocker}
        cy="356"
        r="13"
        fill="none"
        stroke={STUD}
        strokeWidth="5"
      />
      <circle cx={knocker} cy="341" r="5" fill={STUD} />
    </svg>
  );
}

/**
 * A frame-less double door: the room (`children`) behind two leaves that
 * swing inward. `state` drives the leaves through CSS (`globals.css`).
 */
export function Door({
  motif,
  paint,
  state = "closed",
  children,
  className,
}: {
  motif: DoorMotif;
  paint: DoorPaint;
  state?: "closed" | "ajar" | "open";
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-state={state}
      className={cn(
        "relative aspect-[400/620] bg-room [perspective:1500px]",
        className,
      )}
    >
      {children}
      <div className="door-leaf door-leaf-l">
        <DoorLeaf half="left" motif={motif} paint={paint} />
      </div>
      <div className="door-leaf door-leaf-r">
        <DoorLeaf half="right" motif={motif} paint={paint} />
      </div>
    </div>
  );
}

/** The whitewashed frame around a door, and the threshold step below it. */
export function DoorFrame({
  children,
  small = false,
}: {
  children: ReactNode;
  small?: boolean;
}) {
  return (
    <div>
      <div
        className={cn(
          "bg-wall-2 shadow-[0_0_0_1px_var(--border)]",
          small ? "px-[9px] pt-[9px]" : "px-4 pt-4",
        )}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "bg-[#d9d5c8] dark:bg-border",
          small ? "-mx-3 h-[9px]" : "-mx-[26px] h-4",
        )}
      />
    </div>
  );
}

/** A full-width band of Qallaline tiles, the street's ground line. */
export function TileBand({ className }: { className?: string }) {
  const id = `tile${svgId(useId())}`;
  const { size, ground, cobalt, green, ochre, line } = TILE;

  return (
    <div className={cn("leading-[0]", className)}>
      <svg width="100%" height={size} aria-hidden="true" className="block">
        <defs>
          <pattern
            id={id}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <rect width={size} height={size} fill={ground} />
            {TILE_CORNERS.map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="9"
                  fill={cobalt}
                  stroke={line}
                  strokeWidth="1"
                />
                <circle cx={x} cy={y} r="3.2" fill={ochre} />
              </g>
            ))}
            {TILE_ROTATIONS.map((angle) => (
              <g key={angle} transform={`rotate(${angle} 32 32)`}>
                <path
                  d={TILE_QUARTER.petal}
                  fill={cobalt}
                  stroke={line}
                  strokeWidth="1"
                />
                <path
                  d={TILE_QUARTER.leaf}
                  fill={green}
                  stroke={line}
                  strokeWidth="1"
                />
                <circle
                  {...TILE_QUARTER.bud}
                  fill={ochre}
                  stroke={line}
                  strokeWidth="1"
                />
              </g>
            ))}
            <circle
              cx="32"
              cy="32"
              r="5.5"
              fill={ochre}
              stroke={line}
              strokeWidth="1"
            />
            <rect
              x=".5"
              y=".5"
              width="63"
              height="63"
              fill="none"
              stroke={line}
              strokeOpacity=".25"
            />
          </pattern>
        </defs>
        <rect width="100%" height={size} fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

const STUD_BAND_WIDTH = 1600;
const STUD_BAND_DOTS = studBandDots(STUD_BAND_WIDTH);

/** A 44 px rail of studs: small lozenges and dots, for the blue band. */
export function StudBand({ className }: { className?: string }) {
  return (
    <div className={cn("h-11 text-stud opacity-90", className)}>
      <svg
        viewBox={`0 0 ${STUD_BAND_WIDTH} 44`}
        preserveAspectRatio="xMinYMid slice"
        aria-hidden="true"
        className="block h-11 w-full"
      >
        {STUD_BAND_DOTS.map(([x, y, r], index) => (
          <circle key={index} cx={f(x)} cy={f(y)} r={r} fill="currentColor" />
        ))}
      </svg>
    </div>
  );
}

/**
 * A horseshoe arch around a picture. `ratio` is the box's width ÷ height; the
 * box keeps that aspect so the arch stays circular.
 */
export function ArchFrame({
  ratio,
  className,
  children,
}: {
  ratio: number;
  className?: string;
  children: ReactNode;
}) {
  const id = `arch${svgId(useId())}`;

  return (
    <div
      data-arch={ratio}
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: ratio, clipPath: `url(#${id})` }}
    >
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={archClipPath(ratio)} />
        </clipPath>
      </svg>
      {children}
    </div>
  );
}

/** The blue street plaque: Arabic above, Latin capitals below. */
export function Plaque({ arabic, latin }: { arabic: string; latin: string }) {
  return (
    <div className="inline-block border-[3px] border-white bg-[#1763b6] px-4 py-1.5 text-center whitespace-nowrap text-white outline-2 outline-[#1763b6]">
      <div
        lang="ar"
        className="font-kufi text-[1.05rem] leading-tight font-bold"
      >
        {arabic}
      </div>
      <div className="font-mono text-[0.68rem] tracking-[0.14em]">{latin}</div>
    </div>
  );
}
