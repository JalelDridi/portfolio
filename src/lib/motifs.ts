/*
 * Tunisian motifs as plain geometry: the studs of a medina door, a stud band,
 * a horseshoe arch and a Qallaline tile. Ported number for number from the
 * mockup's `tn.js`; `src/components/motifs.tsx` renders them as inline SVG.
 */

export type DoorMotif = "star" | "sun" | "tree" | "lozenge" | "fish" | "rows";
export type DoorPaint = "blue" | "green" | "yellow" | "sky" | "red" | "night";

/** Door paints, the same in both themes. */
export const DOOR_PAINTS: Record<DoorPaint, { fill: string; shade: string }> = {
  blue: { fill: "#1763b6", shade: "#0f4f96" },
  green: { fill: "#23795a", shade: "#175c43" },
  yellow: { fill: "#edb021", shade: "#c48d0c" },
  sky: { fill: "#3d8bc9", shade: "#2a6fa8" },
  red: { fill: "#c5352c", shade: "#9a251e" },
  night: { fill: "#14324f", shade: "#0c2238" },
};

type Point = [x: number, y: number];

const TAU = Math.PI * 2;

const pt = (cx: number, cy: number, r: number, a: number): Point => [
  cx + r * Math.cos(a),
  cy + r * Math.sin(a),
];

/** Points spaced `gap` apart along a polyline. */
function along(points: Point[], gap: number, closed = false): Point[] {
  const out: Point[] = [];
  const pts = closed ? points.concat([points[0]]) : points;
  let carry = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    let d = carry;
    while (d < len) {
      out.push([x1 + ((x2 - x1) * d) / len, y1 + ((y2 - y1) * d) / len]);
      d += gap;
    }
    carry = d - len;
  }
  return out;
}

/** Points along a circular arc, from angle a0 to a1 (radians). */
function arc(
  cx: number,
  cy: number,
  r: number,
  a0: number,
  a1: number,
  gap: number,
): Point[] {
  const n = Math.max(2, Math.round((Math.abs(a1 - a0) * r) / gap));
  const out: Point[] = [];
  for (let i = 0; i <= n; i++)
    out.push(pt(cx, cy, r, a0 + ((a1 - a0) * i) / n));
  return out;
}

/** Eight-pointed star (two squares) outline as a polygon. */
function star8(cx: number, cy: number, R: number, r: number): Point[] {
  const p: Point[] = [];
  for (let i = 0; i < 16; i++)
    p.push(pt(cx, cy, i % 2 ? r : R, (i * TAU) / 16 - Math.PI / 2));
  return p;
}

function lozenge(cx: number, cy: number, w: number, h: number): Point[] {
  return [
    [cx, cy - h],
    [cx + w, cy],
    [cx, cy + h],
    [cx - w, cy],
  ];
}

/**
 * Stud layout for a 400 × 620 door, as [x, y, size]. The border, the
 * horseshoe arch, the rosettes, the seam and the lower panels are common to
 * every door; the centre motif varies.
 */
