# Episodes Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Bab skin of jaleldridi.vercel.app with "Episodes": a black, off-white and red site where the home page is one screen showing one project at a time as a title card.

**Architecture:** A reskin in place on branch `redesign/episodes` (from `main`). `src/content.ts` stays the single source of copy and gains an ordered `episodes` list. The home page becomes one client component (the reel) over server-rendered HTML; case studies keep their data and routes under a new template; everything that is not work moves to `/about`.

**Tech Stack:** Next.js 16.3.8 (read `node_modules/next/dist/docs/` before using any API), React 19, Tailwind 4, Playwright with axe. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-24-episodes-redesign-design.md`. Visual reference, to match closely: `D:\Downloads\Portfolio\docs\redesign3\mockups\episodes.html` (open it; screenshots in `D:\Downloads\Portfolio\docs\redesign3\shots\episodes-*.png`).

## Global Constraints

- No approved sentence in `content.ts` changes. New strings are only the ones listed in Task 1 and they live in `content.ts`.
- No logo, name, quote or image from any television show. No "hello, friend", no "fsociety".
- Dark only. Remove the theme switch; `<html>` carries no theme class logic.
- Colours: background `#070707`, text `#ece8e1`, muted text `#9a968f`, hairline `#2a2927`, panel `#0e0e0e`, title red `#e10600` (large type only, 28px or more), small red text and focus ring `#ff4a3d` (passes 4.5:1 on the background).
- Type: Archivo (variable, width axis, weight 900, `font-stretch: 125%`, uppercase) for titles; IBM Plex Mono 400/500/600 for labels and the home page; Onest (already loaded) for long case-study text. Drop Alexandria, DM Mono and Reem Kufi.
- Every animation is off under `prefers-reduced-motion: reduce`. No loader, no enter screen, no scanline overlay, no sound.
- Everything readable and reachable without JavaScript and without hover.
- Files cannot be deleted in this environment. Stop importing what is unused and list those files in the final report.
- Free tiers only, no analytics. Small conventional commits ending with `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`. Do not push.
- Fast check before each commit: `pnpm lint && pnpm format:check && pnpm typecheck`. Full check at the end of each task: add `pnpm build && pnpm test:e2e`.

## Review Focus

1. A phone or tablet has no hover: every episode must be reachable by tap, and the list must not depend on `mouseenter`. Test in Task 2.
2. JavaScript off or slow: the six episode links, the first title and the first sentence are in the server HTML. Test in Task 2.
3. Long names in wide capitals ("Field-inspection platform", "Event Orchestrator", "Payout Ledger") must wrap, not overflow, at 320px. Test in Task 3.
4. Reduced motion: no auto-advance, no decode, no glitch; the first episode is simply shown. Test in Task 2.
5. Keyboard: focus ring visible on black and on stills; arrow keys move the selection only while focus is inside the list, so page scrolling is never hijacked. Test in Task 2.

---

### Task 1: Tokens, fonts, shell and the episode list

**Files:**

- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/components/mobile-nav.tsx`, `src/components/providers.tsx`, `src/content.ts`, `src/lib/og.tsx`
- Create: `public/work/tnpay.png` (copy of `D:\Downloads\Portfolio\docs\redesign3\mockups\img\tnpay.png`, 1440x900)
- Test: `e2e/site.spec.ts`

**Interfaces:**

- Produces, in `src/content.ts`:

```ts
export type EpisodeStatus = "NOW" | "LIVE" | "SHIPPED";
export type Episode = {
  slug: string; // "solvedblue"
  href: string; // "/work/solvedblue"
  file: string; // "eps1.0_solvedblue.ts"
  title: string; // "Solvedblue"
  kind: string; // "Current job"
  year: string;
  line: string; // one sentence
  status: EpisodeStatus;
  still: { src: string; width: number; height: number };
};
export const episodes: Episode[]; // six, in the order below
export const earlierEpisodes: {
  href: string;
  file: string;
  title: string;
  year: string;
}[];
export const ui: {
  play: string;
  back: string;
  next: string;
  earlier: string;
  tagline: string;
};
```

- Order, status, kind, line and still:

| #   | slug          | status  | kind              | line                   | still                          |
| --- | ------------- | ------- | ----------------- | ---------------------- | ------------------------------ |
| 0   | solvedblue    | NOW     | Current job       | its `street.line`      | `/work/solvedblue-home.png`    |
| 1   | payout-ledger | LIVE    | Open source       | `flagship.street.line` | `/payout-ledger.png`           |
| 2   | potluck       | SHIPPED | Founding engineer | its `street.line`      | `/work/potluck-feed.jpg`       |
| 3   | tnpay         | LIVE    | Open source       | its `street.line`      | `/work/tnpay.png`              |
| 4   | kora          | LIVE    | Side project      | its `street.line`      | `/work/kora-chkoun.png`        |
| 5   | deal-grader   | SHIPPED | Offa.com          | its `summary`          | `/work/deal-grader-report.jpg` |

`file` is `eps1.${index}_${slug without hyphens}.ts`. Build the list from `projects` and `flagship` so no sentence is typed twice. `earlierEpisodes` = spyder, inspection-platform, event-orchestrator, numbered `eps0.0` to `eps0.2`.

- `ui` = `{ play: "Play episode", back: "All episodes", next: "Next episode", earlier: "Earlier episodes", tagline: "Founding engineer · Bizerte, Tunisia · open to remote roles" }`.
- `site.version` becomes `"4.0.0"`, with a first changelog entry: date `2026-11-24`, title `Episodes`, items: "One screen, one project at a time: each piece of work is an episode with a title card over a still of the real product.", "Black, off-white and one red; Archivo and IBM Plex Mono.", "About, experience and contact moved to their own page.", "The doors, tiles and light theme are gone."
- Header: left `jalel_dridi.` (the dot in red) linking to `/`; nav `work` → `/`, `about` → `/about`, `cv` → `profile.links.cv`, `contact` → `/about#contact`. Fixed over the home reel, static elsewhere. On phones the same four links stay visible in one row (no menu button).
- Footer: one mono line: `v4.0.0 · changelog · source · last deploy <date>`. Not rendered on `/`.
- `ogCard` keeps its signature; new look: black ground, a red bar 96px wide at the left, off-white text.

