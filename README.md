# Portfolio

My personal site: who I am, the open-source project I built to show how I work, and case studies of things I have shipped.

**Live:** https://jaleldridi.vercel.app

It is statically generated. The home page is a reel of "episodes", one project at a time; each episode opens its case study at `/work/<slug>`, and the open-source flagship has its own page at `/work/payout-ledger`. Everything that is not project work (about, experience, skills, leadership, notes, contact) is on `/about`. All the copy lives in [`src/content.ts`](src/content.ts), including the specs the architecture diagrams are drawn from.

## Run locally

```bash
pnpm install
pnpm dev
```

## Checks

```bash
pnpm lint && pnpm format:check && pnpm typecheck && pnpm build && pnpm test:e2e
```

The Playwright tests check the content, the reel with and without JavaScript, with reduced motion and from the keyboard, the case-study pages and /about, that every link has a destination, accessibility, and that pages fit a phone screen.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Motion for the diagrams, Playwright, deployed on Vercel.

## Licence

The code is MIT licensed. The text describes my own work and is not licensed for reuse.
