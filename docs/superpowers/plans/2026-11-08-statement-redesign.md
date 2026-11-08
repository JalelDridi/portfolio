# Statement Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle jaleldridi.vercel.app as the "Statement" design (ruled grid, Bricolage Grotesque, IBM Plex, one cobalt accent, a ledger instead of counters) and restructure its content (one Potluck case study, Kora added, a changelog, a status strip) with every Playwright test green.

**Architecture:** Tokens and fonts change once in `globals.css` and `layout.tsx`; every section component is rewritten against the new `Section` head and the shared `LinkButton`, `Tags` and `BrowserFrame`; three small client components carry the interactive bits (clocks, copy button, work table). The pipeline simulation is unchanged; only its rendering becomes a ledger table. Content changes live in `content.ts`; old slugs redirect in `next.config.ts`.

**Tech Stack:** Next.js 16 (App Router, static), React 19, Tailwind 4, next-themes, `next/font/google`, Playwright 1.63 with axe.

**Spec:** `docs/superpowers/specs/2026-11-08-statement-redesign-design.md` (read it first; the mockup it was built from is `D:\Downloads\Portfolio\docs\redesign\mockups\statement.html`).

## Global Constraints

- Read `node_modules/next/dist/docs/` for anything you touch in `src/app` (this Next.js differs from training data).
- Fonts: Bricolage Grotesque (display, axes `opsz`, `wdth`), IBM Plex Sans 400/500/600 (text), IBM Plex Mono 400/500 (data, `preload: false`). No Geist anywhere.
- `html` stays at `font-size: 106.25%`. Labels are at least `0.85rem`.
- `--radius: 0`. Only the phone frame in `media.tsx` keeps a radius.
- Do not import `border-beam`, `number-ticker`, `marquee`, `blur-fade` anywhere. Do not delete files under `src/components/ui/` (deletion is blocked); list them in the final report for Jalel.
- Accessible names the tests rely on must survive: h1 "Mohamed Jalel Dridi"; buttons "Send a webhook", "Send it twice", "Send out of order", "Switch between light and dark theme", "Open the menu"; links "Try the live demo", "Read the code", "All work", "All writing", "Back to the home page"; headings "What I built"; nav `aria-label="Sections"` visible once at phone width; `#project video`; four `HH:MM` texts inside `#about`; `#leadership ol li` in role order.
- New copy is limited to what this plan quotes verbatim. Everything else is moved, not rewritten.
- Before every commit: `pnpm lint && pnpm format:check && pnpm typecheck` (run `pnpm format` first if the format check fails). When a task's steps say to run Playwright, build first: `CIRCLE_NODE_TOTAL=2 pnpm build`, then `pnpm exec playwright test --workers=1 -g "<pattern>"`. The last step of every task runs the whole suite.
- Commits: small, conventional, ending with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Branch: `redesign/statement`.

## Review Focus

1. JavaScript disabled or slow: the account summary's numbers must be in the HTML. Pinned in Task 2 (test with `javaScriptEnabled: false`).
2. `prefers-reduced-motion: reduce`: the hero's page-load sequence must leave everything visible at full opacity. Pinned in Task 1.
3. A 340 px phone: the ledger book table and the work table must not widen the page. Pinned by the existing "fits a phone screen" test, which Task 3 and Task 4 run.
4. Old shared links to `/work/payments`, `/work/potluck-live`, `/work/messaging`, `/work/infrastructure` must still land somewhere. Pinned in Task 7 (redirect test).
5. Dark theme contrast of cobalt on navy and of muted text on the dark card. Pinned by the axe suite, which Task 6 runs on three pages in both themes and Task 8 extends to `/changelog`.

---

### Task 1: Foundations: fonts, tokens, shared components, header and status strip

**Files:**

- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/section.tsx`, `src/components/link-button.tsx`, `src/components/tags.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/components/theme-toggle.tsx`, `src/components/mobile-nav.tsx`, `src/components/reveal.tsx`, `src/content.ts`
- Create: `src/components/status-clocks.tsx`
- Test: `e2e/site.spec.ts`

**Interfaces:**

- Produces: CSS tokens `--brand`, `--debit`, `--font-display`, `--font-sans`, `--font-mono`; Tailwind utilities `font-display`, `text-brand`, `text-debit`, `border-debit`; `Section({ id, eyebrow, title, description?, children })` unchanged signature, new look; `LinkButton({ href, variant?: "primary" | "outline" | "brand", children, className?, "aria-label"? })`; `Tags({ items })`; `StatusClocks({ zones: { city: string; zone: string }[] })` client component rendering `<span>` per city with the time as `HH:MM`; `site` export in `content.ts`: `{ version: "3.0.0", repo: "https://github.com/JalelDridi/portfolio" }`; `Reveal` becomes a passthrough (`<div className>` when a className is given, else a fragment) so untouched sections still compile.

- [ ] **Step 1: Write the failing tests** in `e2e/site.spec.ts`

```ts
test("the status strip shows three live clocks, the site version and the deploy date", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByText(/^\d{2}:\d{2}$/)).toHaveCount(3);
  await expect(footer).toContainText(/Site v\d+\.\d+\.\d+/);
  await expect(footer).toContainText(/Last deploy \d{1,2} \w{3} \d{4}/);
  await expect(footer).not.toContainText("Built with");
});

test("with motion reduced the hero is visible at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const h1 = page.getByRole("heading", {
    level: 1,
    name: "Mohamed Jalel Dridi",
  });
  await expect(h1).toBeVisible();
  expect(
    await h1.evaluate((el) => getComputedStyle(el.parentElement!).opacity),
  ).toBe("1");
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1 -g "status strip|motion reduced"`
Expected: FAIL (the footer has no clocks or version; the second may pass already, keep it).

- [ ] **Step 3: Fonts and tokens**

In `src/app/layout.tsx` replace Geist with `Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-display" })`, `IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-sans" })`, `IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", preload: false })`; put all three variables on `<html>`.

