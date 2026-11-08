# Statement redesign: design

Written 8 November 2026 after Jalel chose direction A ("Statement") from three mockups. The research and the comparison of the three directions are in `D:\Downloads\Portfolio\docs\redesign\` (`plan.md`, `research.md`, `mockups/statement.html`). This document is what a builder needs to restyle the site without going back to him.

## Intent

The site is well built but assembled from the defaults of shadcn/ui, Magic UI and Geist, which people now read as "AI made this". The redesign gives it one point of view: the site is typeset like a financial statement. A ruled grid, tabular numbers, one accent colour, precision as the personality. It suits a payments and reliability engineer, breaks completely from the template look, and needs nothing Jalel has not already supplied.

## Goals

- A visitor remembers the site: large display type, ruled structure, a ledger instead of counting numbers, a playground that posts ledger entries.
- Every number on the page is server-rendered and sourced. No count-ups.
- Three or five featured projects instead of nine cards; one Potluck case study; Kora added.
- Answers to a remote hiring manager's questions, in his own facts: hours flexible, contractor or employer of record, no visa sponsorship needed.
- Lighthouse mobile performance at or above 90 and accessibility 100; all Playwright tests green; works on a 340 px phone.

## Non-goals and anti-goals

- No new personal claims. Wording comes from `content.ts`, the CV, the repos and `STATUS.md`. The two "Working with me" lines are the only new sentences and are fixed below.
- No employer code, no private screenshots. Private work stays a diagram.
- Not minimal: the type stays large (base 17 px, labels at least 0.85 rem), the page stays dense with real material.
- No terminal gimmicks, no glows, no gradient text, no pill badges, no marquee, no border beams, no bento cards, no dot grid.
- No new paid service. Fonts come from `next/font/google`, self-hosted at build.

## Constraints

- Next.js 16 (see `AGENTS.md`: read `node_modules/next/dist/docs/` before writing routes), React 19, Tailwind 4 with CSS tokens in `src/app/globals.css`, next-themes with the `dark` class.
- Vendored components in `src/components/ui/` are not hand-edited. Border beam, number ticker, marquee, blur fade and animated beam stop being imported; the files stay in place because file deletion is blocked for the agent, and are listed for Jalel to delete. `animated-beam` stays in use by `diagram.tsx`.
- `prefers-reduced-motion` already freezes every animation through `globals.css`; nothing may depend on an animation having run (content visible at rest).
- CI runs `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm build`, `pnpm test:e2e`. On this machine build with `CIRCLE_NODE_TOTAL=2 pnpm build` and run Playwright with `--workers=1`.
- Small conventional commits with the trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Decided

### Tokens

Light (default), in `:root`:

| Token                | Value                                          | Use                                              |
| -------------------- | ---------------------------------------------- | ------------------------------------------------ |
| `--background`       | `oklch(0.967 0.004 150)` (cool paper, #f3f5f2) | page                                             |
| `--card`             | `oklch(1 0 0)`                                 | frames around media                              |
| `--foreground`       | `oklch(0.19 0.012 240)` (#141a1f)              | ink, strong rules                                |
| `--muted-foreground` | `oklch(0.44 0.015 240)` (#4b5660)              | secondary text                                   |
| `--border`           | `oklch(0.84 0.008 160)` (#c6cec9)              | hairline rules                                   |
| `--brand`            | `oklch(0.45 0.21 265)` (#1f3fd1)               | the one accent: numbers, hover, focus            |
| `--debit`            | `oklch(0.5 0.17 28)` (#c3312a)                 | held or failed entries only                      |
| `--radius`           | `0`                                            | square corners everywhere except the phone frame |

Dark (`.dark`): `--background oklch(0.2 0.03 250)` (#0f1a26), `--card oklch(0.23 0.03 250)` (#142131), `--foreground oklch(0.94 0.005 160)` (#eceeea), `--muted-foreground oklch(0.75 0.01 220)` (#a8b2b9), `--border oklch(0.32 0.025 240)` (#2a3947), `--brand oklch(0.72 0.14 270)` (#86a0ff), `--debit oklch(0.72 0.17 28)` (#ff7b6e). The other shadcn tokens (`--primary`, `--secondary`, `--muted`, `--accent`, `--ring`, `--input`, popover) follow: primary = foreground, muted and secondary = a 4 % tint of foreground over background, ring = brand. `--brand-bright` and `--brand-2` are removed.

### Type

- Display: Bricolage Grotesque, variable, axes `opsz` and `wdth`, via `next/font/google` as `--font-display`. Headlines use weight 800, `opsz` 96, `wdth` 88, tight leading (0.86 to 1.0), letter-spacing −0.035 em at hero size and −0.025 em below.
- Text: IBM Plex Sans 400, 500, 600 as `--font-sans`.
- Data: IBM Plex Mono 400, 500 as `--font-mono`, not preloaded. Used for labels, dates, numbers, URLs. Tabular numerals wherever digits line up.
- Sizes: `html` stays at 106.25 % (17 px). Hero name `clamp(3.4rem, 8.4vw, 7.6rem)`. Section titles `clamp(2rem, 4.2vw, 3.2rem)`. Lede 1.55 rem. Body 1.15 rem. Labels 0.85 rem uppercase with 0.08 em tracking.

### Structure

Every section head is two columns on desktop: a 10 rem label column (mono, uppercase) and the title and description, under a 2 px foreground rule. Lists are rows under hairlines, never cards. Media sits in a frame: 1 px foreground border, a bar with the URL on the left and a mono note on the right, square corners. Buttons are square, 44 px tall, 1 px foreground border; the primary one is filled with foreground.

Home page order: header, hero with account summary, playground band, flagship, work, notes, skills, about, experience, leadership, contact, status strip.

- **Header**: sticky, solid background, bottom rule. Name in display 600 on the left; nav Flagship, Work, Notes, About, Experience, Contact; a square theme toggle; the phone menu as today. No contact pill.
- **Hero**: two columns (1.1fr / 0.9fr). Left: the name on three lines (Mohamed / Jalel / Dridi, the last in weight 300), accessible name "Mohamed Jalel Dridi"; the lede "Founding Engineer at Potluck. Full-stack TypeScript, payments and reliability."; the intro paragraph; the three facts and the location with the live local time; buttons See the work, Email me, CV, plus GitHub and LinkedIn icon links. Right: the **account summary**, a ruled list headed "Account summary / as of today" with five rows (name, one-line detail, mono value with the numbers in brand colour) and a bold total row "Open to remote roles · Bizerte · UTC+1". The rows and their values are fixed in the plan. This replaces the metrics strip.
- **Playground band**: full-width band between two rules. Left: label "Try it", title "Break my pipeline.", one sentence, the three scenario buttons, the status line. Right: the **ledger book**, a table of entries (stage, event, entry, owed to seller, result) that fills as a scenario plays, and under it the three totals. Same simulation, same buttons, same status text as today.
- **Flagship**: frame with the recording, caption; four points as a lettered list (a–d) with rules; stack; three buttons.
- **Work**: a table of rows (year, title, company and year, one line, arrow) with a sticky preview frame on the right that changes on hover and focus; on phones the preview is hidden. Earlier projects sit under a divider row "Earlier".
- **Notes** (section id stays `writing`): dated rows (date, title and summary, minutes).
- **Skills**: a ruled definition list (group, items joined by " · "). No marquee.
- **About**: portrait in a square frame with the mono caption "fig. 1 · Bizerte" and "37°16′N 9°52′E"; the three paragraphs; a facts list with the existing four facts plus two new ones: **Hours: "Flexible: I adapt to the team's time zone."** and **Hiring setup: "Contractor or employer of record; no visa sponsorship needed."**; the four clocks in a ruled block.
- **Experience**: ruled rows (period, role and company, detail, summary). No timeline dots.
- **Leadership**: compact: the intro, the three roles inline in order, the bridge sentence, the chapter link, one line for the 2026 activities, one line for the junior enterprise role.
- **Contact**: two columns under a rule: label and title on the left; on the right the sentence, the email in mono with a Copy button, and CV, LinkedIn, GitHub links.
- **Status strip** (footer): mono: Bizerte, New York and San Francisco times (client-rendered), "Site v3.0.0 · changelog", "Last deploy {build date}", "Source on GitHub". No "Built with Next.js".

Case-study and article pages follow the same vocabulary: back link, mono eyebrow, display title, summary, lead media in a frame, then label-column sections with ruled rows; the next-page link is a ruled row. The merged Potluck case study renders its four parts as sections, each with its own built list and diagram. A `/changelog` page lists the site's versions. Share cards (OG images) switch to paper, ink and cobalt.

### Motion

One page-load sequence in the hero: the name, lede, facts and buttons rise in with 80 ms stagger (the existing CSS `Rise`), and the account summary's top rule draws from left to right. Hover: work rows and links turn brand, the preview swaps. Scroll reveals are removed; content is visible at rest. The recordings keep their lazy loading and in-view play.

### Content changes

- Projects: `potluck` (merging Potluck LIVE, Payments on Stripe Connect, Realtime messaging, Infrastructure and release pipeline as `parts`), `tnpay`, `deal-grader`, `kora` (new), `spyder`, then `inspection-platform` and `event-orchestrator` marked `earlier`. Old Potluck slugs redirect permanently to `/work/potluck`.
- Kora's facts come from `D:\Downloads\Portfolio\STATUS.md`; its screenshot is the chapter's own public page.
- `site.version` is `3.0.0`; the changelog's earlier versions are dated from `git log`.

## Left to the builder

Exact Tailwind classes; how the ledger book caps its rows; the shape of the client components for clocks, copy button and work table; the OG card's spacing; whether the Potluck cover is the feed or the live page; the Kora image dimensions; and anything the plan marks as the implementer's choice.