export function doorStuds(
  motif: DoorMotif,
): [x: number, y: number, size: number][] {
  const s: [number, number, number][] = [];
  const add = (pts: Point[], size?: number) =>
    pts.forEach(([x, y]) => s.push([x, y, size || 1]));
  const cx = 200;
  const cy = 236;
  const R = 150;
  // Horseshoe: a little more than a half circle.
  const a0 = Math.PI - 0.42;
  const a1 = TAU + 0.42;
  const [lx, ly] = pt(cx, cy, R, a0);
  const [rx, ry] = pt(cx, cy, R, a1);

  // border
  add(
    along(
      [
        [26, 594],
        [26, 26],
        [374, 26],
        [374, 594],
      ],
      24,
    ),
    1,
  );
  // horseshoe arch, double row, with the jambs running to the threshold
  add(arc(cx, cy, R, a0, a1, 17), 1.15);
  add(arc(cx, cy, R - 17, a0 + 0.02, a1 - 0.02, 17), 0.8);
  add(
    along(
      [
        [lx, ly + 16],
        [lx, 594],
      ],
      22,
    ),
    1.15,
  );
  add(
    along(
      [
        [rx, ry + 16],
        [rx, 594],
      ],
      22,
    ),
    1.15,
  );
  // spandrel rosettes
  (
    [
      [62, 62],
      [338, 62],
    ] as Point[]
  ).forEach(([x, y]) => {
    add(arc(x, y, 15, 0, TAU - 0.7, 11), 0.8);
    add([[x, y]], 1.2);
  });
  // seam
  add(
    along(
      [
        [200, 110],
        [200, 594],
      ],
      26,
    ).filter(([, y]) => Math.abs(y - 236) > 96 || motif === "rows"),
    0.7,
  );

  if (motif === "star") {
    add(along(star8(cx, cy, 92, 62), 14.5, true), 1);
    add(arc(cx, cy, 26, 0, TAU - 0.5, 13), 0.8);
    add([[cx, cy]], 1.5);
  } else if (motif === "sun") {
    [30, 56, 84].forEach((r, i) =>
      add(arc(cx, cy, r, 0, TAU - 0.2, 15), i === 2 ? 1.05 : 0.85),
    );
    for (let i = 0; i < 8; i++) add([pt(cx, cy, 108, (i * TAU) / 8)], 1.3);
    add([[cx, cy]], 1.5);
  } else if (motif === "tree") {
    // the fir-tree shape seen on medina doors: a trunk with rising chevrons
    add(
      along(
        [
          [cx, cy - 96],
          [cx, cy + 96],
        ],
        15,
      ),
      1,
    );
    (
      [
        [-62, 44],
        [-20, 60],
        [22, 74],
      ] as Point[]
    ).forEach(([dy, w]) => {
      add(
        along(
          [
            [cx - w, cy + dy + 34],
            [cx, cy + dy],
          ],
          14,
        ),
        0.85,
      );
      add(
        along(
          [
            [cx + w, cy + dy + 34],
            [cx, cy + dy],
          ],
          14,
        ).slice(0, -1),
        0.85,
      );
    });
    add([[cx, cy - 112]], 1.5);
  } else if (motif === "fish") {
    // an eye-shaped fish, a good-luck sign on Tunisian doors
    const fish = (ox: number, flip: number) => {
      const top: Point[] = [];
      const bot: Point[] = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const x = ox + flip * (t * 96 - 48);
        const w = Math.sin(t * Math.PI) * 30;
        top.push([x, cy - w]);
        bot.push([x, cy + w]);
      }
      add(along(top, 14), 0.9);
      add(along(bot, 14), 0.9);
      const tx = ox + flip * 48;
      add(
        along(
          [
            [tx, cy],
            [tx + flip * 24, cy - 24],
          ],
          12,
        ),
        0.8,
      );
      add(
        along(
          [
            [tx, cy],
            [tx + flip * 24, cy + 24],
          ],
          12,
        ),
        0.8,
      );
      add([[ox - flip * 26, cy - 6]], 1.3);
    };
    fish(cx, 1);
  } else if (motif === "lozenge") {
    add(along(lozenge(cx, cy, 70, 96), 14.5, true), 1);
    add(along(lozenge(cx, cy, 38, 52), 14.5, true), 0.8);
    add([[cx, cy]], 1.5);
  } else if (motif === "rows") {
    for (let y = 150; y <= 320; y += 34)
      add(
        along(
          [
            [96, y],
            [304, y],
          ],
          26,
        ),
        0.9,
      );
  }
  // lower panels: one lozenge per leaf, and a band
  [118, 282].forEach((x) => {
    add(along(lozenge(x, 480, 34, 52), 14, true), 0.85);
    add([[x, 480]], 1.3);
  });
  add(
    along(
      [
        [70, 400],
        [330, 400],
      ],
      20,
    ),
    0.75,
  );
  add(
    along(
      [
        [70, 560],
        [330, 560],
      ],
      20,
    ),
    0.75,
  );
  return s;
}

/**
 * A band of studs like a door's lower rail, 44 high: a lozenge of small dots
 * and one large dot every 56, as [x, y, r].
 */
export function studBandDots(
  width: number,
): [x: number, y: number, r: number][] {
  const out: [number, number, number][] = [];
  for (let x = 14; x < width; x += 56) {
    along(lozenge(x + 14, 22, 12, 14), 7, true).forEach(([px, py]) =>
      out.push([px, py, 2.1]),
    );
    out.push([x + 42, 22, 3.2]);
  }
  return out;
}

const round = (n: number) => Number(n.toFixed(4));

/**
 * A horseshoe arch in object-bounding-box units (0–1) for a box whose
 * width ÷ height is `ratio`. The arc has separate x and y radii so it stays
 * circular once the box is stretched to its real size.
 */
export function archClipPath(ratio: number): string {
  // tn.js `archPath(w, h)` with w = ratio, h = 1, then x divided by ratio.
  const w = ratio;
  const h = 1;
  const r = w * 0.5;
  const cy = r * 1.02;
  const k = 0.26;
  const sx = Math.cos(Math.PI - k) * r + w / 2;
  const sy = cy + Math.sin(Math.PI - k) * r;
  const ex = w - sx;
  const inset = w * 0.035;
  const x = (v: number) => round(v / ratio);
  const y = round;
  return [
    `M ${x(inset)} ${y(h)}`,
    `L ${x(inset)} ${y(sy + r * 0.25)}`,
    `L ${x(sx)} ${y(sy)}`,
    `A ${round(r / ratio)} ${y(r)} 0 1 1 ${x(ex)} ${y(sy)}`,
    `L ${x(w - inset)} ${y(sy + r * 0.25)}`,
    `L ${x(w - inset)} ${y(h)}`,
    "Z",
  ].join(" ");
}

/** The Qallaline tile's colours: ground, cobalt, green, ochre, manganese line. */
export const TILE = {
  size: 64,
  ground: "#f3ecdb",
  cobalt: "#1f4e9c",
  green: "#2e7d4f",
  ochre: "#d4a020",
  line: "#3e2a24",
} as const;

/**
 * The 64 × 64 tile: one quarter motif (a cobalt petal, a green leaf, an ochre
 * bud) drawn four times around the centre, with quarter rosettes at the corners.
 */
export const TILE_QUARTER = {
  petal: "M32 32 C 30 22, 26 14, 32 6 C 38 14, 34 22, 32 32 Z",
  leaf: "M32 32 C 40 28, 46 22, 52 12 C 44 14, 36 20, 32 32 Z",
  bud: { cx: 54, cy: 10, r: 3 },
} as const;

export const TILE_ROTATIONS = [0, 90, 180, 270] as const;

export const TILE_CORNERS: Point[] = [
  [0, 0],
  [64, 0],
  [0, 64],
  [64, 64],
];
