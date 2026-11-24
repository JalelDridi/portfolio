# Episodes redesign: short design

24 November 2026. Awaiting Jalel's approval.

## Intent

Bab (live since 16 November) is "too much and too crowded". Jalel wants a simple, modern site with one theme, the work above everything, and a few simple animations that make moving around feel smooth. He chose direction A, Episodes, from four mock-ups (`docs/redesign3/`, review page https://claude.ai/artifact/Ttyzwb7yHhYeQ7aJGQ4Yjh).

## Goals

- One project on screen at a time; very little text on the home page.
- A clear theme: television title cards in the manner of a hacker drama. Black, off-white, one red.
- The real product is always visible: a still on the home page, full colour inside the episode.
- Works on a phone and without hover.

## Not goals, and what would make it a failure

- No new claims or facts. Existing approved wording is reused; new labels are drafts for Jalel.
- No show logo, name, quotes or images. Style only.
- Failure: a gate before the work, a terminal to type into, stacked effects (glitch plus scanlines plus ticker), anything that hides the work behind the theme.

## Approaches considered

1. **Reskin in place (chosen).** New branch from `main`; keep `content.ts`, the case-study data, media, tests and routes; replace the home page and the case-study template and remove the Bab components. Cheapest, keeps every approved sentence.
2. Rebuild from an empty Next.js app. Cleaner tree, but re-does routing, share cards and tests for no visible gain.
3. Keep Bab and thin it out. Does not answer "I want a theme like Mr. Robot".

## Design (my calls unless marked)

- **Home** matches `docs/redesign3/mockups/episodes.html`: full-bleed still, red title card, episode list, progress line. Six episodes: Solvedblue, Payout Ledger, Potluck, tnpay, Kora, Deal Grader (Jalel's order from Bab). Spyder and the two earlier projects sit under a quieter "earlier episodes" list.
- **Episode page** = the existing case study under the new skin: red title, one sentence, facts, then the approved "why / built / outcome" text, the diagram and the gallery in full colour.
- **About, experience, contact** move to one short page reached from the header, not stacked under the work.
- **Motion:** hard cut with a quarter-second slice glitch; title decode on small labels and the title; slow zoom on the still; red progress line with auto-advance that stops on any interaction; the still grows into the episode's first picture (View Transitions, with a plain fade as fallback). All off under reduced motion.
- **Phone:** the list becomes a vertical swipe of title cards; tap opens the episode.
- **Type:** Archivo (wide, black weight) for titles, IBM Plex Mono for labels, a plain sans for long case-study text so it stays readable.
- **From the research:** no loader or enter screen; poster images and real HTML text first; scanlines kept very faint or dropped.

## Left to the builder

Component split, the removal list of Bab files (listed for Jalel, who deletes), test updates, Lighthouse budget (mobile performance 90 or better, accessibility 100).

## For Jalel to approve

The draft labels ("Play episode", "all episodes", the `eps1.0_name.ts` file names) and whether Payout Ledger may carry the alternative title "402 Payment Required".