In `src/app/globals.css`: set the light and dark tokens from the spec's table (all of `--background`, `--card`, `--foreground`, `--muted-foreground`, `--border`, `--brand`, `--debit`, derived shadcn tokens, `--radius: 0`); remove `--brand-bright`, `--brand-2`, the marquee keyframes and animations, the `bg-dots` and `text-gradient` utilities; in `@theme inline` map `--font-sans: var(--font-plex-sans)`, `--font-mono: var(--font-plex-mono)`, `--font-display: var(--font-display)`, `--color-brand`, `--color-debit`; add `@keyframes draw { from { transform: scaleX(0) } to { transform: scaleX(1) } }` and `--animate-draw: draw .7s cubic-bezier(.2,.7,.2,1) both`; keep the reduced-motion block and the 106.25 % root size; set `::selection` to a 25 % brand tint.

- [ ] **Step 4: Shared components**

`section.tsx`: the two-column head from the spec (`lg:grid-cols-[10rem_1fr]`, `border-t-2 border-foreground pt-3`), eyebrow in `font-mono text-[0.85rem] uppercase tracking-[0.08em] text-muted-foreground`, title in `font-display font-bold text-[clamp(2rem,4.2vw,3.2rem)] leading-none tracking-[-0.025em] text-balance`, description `text-[1.15rem] text-muted-foreground max-w-3xl`, children after `mt-8 sm:mt-10`; keep `aria-labelledby`.
`link-button.tsx`: square (`h-11 px-5 border text-base font-medium`), `primary` = `border-foreground bg-foreground text-background hover:bg-brand hover:border-brand`, `outline` = `border-foreground bg-transparent hover:bg-foreground hover:text-background`, `brand` = `border-brand text-brand hover:bg-brand hover:text-background`; keep `[&_svg]:size-4`.
`tags.tsx`: `font-mono text-[0.85rem]` square chips with `border-border`.
`theme-toggle.tsx` and the `mobile-nav.tsx` button: `size-10 border border-foreground` squares, no `rounded-full`; the phone nav panel loses `animate-in`.
`reveal.tsx`: passthrough as in Interfaces; remove the BlurFade import.
`content.ts`: add `export const site = { version: "3.0.0", repo: "https://github.com/JalelDridi/portfolio" };`.

- [ ] **Step 5: Header and status strip**

`site-header.tsx`: `sticky top-0 z-50 border-b border-foreground bg-background`, `h-14`, name in `font-display font-semibold text-lg`, NAV = Flagship `/#project`, Work `/#work`, Notes `/#writing`, About `/#about`, Experience `/#experience`, Contact `/#contact`; desktop links `font-sans text-base hover:text-brand`; right side: `ThemeToggle` then `MobileNav items={NAV}`. Remove the contact pill.
`status-clocks.tsx` (`"use client"`): `useEffect` ticking every 30 s; render `--:--` before the first tick; `Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" })`.
`site-footer.tsx`: `<footer className="border-t border-foreground">` with a mono `text-[0.85rem]` flex-wrap row: `<StatusClocks zones=[Bizerte Africa/Tunis, New York America/New_York, San Francisco America/Los_Angeles] />`, `Site v{site.version}`, `Last deploy {BUILT}` where `const BUILT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date())` at module scope (evaluated at build), and a link "Source on GitHub" to `site.repo`.

- [ ] **Step 6: Run the two tests, then lint, format and types**

Run: `CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1 -g "status strip|motion reduced|theme switch|menu button"`
Expected: PASS. Then `pnpm lint && pnpm format:check && pnpm typecheck` clean.

- [ ] **Step 7: Commit**

```bash
git add -A src e2e
git commit -m "feat: statement foundations: Bricolage and Plex, paper tokens, square controls, status strip"
```

---

### Task 2: Hero with the account summary

**Files:**

- Modify: `src/content.ts`, `src/components/sections/hero.tsx`, `src/app/page.tsx`
- Rename: `git mv src/components/sections/metrics.tsx src/components/account-summary.tsx` and rewrite it
- Test: `e2e/site.spec.ts`

**Interfaces:**

- Consumes: `Rise`, `LinkButton`, `LocalTime`, icons, tokens from Task 1.
- Produces: `ledger` export in `content.ts`: `{ title: "Account summary", asOf: "as of today", rows: { name: string; detail: string; value: string; href?: string }[], total: { label: string; value: string } }`; `AccountSummary()` server component rendering `<ul aria-label="Account summary">`; `metrics` export removed.

- [ ] **Step 1: Write the failing test**

```ts
test("the account summary is in the HTML with its numbers before any JavaScript runs", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const summary = page.getByRole("list", { name: "Account summary" });
  await expect(summary).toContainText("99 tests · 8 design records");
  await expect(summary).toContainText(
    "14,000+ messages a week · 99.99% delivered",
  );
  await expect(summary).toContainText("Open to remote roles");
  await expect(page.locator("body")).not.toContainText(/(^|\s)0\+|(^|\s)0%/);
  await context.close();
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec playwright test --workers=1 -g "account summary"` (reuse the Task 1 build; rebuild if `src` changed)
Expected: FAIL, no list named "Account summary".

- [ ] **Step 3: Content**

In `content.ts` remove `metrics` and add `ledger` with exactly these rows:

| name          | detail                                                      | value                                      | href                                |
| ------------- | ----------------------------------------------------------- | ------------------------------------------ | ----------------------------------- |
| Payout Ledger | Open-source payout monitor with a live demo                 | 99 tests · 8 design records                | flagship.repo                       |
| tnpay         | Typed SDKs for Tunisia's payment gateways                   | 3 packages on npm · 75 tests               | https://github.com/JalelDridi/tnpay |
| Kora          | Daily football puzzle in Arabic, French and English         | live every day since 6 Oct 2026            | https://kora-tn.vercel.app          |
| Spyder        | Multi-provider messaging platform at Offa.com               | 14,000+ messages a week · 99.99% delivered | /work/spyder                        |
| Potluck       | Stripe Connect payments stack and production infrastructure | owned since Jun 2026                       | https://www.bigpotluck.com          |

