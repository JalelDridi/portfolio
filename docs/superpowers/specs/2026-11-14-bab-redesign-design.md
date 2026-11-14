# Bab redesign: design

Written 14 November 2026. Jalel rejected the built "Statement" design ("too plain, too much text") and chose direction A, "Bab", from three mockups that each grow out of a Tunisian craft. The research and the three mockups are in `D:\Downloads\Portfolio\docs\redesign2\` (`research.md`, `mockups/bab.html`, `mockups/tn.js`, `shots/bab-hero.png`, `shots/bab-full.png`, `shots/bab-phone.png`). **The mockup is the visual contract**: open it, read its CSS, match it. This document records what it means and what it does not show.

## Intent

The site is a whitewashed street in a Tunisian medina. Every project is a studded door that swings open on the work behind it. The Tunisian elements are specific and checked: the studded doors of the Tunis medina and Sidi Bou Said, a band of Qallaline tiles as the ground line, horseshoe arches around pictures, and a few Derja words each shown with its meaning. It must feel made by a person from Bizerte, look rich and alive (pictures, colour, motion), and still let a recruiter scan it in thirty seconds.

## Goals

- A visitor remembers "the one with the doors". The hero door stands ajar and opens on click; each project door opens on hover, focus or tap.
- Image-led, not text-led: every block has a picture, a door, an arch or a tile band. No tables, no ruled ledgers on the home page.
- Solvedblue is his current job: first door, first role on the timeline.
- Everything already built and tested stays: the merged Potluck case study, Kora, redirects, the pipeline playground, the changelog, the status strip, copy button, tests.
- Lighthouse mobile performance at or above 90 and accessibility 100 on `/`; all Playwright tests green; no horizontal scroll at 340 px; a designed dark theme ("the street at night").

## Non-goals and anti-goals

- No flag, no crescent and star, no hand of Fatima, no camels, palms or dunes, no Moroccan zellige, no generic arabesques. Do not call the eight-pointed star "khatem".
- No count-up numbers, gradient text, glows, pill badges, marquee, border beams, glass.
- No new claims about him beyond the sentences this document and the plan quote. All new wording is listed in the pull request for his approval.
- No employer code or private screenshots. Solvedblue is described only from its public site and the approved brief (`D:\Downloads\Portfolio\docs\solvedblue\brief.md`).
- Not a cartoon: the doors are flat, geometric and crisp; type is heavy and modern.

## Constraints

- Next.js 16 App Router (read `node_modules/next/dist/docs/` before touching routes or fonts), React 19, Tailwind 4 with CSS tokens in `src/app/globals.css`, next-themes with the `dark` class, Playwright with axe.
- Motifs are generated on the server as inline SVG from pure functions; no canvas, no client JavaScript for decoration. Client components only where state is needed (hero door, clocks, copy button, playground, theme toggle, mobile nav, diagram, lazy video, local time, world clocks).
- `prefers-reduced-motion`: the global rule already zeroes animation and transition durations and delays; nothing may depend on an animation having run.
- Files are never deleted by the agent; unused files are listed for Jalel.
- Low-memory machine: `CIRCLE_NODE_TOTAL=2 pnpm build`, `pnpm exec playwright test --workers=1`.

## Decided

### Tokens

Day (default, `:root`):

| Token                | Value     | Use                                                                             |
| -------------------- | --------- | ------------------------------------------------------------------------------- |
| `--background`       | `#faf9f4` | the wall                                                                        |
| `--card`             | `#ffffff` | frames, plaques                                                                 |
| `--wall-2`           | `#f1efe6` | door frames, quiet bands                                                        |
| `--foreground`       | `#101922` | ink                                                                             |
| `--muted-foreground` | `#4b5764` | secondary text                                                                  |
| `--border`           | `#dedbd0` | hairlines                                                                       |
| `--brand`            | `#1763b6` | Sidi Bou Said blue: links, accents, the flagship band                           |
| `--brand-deep`       | `#0f4f96` | shade on blue                                                                   |
| `--sun`              | `#edb021` | door yellow: one loud accent (dot after the name, primary button on blue, tags) |
| `--leaf`             | `#23795a` | door green                                                                      |
| `--red`              | `#c5352c` | door red; also "held" in the playground                                         |
| `--stud`             | `#10151b` | nail heads                                                                      |
| `--room`             | `#0c1520` | the dark inside of a door                                                       |