- [ ] **Step 1:** In `e2e/site.spec.ts` delete the tests tied to Bab or the theme switch (hero door, project door hover, touch doors ajar, street of five doors, theme switch, Bab typefaces and tiles, Arabic words, the flagship band, the status strip with three clocks, the phone menu button) and add:

```ts
test("the shell is dark, with four header links", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(7, 7, 7)",
  );
  const nav = page.getByRole("navigation", { name: "Site" });
  for (const [name, href] of [
    ["work", "/"],
    ["about", "/about"],
    ["cv", "/Jalel_Dridi_CV.pdf"],
    ["contact", "/about#contact"],
  ])
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      href,
    );
});
test("the changelog lists version 4.0.0, Episodes, first", async ({ page }) => {
  await page.goto("/changelog");
  await expect(page.getByRole("heading", { level: 2 }).first()).toContainText(
    "Episodes",
  );
});
```

(`/about` is created in Task 4; until then point the first test at `/changelog`.)

- [ ] **Step 2:** Run `pnpm build && pnpm test:e2e -g "shell is dark"`; expect a failure on the background colour.
- [ ] **Step 3:** Implement the tokens (keep the shadcn token names, map `--brand` to the small red so existing components keep working), fonts, header, footer, `episodes`, `earlierEpisodes`, `ui`, the changelog entry and `ogCard`.
- [ ] **Step 4:** Fast check, then the two tests pass.
- [ ] **Step 5:** Commit: `feat: Episodes shell, tokens and the episode list`.

### Task 2: The home reel

**Files:**

- Create: `src/components/episodes/reel.tsx` (client), `src/components/episodes/decode.ts`
- Modify: `src/app/page.tsx`, `src/app/globals.css`
- Test: `e2e/site.spec.ts`

**Interfaces:**

- Consumes: `episodes`, `earlierEpisodes`, `ui`, `profile` from Task 1.
- Produces: `export function Reel({ episodes }: { episodes: Episode[] })`; `export function decode(el: HTMLElement, text: string, ms?: number): () => void` (writes scrambled characters that settle into `text` within `ms`, default 300; returns a cancel function; leaves `text` in place when cancelled).

**Behaviour (desktop, 768px and wider):** the first section fills the viewport (`100svh`). Layers back to front: the six stills stacked, only the selected one opaque, each greyscale, dimmed to about half brightness, very slightly blurred, scaling from 1.04 to 1 over 6s; a left-to-right and bottom dark gradient; the card (file · kind · year in mono, the title as `<h2>` in red Archivo, the line, a bordered link with `ui.play`); the list panel at the right (`<nav aria-label="Episodes">`, six links, each `file` left and `status` right, the selected one marked with a red triangle and `aria-current="true"`); a bottom row with `01 / 06`, a thin progress line and `ui.tagline`. The page's `<h1>` is `profile.name`, visually small in the bottom row. Keep the JSON-LD script from the current `page.tsx`.