`total: { label: profile.availability, value: "Bizerte · UTC+1" }`.

- [ ] **Step 4: `AccountSummary` and the hero**

`account-summary.tsx`: `<div className="border-t-2 border-foreground">`, a caption row (`ledger.title` left, `ledger.asOf` right, both label style, `border-b border-border`), `<ul aria-label={ledger.title}>` with `li` rows `grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 py-3 border-b border-border items-baseline`: name `font-medium` (a link when `href`), detail `text-muted-foreground text-[0.95rem]` under it, value `font-mono text-[0.95rem] sm:text-right` with every run of `/\d[\d,.%+]*/` wrapped in `<span className="text-brand">` (write `highlightNumbers(value: string): ReactNode[]` in the same file); the total row `flex justify-between py-3 border-b-2 border-foreground font-semibold` with the value in `font-mono text-brand`. Give the top rule `animate-draw origin-left`.

`hero.tsx`: `grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 items-start`, `max-w-6xl px-5 pt-10 pb-6 sm:pt-14`. Left column (each block in `Rise` with delays 0, 80, 160, 240): `<h1 aria-label={profile.name} className="font-display font-extrabold text-[clamp(3.4rem,8.4vw,7.6rem)] leading-[0.86] tracking-[-0.035em] [font-variation-settings:'opsz'_96,'wdth'_88]">` with three `<span className="block">` lines, the last `font-light`; lede `<p className="text-[1.55rem] leading-tight tracking-[-0.01em]"><b className="font-semibold">Founding Engineer at Potluck.</b> {profile.headline}.</p>`; `profile.intro` in `text-[1.15rem] text-muted-foreground max-w-xl`; the facts list and the location with `<LocalTime />` as today, minus the dot bullets (use a mono "·" prefix); buttons See the work (`primary`, `#work`), Email me, CV, GitHub and LinkedIn icon links with their aria-labels. Right column: `<Rise delay={320}><AccountSummary /></Rise>`. Remove the glow, the dot grid, the pill, the gradient and the playground (Task 3 gives it a band).

`page.tsx`: drop `<Metrics />`.

- [ ] **Step 5: Run the tests**

Run: `CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1 -g "account summary|who I am|local time|motion reduced"`
Expected: PASS. Lint, format, typecheck clean.

- [ ] **Step 6: Commit**

```bash
git add -A src e2e
git commit -m "feat: hero with an account summary instead of counting metrics"
```

---

### Task 3: The playground as a ledger book

**Files:**

- Modify: `src/lib/pipeline-sim.ts` (add `event` to `Step`), `src/components/pipeline-playground.tsx`, `src/app/page.tsx`
- Create: `src/components/sections/playground.tsx`
- Test: `e2e/site.spec.ts`

**Interfaces:**

- Consumes: `play`, `SCENARIOS`, `initialState`, `formatCents` from `pipeline-sim.ts`; `LinkButton`; `flagship` from content.
- Produces: `Step` gains `event: string` (the event ID the step is about, e.g. `evt_001`); `Playground()` server section with `id="playground"`; `PipelinePlayground()` client component rendering the buttons, the `role="status"` line, `<table aria-label="Ledger entries">` and the totals `<dl>`.

- [ ] **Step 1: Write the failing test** (inside the existing `the pipeline playground` describe)

```ts
test("each step posts an entry in the ledger book", async ({ page }) => {
  await page.getByRole("button", { name: "Send it twice" }).click();
  const rows = page
    .getByRole("table", { name: "Ledger entries" })
    .locator("tbody tr");
  await expect(rows).toHaveCount(5);
  await expect(rows.last()).toContainText("evt_001");
  await expect(rows.last()).toContainText("skipped");
  await expect(rows.nth(2)).toContainText("$25.00");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec playwright test --workers=1 -g "ledger book"`
Expected: FAIL, no table named "Ledger entries".

- [ ] **Step 3: `event` on every step**

In `pipeline-sim.ts` add `event: string` to `Step`; in `play`, make the inner `step()` helper take the event ID as its first argument and pass `id`, `payout` or `transfer` at each call (the step that applies a payout refers to the payout's ID; the steps that store or apply a transfer refer to the transfer's). Texts and counters do not change.

- [ ] **Step 4: Render the book**

`pipeline-playground.tsx`: keep `run`, `busy`, `useReducedMotion` and the pacing; add `const [entries, setEntries] = useState<Step[]>([])`, appending each step as it plays and keeping the last 12. Render:

- `<table aria-label="Ledger entries" className="w-full border-t-2 border-foreground font-mono text-[0.9rem]">` with `<thead>` (label style) Stage (`hidden sm:table-cell`), Event, Entry, Owed to seller (right-aligned, `tabular-nums`), Result; `<tbody>` one `tr` per entry with `border-b border-border` and `align-baseline`; Result text by tone: `ok` → "applied" when `after.applied` grew or `after.balance` changed, else "stored" when `after.stored` grew, else "ok"; `skip` → "skipped" in `text-muted-foreground`; `wait` → "held" in `text-debit`. With no entries, one row spanning the columns: "No entries yet. Press a button to send the pipeline a webhook."
- Under it the totals `<dl className="grid grid-cols-3 border-b-2 border-foreground py-3">` with `<dt>` Stored, Applied, Owed to seller (label style) immediately followed by `<dd className="font-mono text-xl tabular-nums">` (no whitespace between `dt` and `dd`).
- The `role="status"` paragraph keeps its initial text "Press a button to send the pipeline a webhook." and the live messages; style `font-mono text-[0.9rem] min-h-[3.25rem]`.
- The three buttons: square (`h-11 px-4 border border-foreground font-sans text-base font-medium hover:bg-brand hover:border-brand hover:text-background disabled:opacity-50`), the first one `border-brand text-brand`.
  Export the pieces so the section can lay them out: simplest is one component with the prop `layout` omitted and the component rendering a two-column grid itself: left `lg:w-[22rem]` block with the buttons and the status; right the table and totals.