Night (`.dark`): `--background #0d1621`, `--card #131f2c`, `--wall-2 #172433`, `--foreground #f0eee7`, `--muted-foreground #a9b4c0`, `--border #263443`, `--brand #58a0ea` (text and links), `--brand-deep #0f4f96` (the flagship band keeps a deep blue: `#12508f`), `--sun #f2bb3a`, `--leaf #3fa37c`, `--red #e2685e`, `--stud #0a0e13`, `--room #060b12`. Door paints do not change at night. The shadcn tokens follow (`--primary` = foreground, `--muted`/`--secondary` = `--wall-2`, `--ring` = `--brand`). `--radius: 0`.

Door paints (fixed in both themes): blue `#1763b6`/`#0f4f96`, green `#23795a`/`#175c43`, yellow `#edb021`/`#c48d0c`, sky `#3d8bc9`/`#2a6fa8`, red `#c5352c`/`#9a251e`, night `#14324f`/`#0c2238` (fill/shade).

Qallaline tile: ground `#f3ecdb`, cobalt `#1f4e9c`, green `#2e7d4f`, ochre `#d4a020`, manganese line `#3e2a24`.

### Type

- Display: **Alexandria** 800 and 900 (500 and 700 for small display uses). Name: 900, `clamp(3.6rem, 9.4vw, 9rem)`, line-height .9, letter-spacing −.04em. Section titles: 900, `clamp(2.2rem, 5vw, 4rem)`, line-height .95, letter-spacing −.035em.
- Text: **Onest** 400/500/600. `html` stays at 106.25 %. Body 1.12–1.15 rem.
- Labels: **DM Mono** 400/500, .8 rem, uppercase, .1em tracking (not preloaded).
- Arabic: **Reem Kufi** 500/700 (subset `arabic`, not preloaded), always in `--brand`, always with `lang="ar"`, always next to its transliteration and English meaning.
- Allowed Arabic strings (checked): عسلامة (Aslema, hello), باب (Bab, door), دار (Dar, home), مرحبا (Marhba, welcome), بالسلامة (Bislema, goodbye), بنزرت (Bizerte), جلال (Jalel), محمد جلال الدريدي (his full name, confirmed by him).

### Motifs

- **Door**: a 400 × 620 double door. Common to all: a stud border, a double-row horseshoe arch with jambs to the threshold, two spandrel rosettes, a seam, two ring knockers, a lozenge in each lower panel, two stud bands. The centre motif varies: `star` (eight-pointed outline), `sun` (concentric rings), `tree` (the fir-tree shape), `lozenge`, `fish` (an eye-shaped fish), `rows` (simple straight rows). Port `doorStuds` from `tn.js` exactly.
- **Opening**: leaves swing inward (left `rotateY(78deg)`, right `rotateY(-78deg)`, origin on the hinge side, parent `perspective: 1500px`, .9 s `cubic-bezier(.2,.7,.2,1)`), darkening slightly as they open. "Ajar" = right leaf at −76°.
- **Tile band**: a 64 px row of the Qallaline tile (`tile()` in `tn.js`), full width.
- **Stud band**: 44 px of small lozenges and dots (`studBand()`), used on the blue band.
- **Arch**: a horseshoe arch clip for pictures (`archPath()`), fixed aspect per use (portrait 4:5, flagship 5:6).
- **Plaque**: the blue street plaque with a white inner border (Arabic above, Latin capitals below).
- **Buttons**: arch-topped: `border-radius: 999px 999px 10px 10px`, 2 px border, 3 rem tall.

### Page structure (home)

Header → Hero (name left, big door right, then the tile band) → Work: "the street" (`#work`) → Flagship on a full-bleed blue band (`#project`) → Playground on a quiet band (`#playground`) → Notes (`#writing`) → Skills → About (`#about`) → Experience (`#experience`) → Leadership (`#leadership`) → Contact (`#contact`) → tile band → status strip.

