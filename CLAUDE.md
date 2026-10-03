@AGENTS.md

# Portfolio

Jalel's personal site. Statically generated: a home page and one case-study page per project. No database.

## Commands

- `pnpm dev` — run locally
- `pnpm lint` · `pnpm format:check` · `pnpm typecheck` · `pnpm build` · `pnpm test:e2e` — the CI checks, in order

## Layout

- `src/content.ts` — all copy; edit wording here
- `src/writing.ts` — the articles, as typed blocks; pages at `src/app/writing/[slug]/page.tsx`
- `src/app/page.tsx` — the home page, assembled from `src/components/sections/`
- `src/app/work/[slug]/page.tsx` — case-study pages
- `src/components/diagram.tsx` — architecture sketches drawn from specs in `content.ts`
- `src/components/media.tsx` — screenshots and recordings in browser or phone frames
- `public/work`, `public/demo` — screenshots and silent recordings of public pages
- `src/components/ui/` — vendored shadcn/ui and Magic UI components; do not hand-edit
- `e2e/` — Playwright tests (content, links, accessibility, phone width)

## Rules

- **Jalel approves all wording.** Propose copy changes; do not publish new claims on your own.
- Every claim must be supported by his CV. Use "fully remote with US teams since January 2026", never "two years remote".
- Case studies describe what was built and why. No incident narratives, no internal names, schemas or figures beyond what the CV states.
- No employer code. Screenshots only of pages that are public without logging in, and only with Jalel's approval; private work is shown as a diagram.
- Every animation must respect `prefers-reduced-motion`.
- Free tiers only. No analytics or trackers.
- Small conventional commits.
