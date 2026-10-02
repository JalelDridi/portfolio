# Portfolio

My personal site: who I am, the open-source project I built to show how I work, and case studies of things I have shipped.

**Live:** https://jaleldridi.vercel.app

It is a single statically generated page. All the copy lives in [`src/content.ts`](src/content.ts).

## Run locally

```bash
pnpm install
pnpm dev
```

## Checks

```bash
pnpm lint && pnpm format:check && pnpm typecheck && pnpm build && pnpm test:e2e
```

The Playwright tests check the content, that every link has a destination, accessibility in light and dark mode, and that the page fits a phone screen.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Playwright, deployed on Vercel.

## Licence

The code is MIT licensed. The text describes my own work and is not licensed for reuse.
