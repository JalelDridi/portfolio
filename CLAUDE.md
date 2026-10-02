@AGENTS.md

# Portfolio

Jalel's personal site. One statically generated page; no database, no client-side JavaScript beyond what Next.js ships.

## Commands

- `pnpm dev` — run locally
- `pnpm lint` · `pnpm format:check` · `pnpm typecheck` · `pnpm build` · `pnpm test:e2e` — the CI checks, in order

## Layout

- `src/content.ts` — all copy; edit wording here
- `src/app/page.tsx` — the page
- `e2e/` — Playwright tests (content, links, accessibility, phone width)

## Rules

- **Jalel approves all wording.** Propose copy changes; do not publish new claims on your own.
- Every claim must be supported by his CV. Use "fully remote with US teams since January 2026", never "two years remote".
- Case studies describe what was built and why. No incident narratives, no internal names, schemas or figures beyond what the CV states.
- No employer code or screenshots of employer products.
- Free tiers only. No analytics or trackers.
- Small conventional commits.