`sections/playground.tsx`: `<section id="playground" aria-labelledby="playground-title" className="border-y border-foreground">` with an inner `max-w-6xl px-5 py-12 sm:py-16` grid `lg:grid-cols-[0.8fr_1.2fr] gap-10`: left: eyebrow "Try it", `<h2 id="playground-title">` "Break my pipeline." in the section title style, the sentence "A small model of Payout Ledger, my open-source payout monitor. Send it the webhooks that break payment systems and watch the ledger take only what it should.", then the playground's buttons and status; right: the table and totals; under the table a link "Open the real demo" to `flagship.demo`. (Pass `slots` or render `PipelinePlayground` once with the two-column layout inside it; either is fine as long as the DOM order is buttons, status, table, totals.)

`page.tsx`: `<Playground />` right after `<Hero />`.

- [ ] **Step 5: Run the playground tests and the phone test**

Run: `CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1 -g "pipeline playground|phone screen"`
Expected: all PASS, including the three existing playground tests. Lint, format, typecheck clean.

- [ ] **Step 6: Commit**

```bash
git add -A src e2e
git commit -m "feat: the pipeline playground posts its steps into a ledger book"
```

---

### Task 4: Flagship, the work table and notes

**Files:**

- Modify: `src/components/sections/flagship.tsx`, `src/components/sections/work.tsx`, `src/components/sections/writing.tsx`, `src/components/browser-frame.tsx`, `src/components/project-visual.tsx`
- Create: `src/components/work-table.tsx`, `src/lib/dates.ts`
- Test: `e2e/site.spec.ts`

**Interfaces:**

- Consumes: `Section`, `LinkButton`, `Tags`, `LazyVideo`, `DiagramPanel`, `projects`, `flagship`, `articles`.
- Produces: `BrowserFrame({ url, note?, children, className? })` (square, `border-foreground`, bar with `url` left and `note` right in mono); `formatShortDate(iso: string): string` → "2 Oct 2026"; `WorkTable({ rows: { slug; title; company; year; summary; url?: string; earlier?: boolean }[], previews: Record<string, ReactNode> })` client component; `PreviewVisual({ project })` server component (cover or image via `next/image` with `sizes="(min-width: 1024px) 480px, 1px"` and `className="aspect-[4/3] w-full object-cover object-top"`, else `DiagramPanel size="card"`). `DiagramPanel` loses the dotted background.

- [ ] **Step 1: Write the failing test**

```ts
test("hovering a work row changes the preview", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const preview = page.locator("#work [data-preview]");
  await expect(preview).toHaveAttribute("data-preview", "tnpay");
  await page.getByRole("link", { name: "Deal Grader", exact: true }).hover();
  await expect(preview).toHaveAttribute("data-preview", "deal-grader");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec playwright test --workers=1 -g "changes the preview"`
Expected: FAIL.

- [ ] **Step 3: Flagship**

`flagship.tsx`: `Section` as today; grid `lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start`; left: `<BrowserFrame url="payout-ledger-gamma.vercel.app" note="screen recording">` around the unchanged `LazyVideo`, caption `text-[0.95rem] text-muted-foreground mt-3`; right: `<dl className="border-t border-border">` with a `div` per point (`grid grid-cols-[1.6rem_1fr] py-3.5 border-b border-border`): `<dt>` letters a, b, c, d in `font-mono text-brand text-[0.85rem]`, `<dd>` with `<b className="block font-semibold text-[1.1rem]">{title}</b><span className="text-muted-foreground">{text}</span>`; then `Tags` and the three buttons (Try the live demo `primary`, Read the code, Design decisions). No `BorderBeam`, no `Reveal`.

- [ ] **Step 4: Work table**