- **Header**: wall colour, no rule; "Jalel Dridi" in Alexandria 800 with جلال beside it; nav Work, Flagship, Notes, About, Experience, Contact; "Bizerte HH:MM · 37°16′N 9°51′E" in mono on wide screens; theme toggle; phone menu.
- **Hero**: as the mockup. Greeting عسلامة with "Aslema · hello from Tunisia"; h1 with "Mohamed" small above "Jalel / Dridi" and a yellow full stop (accessible name "Mohamed Jalel Dridi"); role line; the short hero line; three buttons (Open a door ↓, Email me, CV) plus GitHub and LinkedIn icon links; three facts in mono; the local-time line. Right: the Bizerte plaque, the frame, the blue `star` door standing ajar with the room behind it ("Now · Solvedblue · iMessage for business. · Step inside →"), the threshold step. Clicking the door (a real button) opens both leaves and shows the room in full: the same block plus two links, "Read the case study" (`/work/solvedblue`) and "Break my pipeline ↓" (`#playground`).
- **Work**: head "Behind each door, something I shipped." with the باب kicker. Five doors in a row (two per row on phones): Solvedblue (blue, star), Payout Ledger (green, sun; links to `#project`), Potluck (yellow, tree), tnpay (sky, lozenge), Kora (red, fish). Each: frame, door, step, "N° 0x" and a short note in mono, title (h3), one line. Hover, keyboard focus or (on touch screens, by default) ajar shows the screenshot inside with "Read the case study →". Below: "Also on this street:" with Deal Grader, Spyder, Field-inspection platform, Event Orchestrator as h3 links in a row.
- **Flagship**: the blue band between two stud bands, as the mockup: label, title, summary, three points with stud bullets, buttons (Try the live demo ↗ in yellow, Read the code, Design decisions), and the recording in a 5:6 horseshoe arch with its caption.
- **Playground**: a `--wall-2` band. Left: label "Try it", title "Break my pipeline.", the sentence, the three arch-topped buttons, the status line. Right: the entries table and totals, restyled (hairline rules, Alexandria headings, results: applied in `--brand`, skipped muted, held in `--red`), then "Open the real demo".
- **Notes**: a row per article: date in mono, title in Alexandria 800, summary, minutes; the row lifts its title to blue on hover.
- **Skills**: six groups in a three-column grid: group name in mono blue, items joined by " · ". No boxes.
- **About**: as the mockup: portrait in a 4:5 horseshoe arch with the yellow "Bizerte · 37°16′N 9°51′E" tag, the paragraphs (first one in Alexandria 700), the six facts, the four clocks.
- **Experience**: a row per role: period in mono, role in Alexandria 800, company link, detail, summary; the current role carries a small yellow dot.
- **Leadership**: compact: intro, the three roles in order, the chapter line and link, the 2026 activities list, the bridge sentence, the El Alia sentence.
- **Contact**: as the mockup: مرحبا kicker, "Hiring for payments or full-stack TypeScript? Knock.", the email with copy button, Email me / CV / LinkedIn / GitHub, and a small yellow `sun` door to the right.
- **Footer**: tile band, then the status strip in mono: the three clocks, "Site v3.0.0 · changelog", "Last deploy …", "Source on GitHub", the credit "Tiles after the Qallaline workshops of Tunis · doors after the medina", and بالسلامة with "Bislema · goodbye".

Other pages: a case study opens with a band in its project's door paint (title in white or ink for contrast, the project's small door to the right, closed), then lead media and the label/content rows already built, restyled (no heavy rules; hairlines). Articles, the changelog and the 404 keep their structure in the new type and colours; the 404 shows a closed `night` door. Share cards: wall background, a blue band at the left with studs, the title in Alexandria-like heavy sans, ink text.

### Content changes

- **Solvedblue** project, first in `projects`, exactly as in `D:\Downloads\Portfolio\docs\solvedblue\brief.md` (image `public/work/solvedblue-home.png`).
- **Experience**: new first entry: role "Founding Engineer", company "Solvedblue", href `https://solvedblue.com`, detail "Business messaging platform · fully remote", period "Nov 2026 – present", summary "Work on the engine that decides what is sent, from which line, and when: dispatch, per-line queues, fleet health, replies and calling." Potluck becomes "Jun 2026 – Oct 2026" with the summary in the past tense: "Owned the Stripe Connect payments stack and production infrastructure. Built the live-shopping product and realtime messaging. Led releases for a three-person team."
- **Profile**: `intro` becomes "I build the parts of a product where money, reliability and trust meet. I am one of the founding engineers of Solvedblue, a business messaging platform, where I work on the engine that decides what is sent, from which line, and when. Before that I owned the Stripe Connect payments stack and the production infrastructure at Potluck, a US live-shopping marketplace." New `heroLine`: "I build the parts of a product where money, reliability and trust meet. Every door on this street opens on something I built and shipped."
- **Potluck case study** `why`: "Potluck is a US marketplace where home bakers sell on camera. I was its founding engineer from June to October 2026 and owned the parts with the least room for error: payments, production infrastructure and the realtime systems."
- **About**: append to the second paragraph: " Since November 2026 I have been one of the founding engineers of Solvedblue, a business messaging platform."
- **Leadership**: new last sentence: "El Alia is the hill town near Bizerte that grows the teasel used to card Tunisia's chechias."
- **Changelog**: the 3.0.0 entry (Statement never went live) is replaced by 3.0.0 "Bab", dated 2026-11-14.
- The account summary and the work table from Statement are not used; their files stay for Jalel to delete.

## Left to the builder

Exact Tailwind classes; how the arch clip is implemented (an SVG `clipPath` in object-bounding-box units is suggested); the dark-theme details the tokens do not settle; spacing at tablet widths; the share-card layout; anything the plan marks as the implementer's choice.
