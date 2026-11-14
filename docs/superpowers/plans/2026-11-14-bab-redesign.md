# Bab Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin jaleldridi.vercel.app as "Bab" (a whitewashed Tunisian street where every project is a studded door that opens), with Solvedblue as the current job, keeping every tested behaviour from the previous redesign branch.

**Architecture:** The branch `redesign/bab` starts from `redesign/statement`, so content structure, routes, redirects, playground logic and tests already exist. Motifs (doors, tiles, studs, arches) are pure functions in `src/lib/motifs.ts` rendered as inline SVG by server components in `src/components/motifs.tsx`; only the hero door needs client state. Tokens and fonts change once in `globals.css` and `layout.tsx`; each section is restyled to match the mockup.

**Tech Stack:** Next.js 16 (App Router, static), React 19, Tailwind 4, next-themes, `next/font/google`, Playwright 1.63 with axe.

**Spec:** `docs/superpowers/specs/2026-11-14-bab-redesign-design.md`. Visual contract: `D:\Downloads\Portfolio\docs\redesign2\mockups\bab.html` with `tn.js`, and the screenshots `D:\Downloads\Portfolio\docs\redesign2\shots\bab-hero.png`, `bab-full.png`, `bab-phone.png`. Read all of them before any task.

## Global Constraints

- Match the mockup's layout, proportions, colours and type. Where the mockup and the spec disagree, the spec wins; where both are silent, choose what fits the mockup.
- Tokens, door paints, tile colours, type sizes and the list of allowed Arabic strings are in the spec, sections "Tokens", "Type" and "Motifs". Use those exact values.
- Fonts through `next/font/google`: `Alexandria` (weights 500, 700, 800, 900; subset latin; variable `--font-alexandria`), `Onest` (400, 500, 600; `--font-onest`), `DM_Mono` (400, 500; `preload: false`; `--font-dm-mono`), `Reem_Kufi` (500, 700; subsets `["arabic"]`; `preload: false`; `--font-reem-kufi`). Tailwind: `font-display` = Alexandria, `font-sans` = Onest, `font-mono` = DM Mono, `font-kufi` = Reem Kufi. No Bricolage, no IBM Plex, no Geist.
- Every Arabic string carries `lang="ar"` and sits next to its transliteration and English meaning. Use only the strings the spec lists.
- Motif SVGs are decorative: `aria-hidden="true"`, no text inside. Doors that open are real links or buttons with accessible names.
- No flag, crescent and star, hand of Fatima, camels, palms, dunes, zellige or arabesques. No count-ups, gradient text, glows, pills, marquees, border beams.
- `--radius: 0`, except arch-topped buttons (`border-radius: 999px 999px 10px 10px`) and the phone frame in `media.tsx`.
- New wording is limited to the sentences the spec and this plan quote. Everything else is existing copy, moved or restyled.
- Accessible names the tests rely on must survive unless a task changes the test: h1 "Mohamed Jalel Dridi"; buttons "Send a webhook", "Send it twice", "Send out of order", "Switch between light and dark theme", "Open the menu", "Copy email"; links "Try the live demo", "Read the code", "All work", "All writing", "Back to the home page", "changelog"; heading "What I built"; nav `aria-label="Sections"`; `#project video`; four `HH:MM` texts in `#about`; `#leadership ol li` in role order; `table` named "Ledger entries".
- Never delete files. Files that become unused are listed in the task report.
- Before every commit: `pnpm lint && pnpm format:check && pnpm typecheck` (`pnpm format` first if needed; leave reformatted files you did not touch out of the commit). For Playwright: `CIRCLE_NODE_TOTAL=2 pnpm build`, then `pnpm exec playwright test --workers=1 -g "<pattern>"`; the last step of every task runs the whole suite.
- Commits: small, conventional. Branch `redesign/bab`. Do not push.

## Review Focus