- Selection changes on pointer enter and on focus of a list link, and with ArrowDown/ArrowUp while focus is inside the list.
- A change is a hard cut: the card plays one 260ms sliced `clip-path` animation and the title decodes.
- Auto-advance every 6s, with the progress line, until the first pointer, key or touch interaction on the page; paused while the tab is hidden; never under reduced motion.
- Clicking a list link or the play link navigates to `episode.href`. If the Next 16 docs in `node_modules/next/dist/docs` describe a supported view-transition option, use it so the still grows into the episode's lead picture; if not, leave navigation plain (Task 3 adds an entry animation).
- Below the reel: a short `ui.earlier` list from `earlierEpisodes` (three mono rows), then nothing else.

**Behaviour (below 768px):** no fixed screen and no list panel. The six episodes are stacked cards, each about `78svh`, with its own still, label, title, line and play link; no auto-advance, no decode on scroll.

- [ ] **Step 1:** Write these tests:

```ts
test("the home page is one episode at a time, starting with Solvedblue", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Mohamed Jalel Dridi" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Solvedblue" }),
  ).toBeVisible();
  const list = page.getByRole("navigation", { name: "Episodes" });
  await expect(list.getByRole("link")).toHaveCount(6);
  await expect(
    list.getByRole("link", { name: /eps1\.1_payoutledger\.ts/ }),
  ).toHaveAttribute("href", "/work/payout-ledger");
});
test("pointing at or focusing an episode selects it", async ({ page }) => {
  await page.goto("/");
  const list = page.getByRole("navigation", { name: "Episodes" });
  await list.getByRole("link", { name: /potluck/ }).hover();
  await expect(
    page.getByRole("heading", { level: 2, name: "Potluck" }),
  ).toBeVisible();
  await list.getByRole("link", { name: /kora/ }).focus();
  await expect(
    page.getByRole("heading", { level: 2, name: "Kora" }),
  ).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("heading", { level: 2, name: "Deal Grader" }),
  ).toBeVisible();
});
test("without JavaScript the six episodes are still links", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Episodes" }).getByRole("link"),
  ).toHaveCount(6);
  await expect(
    page.getByRole("heading", { level: 2, name: "Solvedblue" }),
  ).toBeVisible();
  await context.close();
});
test("with motion reduced the reel does not advance on its own", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(7000);
  await expect(
    page.getByRole("heading", { level: 2, name: "Solvedblue" }),
  ).toBeVisible();
});
test("left alone, the reel moves to the next episode", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 2, name: "Payout Ledger" }),
  ).toBeVisible({ timeout: 9000 });
});
test("on a phone every episode is a card with its own link", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Play episode" })).toHaveCount(6);
  await page
    .getByRole("heading", { level: 2, name: "Kora" })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { level: 2, name: "Kora" }),
  ).toBeVisible();
  await context.close();
});
```

Update the kept tests "every link has a destination", "fits a phone screen without horizontal scrolling", the axe test (paths `/`, `/about`, one `/work/...`; dark only) and the JSON-LD test to the new page.

- [ ] **Step 2:** Build and run; expect failures on the level-2 heading and the Episodes navigation.
- [ ] **Step 3:** Implement `decode`, `Reel`, the CSS keyframes and `page.tsx`. One markup serves both widths where possible; if the phone cards need their own markup, hide the unused variant with `hidden`/`md:` classes so each width exposes each heading once to assistive technology.
- [ ] **Step 4:** Full check passes.
- [ ] **Step 5:** Commit: `feat: the home page is a reel of episodes`.

### Task 3: Episode pages

**Files:**

- Modify: `src/app/work/[slug]/page.tsx`, `src/components/media.tsx`, `src/components/browser-frame.tsx`, `src/components/diagram.tsx`, `src/components/project-visual.tsx`, `src/components/tags.tsx`, `src/components/link-button.tsx`, `src/components/pipeline-playground.tsx`, `src/app/sitemap.ts`, `src/app/not-found.tsx`, `src/app/changelog/page.tsx`, `src/app/writing/[slug]/page.tsx`
- Create: `src/app/work/payout-ledger/page.tsx`, `src/app/work/payout-ledger/opengraph-image.tsx`, `src/components/episodes/episode-head.tsx`
- Test: `e2e/site.spec.ts`

**Interfaces:**