`work-table.tsx` (`"use client"`): `const [active, setActive] = useState(rows[0].slug)`; `<div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">`; `<ol className="border-t-2 border-foreground">`; before the first `earlier` row, an `li aria-hidden` divider with the label "Earlier" (label style, `py-2 border-b border-border`); each row `<li className="relative border-b border-border">` containing `<Link href={`/work/${slug}`} onMouseEnter onFocus={() => setActive(slug)} className="grid grid-cols-[3.4rem_1fr_1.4rem] sm:grid-cols-[3.4rem_1fr_1.2fr_1.4rem] gap-4 py-4 items-baseline hover:text-brand focus-visible:text-brand">`: year `font-mono text-[0.85rem] text-muted-foreground`; a block with `<h3 className="font-display font-bold text-2xl tracking-[-0.02em]">{title}</h3>` and under it `<p className="text-[0.92rem] text-muted-foreground">{company} · {year}</p>` (the `p` outside the `h3`, so the heading's name is the title alone); summary `text-muted-foreground sm:col-auto col-start-2`; an arrow `→` right-aligned. Rows with `earlier` use `text-xl` for the title. Right: `<div data-preview={active} aria-hidden="true" className="sticky top-20 hidden lg:block"><BrowserFrame url={rows.find(active).url ?? "private work, drawn as a diagram"}>{previews[active]}</BrowserFrame><p className="font-mono text-[0.85rem] text-muted-foreground mt-2">Hover a row to preview it. Real screenshots and recordings of public pages; private work is drawn as a diagram.</p></div>`.

`work.tsx`: `Section id="work" eyebrow="Work" title="Built and shipped"` with the existing description; `rows` from `projects` (`url` = `project.cover?.url ?? (project.links[0] ? new URL(project.links[0].href).hostname : undefined)`), `previews` = `Object.fromEntries(projects.map((p) => [p.slug, <PreviewVisual key={p.slug} project={p} />]))`.

`project-visual.tsx`: remove the `bg-dots` div; add `PreviewVisual`; keep `DiagramPanel`; delete the `CardVisual` function (nothing uses it after this task).

`browser-frame.tsx`: `border border-foreground bg-card` square, bar `flex justify-between px-3 py-2 border-b border-border font-mono text-[0.8rem] text-muted-foreground`, left `url`, right `note` when given. Drop the three dots and the shadow.

- [ ] **Step 5: Notes**

`lib/dates.ts`: `formatShortDate` with `Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })`.
`writing.tsx`: `Section id="writing" eyebrow="Notes" title="Decisions, explained"` with the existing description; `<ol className="border-t-2 border-foreground">`, each `<li className="relative grid grid-cols-1 sm:grid-cols-[9rem_1fr_auto] gap-x-5 gap-y-1 py-4 border-b border-border items-baseline">`: `<time>` in mono muted with `formatShortDate(article.date)`; `<h3 className="font-display font-bold text-2xl tracking-[-0.02em]"><Link href className="after:absolute after:inset-0 hover:text-brand">{title}</Link></h3>` with the summary under it in `text-muted-foreground`; `{minutes} min` in mono muted.

- [ ] **Step 6: Run the tests**

Run: `CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1 -g "changes the preview|who I am|opens its case study|article opens|recordings wait|phone screen|every link"`
Expected: PASS. Lint, format, typecheck clean.

- [ ] **Step 7: Commit**

```bash
git add -A src e2e
git commit -m "feat: flagship frame, work as a table with hover previews, notes as dated rows"
```

---

### Task 5: Skills, About with "Working with me", Experience, Leadership, Contact

**Files:**

- Modify: `src/components/sections/skills.tsx`, `src/components/sections/about.tsx`, `src/components/sections/experience.tsx`, `src/components/sections/leadership.tsx`, `src/components/sections/contact.tsx`, `src/components/world-clocks.tsx` (container classes only), `src/content.ts`
- Create: `src/components/copy-button.tsx`
- Test: `e2e/site.spec.ts`

**Interfaces:**

- Consumes: `Section`, `LinkButton`, `WorldClocks`, `about`, `skills`, `experience`, `education`, `leadership`, `profile`.
- Produces: `about.facts` gains `{ label: "Hours", value: "Flexible: I adapt to the team's time zone." }` and `{ label: "Hiring setup", value: "Contractor or employer of record; no visa sponsorship needed." }` after the existing four; `about.figure = { label: "fig. 1 · Bizerte", coordinates: "37°16′N 9°52′E" }`; `CopyButton({ text, label?: string })` client component: a `<button>` named "Copy email" (or `label`) that writes `text` to the clipboard and reads "Copied" for two seconds, with `aria-live="polite"`.

- [ ] **Step 1: Write the failing test**

```ts
test("the copy button puts the email on the clipboard", async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "med.jalel.dridi@gmail.com",
  );
  await context.close();
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec playwright test --workers=1 -g "copy button"`
Expected: FAIL, no button "Copy email".

- [ ] **Step 3: Skills, Experience, Leadership**

`skills.tsx`: `Section id="skills"` as today; `<dl className="border-t-2 border-foreground">` with a `div` per group (`grid sm:grid-cols-[10rem_1fr] gap-x-6 py-3.5 border-b border-border`): `<dt>` label style, `<dd className="text-[1.1rem]">{items.join(" · ")}</dd>`. No marquee, no cards.
`experience.tsx`: `<ol className="border-t-2 border-foreground">`, each `li` `grid sm:grid-cols-[9rem_1fr] gap-x-6 py-5 border-b border-border`: period in mono muted; then `<h3 className="font-display font-bold text-2xl tracking-[-0.02em]">{role} <span className="text-muted-foreground">·</span> {company link as today}</h3>`, detail in muted, summary `text-[1.1rem] max-w-2xl`. Education paragraph after the list.
`leadership.tsx`: `Section id="leadership" title description={leadership.intro}`; grid `lg:grid-cols-2 gap-10`; left: `<ol className="flex flex-wrap gap-x-6 gap-y-2 text-[1.1rem]">` with `<li><span className="font-mono text-[0.85rem] text-muted-foreground">{year}</span> {role}</li>` for the three roles in order (the last one `font-semibold`), then the chapter link (underlined, `hover:text-brand`); right: `leadership.bridge`, one sentence "In 2026 the chapter ran " + `activity.items` joined with ", " (lower-case the first letter of each item) + ".", and one line per `also` entry "{role} · {organisation}". No cards, no ping.

- [ ] **Step 4: About and Contact**

`content.ts`: add the two facts and `about.figure` as in Interfaces.
`about.tsx`: `Section id="about" title={about.title}`; grid `lg:grid-cols-[0.7fr_1.3fr] gap-10 items-start`; `<figure>` with the square `Image` (keep `alt`, `sizes`) inside `border border-foreground` and `<figcaption className="font-mono text-[0.85rem] text-muted-foreground mt-2 flex justify-between"><span>{figure.label}</span><span>{figure.coordinates}</span></figcaption>`; right: the paragraphs (first `text-[1.45rem] leading-snug`, rest `text-[1.15rem]`), then `<dl className="grid sm:grid-cols-3 gap-x-5 gap-y-4 border-t border-border pt-4">` over all six facts (`dt` label style, `dd font-medium`), then the clocks in `border-y border-border py-5` with the caption. No `BorderBeam`.
`copy-button.tsx` (`"use client"`): `navigator.clipboard.writeText(text)` in the click handler, catch and ignore failure, label state "Copy email" / "Copied"; `className="font-mono text-[0.85rem] border border-border px-2 py-0.5 hover:border-brand hover:text-brand"`.
`contact.tsx`: `<section id="contact" aria-labelledby="contact-title" className="max-w-6xl mx-auto px-5 py-16 sm:py-20">` with `grid lg:grid-cols-2 gap-8 border-t-2 border-foreground pt-6 items-end`; left: eyebrow "Contact" and `<h2 id="contact-title">` "Hiring for payments or full-stack TypeScript?" in `font-display font-bold text-[clamp(2.2rem,5vw,4rem)] leading-none tracking-[-0.03em]`; right: "I am open to remote roles. Email is the quickest way to reach me." in muted, then `<span className="font-mono text-lg border-b-2 border-brand pb-0.5">{email}</span> <CopyButton text={email} />`, then outline `LinkButton`s Download CV, LinkedIn, GitHub, and a `mailto:` primary button "Email me". No glow, no `BorderBeam`.

- [ ] **Step 5: Run the tests**

Run: `CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1 -g "copy button|about section|leadership section|every link|menu button"`
Expected: PASS. Lint, format, typecheck clean.

- [ ] **Step 6: Commit**

```bash
git add -A src e2e
git commit -m "feat: ruled skills, about with working hours and hiring setup, compact leadership, contact with copy"
```

---

### Task 6: Case study, article, 404 and share cards

**Files:**

- Modify: `src/app/work/[slug]/page.tsx`, `src/app/writing/[slug]/page.tsx`, `src/app/not-found.tsx`, `src/lib/og.tsx`, `src/components/media.tsx`
- Test: `e2e/site.spec.ts` (no new test; the axe, phone, case-study, article, 404 and OG tests cover it)

**Interfaces:**

- Consumes: `BrowserFrame({ url, note? })`, `LinkButton`, `Tags`, `formatShortDate`, `DiagramPanel`, `ShotFigure`, `ClipFigure`.
- Produces: a `Row({ label, id?, children })` helper inside `work/[slug]/page.tsx` (`grid md:grid-cols-[10rem_1fr] gap-x-8 py-8 border-t border-border`, label as an `h2` in label style when `id` is given) reused by the article page via copy, not import (two files, each self-contained).

- [ ] **Step 1: Case study**

`work/[slug]/page.tsx`: `main max-w-6xl px-5 pt-24 pb-16`; "All work" link in muted with `hover:text-brand`; eyebrow `{company} · {year}` in label style; `h1 font-display font-extrabold text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em]`; summary `text-[1.3rem] text-muted-foreground max-w-3xl`; lead media as today inside the new frames (`ShotFigure`/`ClipFigure`/`DiagramFigure` with `border border-foreground`, no radius); then a `border-t-2 border-foreground mt-12` block of `Row`s: "Why it existed", "What I built" (`<ol>` of rows `grid grid-cols-[1.6rem_1fr] py-3 border-b border-border` with mono letters a, b, c…), "Outcome" when present, the note when present (plain muted paragraph), "Stack" (`Tags`), "Links" (outline `LinkButton`s in a wrap, first one `primary`); then "On screen" and "How it fits together" as `Row`s; the next link as `<Link className="grid md:grid-cols-[10rem_1fr] py-6 border-y-2 border-foreground hover:text-brand">` with the mono label "Next" and the title in display 2xl. Remove `Reveal` and all `rounded-*`.

- [ ] **Step 2: Article**

`writing/[slug]/page.tsx`: same head (date via `formatShortDate`, "{minutes} minute read"); `h2` blocks in `font-display font-bold text-3xl tracking-[-0.02em] mt-8`; paragraphs `text-[1.2rem] leading-relaxed`; list blocks as `<ol className="border-t border-border">` rows `grid grid-cols-[2rem_1fr] py-4 border-b border-border` with the mono number; code figure `border border-foreground` square, caption bar `font-mono text-[0.85rem] border-b border-border px-4 py-2`, `pre` unchanged; "In the repository" as a label/content row; next link as in the case study. Remove `Reveal` and `rounded-*`.

- [ ] **Step 3: 404 and share cards**

`not-found.tsx`: label "404", display h1, muted paragraph, `LinkButton primary` "Back to the home page". Remove `rounded-*`.
`og.tsx`: background `#f3f5f2`, a 4 px `#141a1f` rule across the top (a `div` with `borderTop`), eyebrow `#1f3fd1` letter-spaced mono-ish (system monospace via `fontFamily: "ui-monospace, Menlo, monospace"`), title `#141a1f` weight 800, text and footer `#4b5660`; keep the size thresholds.
`media.tsx`: `PhoneFrame` keeps `rounded-[2.25rem]`; `ShotFigure`/`ClipFigure` captions `text-left font-mono text-[0.85rem] text-muted-foreground`.

- [ ] **Step 4: Run the whole suite**

Run: `CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1`
Expected: every test PASS, including the six axe runs. Fix any contrast finding by adjusting the dark `--muted-foreground` or `--brand` lightness, never by hiding the element. Lint, format, typecheck clean.

- [ ] **Step 5: Commit**

```bash
git add -A src e2e
git commit -m "feat: case studies, articles, 404 and share cards in the statement style"
```

---

### Task 7: Content structure: Kora, one Potluck case study, earlier projects, redirects

**Files:**

- Modify: `src/content.ts`, `next.config.ts`, `src/app/work/[slug]/page.tsx`, `src/components/work-table.tsx` (only if the divider needs the `earlier` flag plumbed), `e2e/site.spec.ts`
- Create: `public/work/kora-chkoun.png` (copy of `D:\Downloads\Portfolio\kora\.superpowers\sdd\2026-10-05-sprint-2\screens\chkoun-fr-1280-2-playing.png`)

**Interfaces:**

- Consumes: `Project`, `DiagramSpec`, `Shot` types; `Row` from Task 6.
- Produces: `Project` gains `parts?: { title: string; built: string[]; outcome?: string; diagram?: DiagramSpec }[]` and `earlier?: boolean`; `projects` order: `potluck`, `tnpay`, `deal-grader`, `kora`, `spyder`, `inspection-platform` (earlier), `event-orchestrator` (earlier); `redirects()` in `next.config.ts` mapping `/work/potluck-live`, `/work/payments`, `/work/messaging`, `/work/infrastructure` to `/work/potluck` with `permanent: true`.

- [ ] **Step 1: Update and write the tests**

In `e2e/site.spec.ts`: `PROJECTS = ["Potluck", "tnpay", "Deal Grader", "Kora", "Spyder", "Field-inspection platform", "Event Orchestrator"]`; in the axe loop replace `/work/payments` with `/work/potluck`; in "hovering a work row changes the preview" the initial `data-preview` becomes `"potluck"`; add:

```ts
test("old Potluck case-study links redirect to the merged one", async ({
  page,
}) => {
  for (const old of [
    "/work/payments",
    "/work/potluck-live",
    "/work/messaging",
    "/work/infrastructure",
  ]) {
    await page.goto(old);
    await expect(page).toHaveURL(/\/work\/potluck$/);
  }
  await expect(
    page.getByRole("heading", { level: 1, name: "Potluck" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Payments on Stripe Connect" }),
  ).toBeVisible();
});

test("Kora has a case study with its live link", async ({ page }) => {
  await page.goto("/work/kora");
  await expect(
    page.getByRole("heading", { level: 1, name: "Kora" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Play Kora" })).toHaveAttribute(
    "href",
    "https://kora-tn.vercel.app",
  );
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `pnpm exec playwright test --workers=1 -g "redirect|Kora has"`
Expected: FAIL.

- [ ] **Step 3: Merge Potluck**

In `content.ts` replace the four Potluck entries with one:

- `slug: "potluck"`, `title: "Potluck"`, `company: "Potluck"`, `year: "2026"`.
- `summary: "Founding engineer: the Stripe Connect payments stack, the live-shopping product, realtime messaging and the release pipeline of a US live-shopping marketplace."`
- `why: "Potluck is a US marketplace where home bakers sell on camera. I joined as its founding engineer in June 2026 and own the parts with the least room for error: payments, production infrastructure and the realtime systems."`
- `parts`: four entries in this order, each taking the old entry's `title` (Payments on Stripe Connect, Potluck LIVE, Realtime messaging, Infrastructure and release pipeline), `built`, `outcome` and, as `diagram`, the old `visual.diagram`.
- `cover`: the old payments entry's cover if it has one, else the first cover among the four; `clip`: the first clip among the four; `gallery`: all four galleries concatenated, de-duplicated by `src`, minus the chosen cover; `stack`: the union in first-seen order, cut to six; `links`: the union de-duplicated by `href`; `visual`: the payments diagram; `note`: none.
  Keep every sentence from the old entries unchanged.

- [ ] **Step 4: Kora, earlier projects, redirects**

Copy the screenshot to `public/work/kora-chkoun.png` and read its pixel size (`node -e` with `fs.readFileSync` and the PNG header at bytes 16–24). Add the project after `deal-grader`:

- `slug: "kora"`, `title: "Kora"`, `company: "Open source · side project"`, `year: "2026"`.
- `summary: "A daily guess-the-footballer game for Tunisia, in Arabic, French and English, with its own data pipeline."`
- `why: "Daily sports puzzles exist for the big leagues and not for Tunisian football. Kora is a hub of small daily games about the national team and Ligue 1, built to have real Tunisian players, not just code."`
- `built`: ["Chkoun?, a daily guess-the-footballer puzzle in Arabic, French and English, with a result card, a share grid and streaks.", "A data pipeline from Wikidata, English and French Wikipedia and Wikimedia Commons, with provenance and a confidence level for every field, synced into Postgres on deploy.", "A nightly workflow that proposes a data pull request, an admin calendar, and Sources and privacy pages.", "More than a thousand automated tests across unit, database and browser suites, with a Lighthouse budget in CI."]
- `outcome: "Live since 6 October 2026, with a new puzzle every day."`
- `stack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Playwright"]`; `links: [{ label: "Play Kora", href: "https://kora-tn.vercel.app" }, { label: "Source on GitHub", href: "https://github.com/JalelDridi/kora" }]`.
- `cover: { src: "/work/kora-chkoun.png", alt: "Chkoun?, Kora's daily puzzle, in French: a grid of guesses with some fields revealed", caption: "Chkoun?, the daily puzzle, in French.", width, height, frame: "browser", url: "kora-tn.vercel.app/fr/chkoun" }`; `visual: { kind: "image", src, alt, width, height }` with the same values.
  Mark `inspection-platform` and `event-orchestrator` with `earlier: true` and move them to the end. In `next.config.ts` add the `redirects()` from Interfaces. In `work/[slug]/page.tsx` render `parts` after "Why it existed": for each part a `Row` labelled with `part.title` (as an `h2`) containing its built list, its outcome paragraph and, when present, its diagram in a `DiagramFigure`-style frame; when `parts` exist, skip the top-level "What I built" row (the merged entry has no `built` of its own: set `built: []`).

- [ ] **Step 5: Run the suite**

Run: `CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1`
Expected: all PASS (the `sitemap` and OG routes pick the new slugs up automatically). Lint, format, typecheck clean.

- [ ] **Step 6: Commit**

```bash
git add -A src e2e next.config.ts public/work/kora-chkoun.png
git commit -m "feat: one Potluck case study with four parts, Kora added, earlier projects grouped, old links redirected"
```

---

### Task 8: Changelog page and the site version

**Files:**

- Create: `src/app/changelog/page.tsx`
- Modify: `src/content.ts`, `src/components/site-footer.tsx`, `src/app/sitemap.ts`, `e2e/site.spec.ts`

**Interfaces:**

- Consumes: `site.version`, `formatShortDate`, `Row` pattern.
- Produces: `changelog` export: `{ version: string; date: string; title: string; items: string[] }[]`, newest first, `changelog[0].version === site.version`.

- [ ] **Step 1: Write the failing test**

```ts
test("the changelog lists the current version first and is linked from the status strip", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "changelog" })
    .click();
  await expect(page).toHaveURL(/\/changelog$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Changelog" }),
  ).toBeVisible();
  await expect(page.locator("main ol li").first()).toContainText("3.0.0");
});
```

Also add `"/changelog"` to the axe loop's paths.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm exec playwright test --workers=1 -g "changelog"`
Expected: FAIL.

- [ ] **Step 3: Content and page**

`changelog` entries (check the dates with `git log --format='%ad %s' --date=short` and correct them if they differ):

- 3.0.0, today's date, "Statement": ["Bricolage Grotesque and IBM Plex replace Geist; cool paper with one cobalt accent, square corners, rules instead of cards.", "An account summary with sourced numbers replaces the counting metrics.", "The pipeline playground posts its steps into a ledger book.", "Work is a table with hover previews; one Potluck case study with four parts; Kora added; earlier projects grouped.", "Working hours and hiring setup in About; a copy button for the email.", "A status strip with live clocks, the deploy date and this changelog."]
- 2.2.0, 2026-10-03, "About, leadership, writing": ["An About section with a portrait and four clocks.", "A Leadership section.", "Two articles drawn from Payout Ledger's design records.", "A card and case study for tnpay."]
- 2.1.0, 2026-10-02, "Faster and shareable": ["Recordings load only near the screen.", "A phone menu.", "A share card per case study, structured data, a custom 404."]
- 2.0.0, 2026-10-02, "Second design": ["Dark theme with a green accent, animated diagrams, real screenshots and recordings.", "The pipeline playground and the live time in Bizerte in the hero."]
- 1.0.0, 2026-10-02, "First version": ["A single-column page with the profile, the flagship project and five case studies."]

`changelog/page.tsx`: `metadata.title = "Changelog"`; `main max-w-4xl px-5 pt-24 pb-16`; label "Site", `h1` "Changelog" in display, one sentence "Every version of this site, newest first. The version number is in the status strip at the bottom of every page."; `<ol className="border-t-2 border-foreground">` with `li` rows `grid md:grid-cols-[10rem_1fr] py-6 border-b border-border`: left `v{version}` in mono and the date under it; right `h2` title in display 2xl and a `ul` of items.
`site-footer.tsx`: `Site v{site.version} · <Link href="/changelog">changelog</Link>`.
`sitemap.ts`: add `{ url: `${SITE_URL}/changelog`, changeFrequency: "monthly", priority: 0.3 }`.

- [ ] **Step 4: Run the suite**

Run: `CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1`
Expected: all PASS. Lint, format, typecheck clean.

- [ ] **Step 5: Commit**

```bash
git add -A src e2e
git commit -m "feat: a changelog page, linked from the status strip"
```

---

### Task 9: Whole-site verification, Lighthouse, screenshots and preview

**Files:**

- Create: `D:\Downloads\Portfolio\docs\redesign\shots-site\*.png` (outside the repo), `D:\Downloads\Portfolio\docs\redesign\verification.md`
- Modify: only what the checks require.

- [ ] **Step 1: Full checks**

Run: `pnpm lint && pnpm format:check && pnpm typecheck && CIRCLE_NODE_TOTAL=2 pnpm build && pnpm exec playwright test --workers=1`
Expected: all green. Record the test count.

- [ ] **Step 2: Lighthouse on a phone profile**

Start the built site in the background: `pnpm exec next start --port 3200`. Run three times: `npx --yes lighthouse@12 http://localhost:3200/ --output=json --output-path=D:/Downloads/Portfolio/docs/redesign/lh-$i.json --chrome-flags="--headless=new" --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --only-categories=performance,accessibility,best-practices,seo --quiet`. Read the four category scores from each JSON with a `node -e` one-liner. Expected: performance ≥ 90 on the median run, accessibility 100. If performance is below 90, look first at the font payload (drop a Plex Sans weight, confirm `preload: false` on the mono face) and at the hero image sizes, then re-run.

- [ ] **Step 3: Screenshots**

Adapt `D:\Downloads\Portfolio\docs\redesign\shoot.mjs` into `shoot-site.mjs` that captures `/`, `/work/potluck`, `/work/kora`, `/writing/twenty-five-payouts-a-balance-for-ten`, `/changelog` at 1280 wide (full page) in light and dark, and `/` at 390 wide, into `docs\redesign\shots-site\`. Stop the server afterwards.

- [ ] **Step 4: Write `verification.md`**

List: the check commands and their results, the Lighthouse scores per run, the screenshot files, the files that are now unused (`src/components/ui/border-beam.tsx`, `number-ticker.tsx`, `marquee.tsx`, `blur-fade.tsx`, and `src/components/reveal.tsx` once nothing imports it), for Jalel to delete, and anything you noticed but did not change.

- [ ] **Step 5: Commit and push the branch**

```bash
git add -A
git commit -m "chore: verification notes for the statement redesign"
git push -u origin redesign/statement
```

Then open a pull request with `gh pr create --title "Statement redesign" --body-file <a file with the summary, the Lighthouse table, and the line "🤖 Generated with [Claude Code](https://claude.com/claude-code)">`, and report the pull request URL and the Vercel preview URL (from the PR's checks or `vercel ls jaleldridi`). Do not merge.