1. A touch screen cannot hover: the project doors must show their screenshot without hover (ajar by default under `@media (hover: none)`), and a tap must follow the link. Pinned in Task 3.
2. A keyboard user must be able to open the hero door and reach the links inside; the closed room must not trap focus or expose hidden links. Pinned in Task 3.
3. `prefers-reduced-motion`: doors change state without animating and everything is visible at rest. Pinned in Task 3.
4. Dark theme contrast of `--brand` text on the night wall, of white text on the blue band, and of ink on the yellow button. Pinned by the axe suite on `/`, `/work/potluck`, `/work/solvedblue`, an article and `/changelog` in both themes (Task 5 adds `/work/solvedblue`).
5. A 340 px phone: five doors, the playground table and the arch pictures must not widen the page. Pinned by the phone test (Task 3 adds an open hero door to it).

---

### Task 1: Foundations: fonts, tokens, motifs, shared components, header, footer

**Files:**

- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/section.tsx`, `src/components/link-button.tsx`, `src/components/tags.tsx`, `src/components/browser-frame.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/components/theme-toggle.tsx`, `src/components/mobile-nav.tsx`, `src/components/status-clocks.tsx` (only if a single-clock use needs a prop)
- Create: `src/lib/motifs.ts`, `src/components/motifs.tsx`
- Test: `e2e/site.spec.ts`

**Interfaces:**

- Produces, in `src/lib/motifs.ts` (pure, no React):
  - `type DoorMotif = "star" | "sun" | "tree" | "lozenge" | "fish" | "rows"`
  - `type DoorPaint = "blue" | "green" | "yellow" | "sky" | "red" | "night"`
  - `const DOOR_PAINTS: Record<DoorPaint, { fill: string; shade: string }>` (values from the spec)
  - `doorStuds(motif: DoorMotif): [x: number, y: number, size: number][]` in a 400 × 620 space, ported from `tn.js` without changing the geometry
  - `studBandDots(width: number): [x: number, y: number, r: number][]`
  - `archClipPath(ratio: number): string`: a horseshoe-arch path in object-bounding-box units (0–1) for a box whose width ÷ height is `ratio`, so the arc stays circular
  - `TILE` colours and a `tileMarkup(): string` or equivalent data for the 64 × 64 Qallaline tile
- Produces, in `src/components/motifs.tsx` (server components, every SVG `aria-hidden`):
  - `DoorLeaf({ half: "left" | "right", motif: DoorMotif, paint: DoorPaint, className? })`: one leaf, `viewBox` of its half, `preserveAspectRatio="none"`, studs with the small highlight, plank lines, one ring knocker
  - `Door({ motif, paint, state?: "closed" | "ajar" | "open", children?, className? })`: frame-less double door: a `relative` box with `aspect-ratio: 400/620`, `perspective: 1500px`, the room (`children`) behind, two `DoorLeaf`s with classes `door-leaf door-leaf-l|r`; state sets `data-state`
  - `DoorFrame({ children, small? })`: the `--wall-2` frame around a door plus the threshold step
  - `TileBand({ className? })`, `StudBand({ className? })`, `ArchFrame({ ratio, className?, children })` (uses `useId` for the `clipPath` id), `Plaque({ arabic, latin })`
- Produces CSS in `globals.css`: tokens (day and night), `@theme` mappings (`--color-brand`, `--color-brand-deep`, `--color-sun`, `--color-leaf`, `--color-red`, `--color-stud`, `--color-room`, `--color-wall-2`, fonts), and the door state rules: `.door-leaf { transition: transform .9s cubic-bezier(.2,.7,.2,1), filter .9s; }`, `[data-state="ajar"] .door-leaf-r { transform: rotateY(-76deg); filter: brightness(.82); }`, `[data-state="open"] .door-leaf-l { transform: rotateY(78deg); filter: brightness(.82); }`, `[data-state="open"] .door-leaf-r { transform: rotateY(-78deg); filter: brightness(.82); }`, with `transform-origin` on the hinge side.
- `Section({ id, eyebrow, title, accent?, arabic?, description?, children })`: kicker row (optional Arabic word in `font-kufi text-brand`, then the mono label), `h2` in Alexandria 900 where `accent` is appended in `text-brand` (the heading's accessible name is `title` plus `accent`), optional description to the right on wide screens (as `.head` in the mockup). No rules.
- `LinkButton` variants: `primary` (blue fill, white text), `outline` (2 px ink border), `sun` (yellow fill, ink text), `light` (2 px white border, white text, for the blue band). All arch-topped, 3 rem tall.
- `BrowserFrame({ url, note?, children, className? })` keeps its API: a `--wall-2` frame with a mono caption bar.
- Header and footer as the spec's "Page structure" describes. Footer keeps `Site v{site.version} · changelog`, `Last deploy …`, "Source on GitHub", the three clocks, and adds the credit line and بالسلامة with "Bislema · goodbye".

- [ ] **Step 1: Write the failing tests**

```ts
test("the page is set in the Bab typefaces and ends on a band of tiles", async ({
  page,
}) => {
  await page.goto("/");
  const h1Font = await page
    .getByRole("heading", { level: 1 })
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(h1Font).toMatch(/Alexandria/i);
  const bodyFont = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(bodyFont).toMatch(/Onest/i);
  await expect(
    page.getByRole("contentinfo").locator("svg pattern"),
  ).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toContainText("Bislema");
});

