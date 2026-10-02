# Portfolio

My personal site: who I am, the open-source project I built to show how I work, and case studies of things I have shipped.

**Live:** https://jaleldridi.vercel.app

It is statically generated: a home page and a case-study page per project. All the copy lives in [`src/content.ts`](src/content.ts), including the specs the architecture diagrams are drawn from.

## Run locally

```bash
pnpm install
pnpm dev
```

## Checks

```bash
pnpm lint && pnpm format:check && pnpm typecheck && pnpm build && pnpm test:e2e
```

The Playwright tests check the content, the case-study pages, that every link has a destination, accessibility in light and dark mode, the theme switch, and that pages fit a phone screen.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Magic UI and Motion for animation, Playwright, deployed on Vercel.

## Licence

The code is MIT licensed. The text describes my own work and is not licensed for reuse.