- Produces: `export function EpisodeHead({ file, title, summary, facts, children }: { file: string; title: string; summary: string; facts: { label: string; value: ReactNode }[]; children: ReactNode })`: a back link (`ui.back`, to `/`), the file name in mono, the title as `<h1>` in red Archivo with `overflow-wrap: anywhere` and `text-wrap: balance`, the summary, the facts as a `<dl>` under hairlines, and `children` (the lead picture) in the right column; one column below 900px. The whole head plays one 0.5s top-to-bottom `clip-path` wipe on mount.
- Case-study template: `EpisodeHead` with facts `role` (company · year), `stack`, `links`; then the existing sections unchanged in content (why, built, parts with their diagrams, outcome, note, gallery) in a single readable column set in Onest, labels in mono; screenshots and recordings in full colour inside a thin-bordered dark frame whose bar shows the address; at the end a `ui.next` link to the following episode (order: `episodes`, then `earlierEpisodes`, wrapping to the first).
- `/work/payout-ledger`: `EpisodeHead` from `flagship` (name, summary, stack, the three links "Try the live demo", "Read the code", "Design decisions"), the recording as lead, the four `flagship.points`, then the pipeline playground with its existing heading and behaviour, then the two articles from `src/writing.ts` as links. Metadata and share card follow the pattern of `[slug]`.
- Remove every import of `@/components/motifs` and `@/lib/motifs` from `src/app`.

- [ ] **Step 1:** Tests:

```ts
test("an episode page opens with its file name, title and a way back", async ({
  page,
}) => {
  await page.goto("/work/potluck");
  await expect(
    page.getByRole("heading", { level: 1, name: "Potluck" }),
  ).toBeVisible();
  await expect(page.getByText("eps1.2_potluck.ts")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "All episodes" }),
  ).toHaveAttribute("href", "/");
  await expect(
    page.getByRole("link", { name: /Next episode/ }),
  ).toHaveAttribute("href", "/work/tnpay");
});
test("Payout Ledger is an episode with the demo, the code and the playground", async ({
  page,
}) => {
  await page.goto("/work/payout-ledger");
  await expect(
    page.getByRole("heading", { level: 1, name: "Payout Ledger" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Try the live demo" }),
  ).toHaveAttribute("href", "https://payout-ledger-gamma.vercel.app");
  await expect(
    page.getByRole("link", { name: "Read the code" }),
  ).toHaveAttribute("href", "https://github.com/JalelDridi/payout-ledger");
});
test("long titles wrap on the narrowest phone", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 320, height: 640 },
  });
  const page = await context.newPage();
  for (const path of [
    "/work/inspection-platform",
    "/work/event-orchestrator",
    "/work/payout-ledger",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await context.close();
});
```

Move the pipeline playground tests to `/work/payout-ledger`. Keep and adapt: the Potluck redirects, Kora and Solvedblue case studies, the 404s, the shared-card metadata test, recordings waiting until near the screen, the article test (reached from `/work/payout-ledger`).

- [ ] **Step 2:** Build and run; expect failures.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Full check passes.
- [ ] **Step 5:** Commit: `feat: case studies and Payout Ledger as episode pages`.

### Task 4: The about page, cleanup and the final check

**Files:**

- Create: `src/app/about/page.tsx`
- Modify: `src/components/sections/about.tsx`, `experience.tsx`, `skills.tsx`, `leadership.tsx`, `contact.tsx`, `writing.tsx`, `src/components/section.tsx`, `src/app/sitemap.ts`, `README.md`, `CLAUDE.md` (layout section only), `e2e/site.spec.ts`

**Interfaces:**

- `/about` renders, in order: About (portrait in full colour, the three paragraphs, the facts, the four clocks), Experience, Skills, Leadership, Notes (the articles), Contact (`id="contact"`). Section heads become: a mono label and a title in Archivo at a moderate size (not red; red is for episode titles). No Arabic words, no door icons, no tile bands. Metadata: title `About`, canonical `/about`.

- [ ] **Step 1:** Tests: point the kept About, Leadership, clocks, copy-button and local-time tests at `/about`; point the shell test from Task 1 at `/about`; add `/about` to the phone-width and axe tests.
- [ ] **Step 2:** Build and run; expect failures (no `/about`).
- [ ] **Step 3:** Implement. Then remove every remaining import of a Bab-only component and list the now-unused files.
- [ ] **Step 4:** Full check passes: `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build && pnpm test:e2e`.
- [ ] **Step 5:** Run Lighthouse on `/` (mobile) against the production build as the earlier redesigns did (`D:\Downloads\Portfolio\lh-slow.sh` shows how); targets: performance 90 or more, accessibility 100. Report the numbers; fix what is cheap (image `sizes`, `priority` only on the first still).
- [ ] **Step 6:** Commit: `feat: about page; retire the Bab sections`.

## Final report from the implementer

Commits, the full-check output summary, Lighthouse numbers, the list of unused files for Jalel to delete, every new user-visible string, and anything that differs from this plan with the reason.