test("every Arabic word is marked as Arabic", async ({ page }) => {
  await page.goto("/");
  const unmarked = await page.evaluate(() => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    const bad: string[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (
        /[\u0600-\u06FF]/.test(node.data) &&
        !node.parentElement?.closest('[lang="ar"]')
      )
        bad.push(node.data.trim());
    }
    return bad;
  });
  expect(unmarked).toEqual([]);
});
```

- [ ] **Step 2: Run them to verify they fail** (`-g "Bab typefaces|marked as Arabic"`; expected: the first fails on the font family).

- [ ] **Step 3: Fonts and tokens** as Global Constraints and the spec's tables say. Remove the Statement tokens that no longer exist only after grepping `src/` for their uses and replacing them (`--debit` becomes `--red`; keep the `draw` keyframe only if still used).

- [ ] **Step 4: `motifs.ts` and `motifs.tsx`.** Port from `tn.js`: `doorStuds` (all six motifs, same numbers), the stud band, the tile, the arch. For `archClipPath(ratio)`: take the mockup's `archPath(w, h)` with `w = ratio`, `h = 1`, then divide x by `ratio` so the output is in 0–1 units; emit SVG arc commands with separate x and y radii (`rx = 0.5`, `ry = 0.5 * ratio`).

- [ ] **Step 5: Shared components, header, footer** per Interfaces. The old sections must still compile against the new `Section` (they pass `eyebrow`, `title`, `description`); it is fine if they look unfinished until their own task.

- [ ] **Step 6: Run** `-g "Bab typefaces|marked as Arabic|status strip|theme switch|menu button|changelog"`, then the whole suite; fix what the restyle broke (the status-strip and changelog tests must still pass). Lint, format, typecheck.

- [ ] **Step 7: Commit** `feat: bab foundations: Alexandria and Onest, street tokens, door, tile and arch motifs, header and footer`.

---

### Task 2: Content: Solvedblue as the current job, a door for every project

**Files:**

- Modify: `src/content.ts`, `e2e/site.spec.ts`, `src/app/page.tsx` (JSON-LD only if it reads a changed field)
- Create: `public/work/solvedblue-home.png` (copy of `D:\Downloads\Portfolio\docs\solvedblue\solvedblue-home.png`)

**Interfaces:**

- Consumes: `DoorMotif`, `DoorPaint` from Task 1.
- Produces: `Project.door: { motif: DoorMotif; paint: DoorPaint }` (required) and `Project.street?: { no: string; note: string; line: string }` for the doors shown on the home page; `flagship.door` and `flagship.street` of the same shapes; `profile.heroLine: string`; `leadership.place: string`; the new first `experience` entry; `changelog[0]` rewritten.

- [ ] **Step 1: Update and write the tests**

`PROJECTS` becomes `["Solvedblue", "Potluck", "tnpay", "Deal Grader", "Kora", "Spyder", "Field-inspection platform", "Event Orchestrator"]`. Add:

```ts
test("Solvedblue is the current job and has a case study", async ({ page }) => {
  await page.goto("/");
  const first = page.locator("#experience li").first();
  await expect(first).toContainText("Solvedblue");
  await expect(first).toContainText("Nov 2026 – present");
  await expect(page.locator("#experience li").nth(1)).toContainText(
    "Jun 2026 – Oct 2026",
  );
  await page.goto("/work/solvedblue");
  await expect(
    page.getByRole("heading", { level: 1, name: "Solvedblue" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Solvedblue", exact: true }).first(),
  ).toHaveAttribute("href", "https://solvedblue.com");
});
```

In "the home page describes its subject to search engines" also expect `data.mainEntity.worksFor.name` to be `"Solvedblue"`.

- [ ] **Step 2: Run to verify they fail** (`-g "Solvedblue is the current job|who I am|search engines"`).

- [ ] **Step 3: Content**

- Add the Solvedblue project as the first item of `projects`, with every field exactly as in `D:\Downloads\Portfolio\docs\solvedblue\brief.md` section 2 (summary, why, seven built items, stack, links, cover, diagram), plus `door: { motif: "star", paint: "blue" }` and `street: { no: "N° 01", note: "2026 · now", line: "iMessage for business: the engine that decides what is sent, from which line, and when." }`.
- Doors: potluck `tree`/`yellow`, `street: { no: "N° 03", note: "2026", line: "Stripe Connect payments, live shopping and realtime chat for a US marketplace." }`; tnpay `lozenge`/`sky`, `street: { no: "N° 04", note: "Open source", line: "Typed SDKs for Tunisia's payment gateways. Three packages on npm." }`; kora `fish`/`red`, `street: { no: "N° 05", note: "Side project", line: "Daily football games for Tunisia, in Arabic, French and English." }`; deal-grader `rows`/`night`; spyder `sun`/`sky`; inspection-platform `lozenge`/`green`; event-orchestrator `rows`/`yellow` (no `street`). `flagship.door = { motif: "sun", paint: "green" }`, `flagship.street = { no: "N° 02", note: "Open source", line: "A payout monitor on a double-entry ledger that cannot go negative. 99 tests." }`.
- Experience, profile (`intro`, `heroLine`), the Potluck `why`, the About paragraph and `leadership.place`: exactly the sentences in the spec's "Content changes".
- `ledger`: change the Potluck row's value to `"owned Jun – Oct 2026"` (the component is removed in Task 3).
- `changelog[0]`: `{ version: "3.0.0", date: "2026-11-14", title: "Bab", items: ["A whitewashed street: every project is a studded medina door that opens.", "A band of Qallaline tiles as the ground line, horseshoe arches around pictures, and a few Derja words with their meaning.", "Alexandria and Onest replace Geist; one blue, one yellow.", "Solvedblue added as the current job; one Potluck case study with four parts; Kora added.", "The pipeline playground posts its steps into a ledger of entries.", "A status strip with live clocks, the deploy date and this changelog."] }`. Keep the older entries.

- [ ] **Step 4: Run the whole suite**; lint, format, typecheck.

- [ ] **Step 5: Commit** `feat: Solvedblue as the current job, a door for every project`.

---

### Task 3: The hero door and the street of doors

**Files:**

- Modify: `src/components/sections/hero.tsx`, `src/components/sections/work.tsx`, `src/app/page.tsx` (section order: Hero, Work, Flagship, Playground, Writing, Skills, About, Experience, Leadership, Contact), `e2e/site.spec.ts`
- Create: `src/components/hero-door.tsx` (client), `src/components/door-street.tsx` (server)
- No longer used after this task (leave in place, list in the report): `src/components/account-summary.tsx`, `src/components/work-table.tsx`, the `ledger` export

**Interfaces:**

- Consumes: `Door`, `DoorFrame`, `DoorLeaf`, `Plaque`, `TileBand`, `LinkButton`, `Rise`, `LocalTime`, `profile`, `projects`, `flagship`.
- Produces: `HeroDoor()`: a `DoorFrame` with the Bizerte `Plaque`; inside, a `<button aria-expanded aria-controls="hero-room" aria-label="Open the door">` (label switches to "Close the door") that covers the leaves and toggles `data-state` between `"ajar"` and `"open"`; the room `<div id="hero-room">` holds "Now", "Solvedblue", "iMessage for business." and, as real links, "Read the case study" (`/work/solvedblue`) and "Break my pipeline" (`#playground`); while the state is `"ajar"` the links are `inert`/`tabindex=-1` and visually only the short teaser shows. `DoorStreet()`: an `<ol>` of five `<li>`: each an `<a>` (`/work/<slug>`, or `#project` for the flagship) containing `DoorFrame` + `Door` whose room is the project's cover or image (`next/image`, `sizes="(min-width: 920px) 240px, 45vw"`, `object-cover object-left-top`) with the mono overlay "Read the case study →"; under it the mono row (`street.no`, `street.note`), the `<h3>` title and `street.line`. Doors open through CSS: `a:hover`, `a:focus-visible` and `@media (hover: none)` (ajar).

- [ ] **Step 1: Write the failing tests** (replace "the account summary is in the HTML…" and "hovering a work row changes the preview")

```ts
test("the hero door opens and closes with the keyboard", async ({ page }) => {
  await page.goto("/");
  const door = page.getByRole("button", { name: "Open the door" });
  await expect(door).toHaveAttribute("aria-expanded", "false");
  await expect(
    page
      .locator("#hero-room")
      .getByRole("link", { name: "Read the case study" }),
  ).toHaveCount(0);
  await door.focus();
  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "Close the door" });
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await expect(
    page
      .locator("#hero-room")
      .getByRole("link", { name: "Read the case study" }),
  ).toHaveAttribute("href", "/work/solvedblue");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Open the door" }),
  ).toBeVisible();
});

test("a project door swings open on hover and on keyboard focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const street = page.locator("#work");
  const link = street.getByRole("link", { name: /Potluck/ }).first();
  const leaf = link.locator(".door-leaf-r");
  expect(await leaf.evaluate((el) => getComputedStyle(el).transform)).toBe(
    "none",
  );
  await link.hover();
  expect(await leaf.evaluate((el) => getComputedStyle(el).transform)).not.toBe(
    "none",
  );
  await page.mouse.move(0, 0);
  await link.focus();
  expect(await leaf.evaluate((el) => getComputedStyle(el).transform)).not.toBe(
    "none",
  );
});

test("the street shows five doors with their numbers before any JavaScript runs", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const doors = page.locator("#work ol > li");
  await expect(doors).toHaveCount(5);
  await expect(doors.first()).toContainText("N° 01");
  await expect(doors.first()).toContainText("Solvedblue");
  await expect(doors.nth(1)).toContainText("99 tests");
  await context.close();
});
```

In "fits a phone screen…": on `/`, before measuring, also click the hero door open. Update "a project card opens its case study" so it clicks the "Deal Grader" link in the "Also on this street" row. Keep "shows who I am…" (every `PROJECTS` title is an `h3` on the home page; the flagship title is an `h3` in the street as well as the `h2` of its band).

- [ ] **Step 2: Run to verify they fail** (`-g "hero door|project door|five doors"`).

- [ ] **Step 3: Hero** as the mockup's `.hero`: greeting (عسلامة + "Aslema · hello from Tunisia"), h1 (`aria-label`, "Mohamed" small, "Jalel", "Dridi" + a yellow full stop that is `aria-hidden`), the role line (`profile.role` in ink + `profile.headline` in blue), `profile.heroLine`, buttons "Open a door ↓" (`#work`, primary), "Email me", "CV", GitHub and LinkedIn icon links, the facts row ("Remote with US teams since Jan 2026", "English C2 · French C1 · Arabic", `profile.availability`), the `LocalTime` line; right column `<HeroDoor />`; under the grid the `TileBand`. `Rise` delays 0 / 100 / 220 / 340.

- [ ] **Step 4: `HeroDoor` and `DoorStreet`** per Interfaces; "Also on this street:" row under the `<ol>` with the remaining projects (`!project.street`) as `<h3>` links with company and year in muted text. `work.tsx` uses `Section` with `arabic="باب"`, `eyebrow="Bab · the work"`, `title="Behind each door,"`, `accent="something I shipped."`, description "Five doors, five projects. Hover or tap one and it opens. The nail patterns are the ones on the doors of the Tunis medina; each door's pattern belongs to its project."

- [ ] **Step 5: Run** the three new tests, then the whole suite; lint, format, typecheck. Take a 1280 × 800 screenshot of the top of `/` and a full-page one (Playwright with `channel: "chrome"` against `next start` on port 3200) into `D:\Downloads\Portfolio\docs\redesign2\shots-site\t3-home-top.png` and `t3-home-full.png`, compare with `bab-hero.png` and fix differences in proportion or spacing.

- [ ] **Step 6: Commit** `feat: a hero door that opens and a street of project doors`.

---

### Task 4: The rest of the home page

**Files:**

- Modify: `src/components/sections/flagship.tsx`, `playground.tsx`, `writing.tsx`, `skills.tsx`, `about.tsx`, `experience.tsx`, `leadership.tsx`, `contact.tsx`, `src/components/pipeline-playground.tsx` (classes only), `src/components/world-clocks.tsx` (classes only), `src/components/copy-button.tsx` (classes only), `e2e/site.spec.ts`

**Interfaces:**

- Consumes: `Section`, `LinkButton`, `StudBand`, `ArchFrame`, `Door`, `DoorFrame`, `Tags`, `LazyVideo`, `CopyButton`, `WorldClocks`, content exports.
- Produces: no new exports. Section ids unchanged.

- [ ] **Step 1: Write the failing test**

```ts
test("the flagship sits on the blue band with its recording in an arch", async ({
  page,
}) => {
  await page.goto("/");
  const band = page.locator("#project");
  const bg = await band.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgb(23, 99, 182)");
  await expect(band.locator("video")).toHaveAttribute("preload", "none");
  expect(
    await band
      .locator("video")
      .evaluate((el) => getComputedStyle(el.closest("[data-arch]")!).clipPath),
  ).toContain("url(");
});
```

(`ArchFrame` must put `data-arch` on its clipped element; add it in this task if Task 1 did not.)

- [ ] **Step 2: Run to verify it fails.**

- [ ] **Step 3: Restyle each section** to the spec's "Page structure" and the mockup: flagship (`.band`), playground (the `--wall-2` band; results coloured as specified; the table keeps `aria-label="Ledger entries"`), notes, skills, about (`.about`: `ArchFrame ratio={4/5}`, the yellow tag, six facts, clocks), experience (current role with the yellow dot; `#experience li` stays one `li` per role), leadership (adds `leadership.place` as the last sentence), contact (`.knock`: مرحبا kicker with "Marhba · welcome", the title with "Knock." in blue as the `accent`, email + `CopyButton`, the four buttons with "Email me" first, the small yellow `sun` door in a `DoorFrame small`).

- [ ] **Step 4: Run the whole suite** (the about, leadership, copy, playground, recordings and phone tests must pass); lint, format, typecheck. Screenshots of `/` at 1280 (light and dark) and 390 into `shots-site\t4-*.png`; compare with `bab-full.png` and `bab-phone.png`.

- [ ] **Step 5: Commit** `feat: the rest of the home page in Bab: blue flagship band, arches, knock`.

---

### Task 5: Case study, article, 404, changelog, share cards

**Files:**

- Modify: `src/app/work/[slug]/page.tsx`, `src/app/writing/[slug]/page.tsx`, `src/app/not-found.tsx`, `src/app/changelog/page.tsx`, `src/lib/og.tsx`, `src/components/media.tsx`, `src/components/project-visual.tsx`, `src/components/diagram.tsx` (colours only), `e2e/site.spec.ts`

**Interfaces:**

- Consumes: `Door`, `DoorFrame`, `DOOR_PAINTS`, `ArchFrame`, `LinkButton`, `Tags`.
- Produces: the case-study head band: a full-bleed band whose background is `DOOR_PAINTS[project.door.paint].fill`, with "All work", the eyebrow, the `h1` and the summary in a colour that passes AA on that paint (white on blue, green, red, sky and night; ink `#101922` on yellow), and the project's closed door (small) to the right on wide screens.

- [ ] **Step 1: Tests**: add `/work/solvedblue` to the axe loop's paths; add:

```ts
test("a case study opens on a band in its door's colour", async ({ page }) => {
  await page.goto("/work/potluck");
  const band = page.locator("main > header, main > div").first();
  expect(
    await band.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(237, 176, 33)");
});
```

- [ ] **Step 2: Run to verify it fails.**

- [ ] **Step 3: Restyle** the five page types per the spec ("Other pages"): hairlines instead of heavy rules, labels in DM Mono, titles in Alexandria, media in `--wall-2` frames, the 404 with a closed `night` door, the changelog rows in the new type, diagram node borders and beams in `--brand`. Share cards (`og.tsx`): background `#faf9f4`, a 96 px `#1763b6` band on the left with a column of `#10151b` dots, eyebrow in `#1763b6`, title `#101922` heavy, text `#4b5764`; keep the size thresholds and `display: flex` on every multi-child element.

- [ ] **Step 4: Run the whole suite**; lint, format, typecheck. Screenshots of `/work/solvedblue`, `/work/potluck`, an article, `/changelog` and `/no-such-page` at 1280 into `shots-site\t5-*.png`.

- [ ] **Step 5: Commit** `feat: case studies, articles, 404, changelog and share cards in Bab`.

---

### Task 6: Whole-site verification

**Files:**

- Create (outside the repo): `D:\Downloads\Portfolio\docs\redesign2\verification.md`, `D:\Downloads\Portfolio\docs\redesign2\shots-site\final-*.png`
- Modify: only what the checks require.

- [ ] **Step 1:** `pnpm lint && pnpm format:check && pnpm typecheck && CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1`. Record the test count.
- [ ] **Step 2:** Lighthouse 12, mobile, simulated throttling, three runs on `/` and one on `/work/solvedblue` against `next start` on port 3200 (commands as in `D:\Downloads\Portfolio\docs\redesign\verification.md`). Target on `/`: performance ≥ 90 (median), accessibility 100. If performance is below 90: check the font payload first (four families; keep DM Mono and Reem Kufi unpreloaded; drop Alexandria 500 or 700 if unused), then image sizes inside the doors.
- [ ] **Step 3:** Screenshots with `D:\Downloads\Portfolio\docs\redesign\shoot-site.mjs` (copy it and change the output folder to `docs\redesign2\shots-site\` and the tag to `final`): `/`, `/work/solvedblue`, `/work/potluck`, an article, `/changelog` at 1280 light, 1280 dark and 390 light. Also one 1280 shot of `/` with the hero door open and one with the Potluck door hovered.
- [ ] **Step 4:** `verification.md`: commands and results, the Lighthouse table, the screenshot list, every new or changed user-visible sentence (for Jalel's approval), the unused files for him to delete, anything noticed and not changed.
- [ ] **Step 5:** Commit any fixes (`fix: …`). Do not push; the push needs Jalel's GitHub account.
