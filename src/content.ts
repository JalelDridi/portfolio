// All copy for the site lives here, so wording can be reviewed in one place.

export const SITE_URL = "https://jaleldridi.vercel.app";

export const profile = {
  name: "Mohamed Jalel Dridi",
  headline:
    "Founding Engineer · Full-Stack TypeScript · Payments & Reliability",
  availability: "Open to remote roles",
  location: "Bizerte, Tunisia (UTC+1)",
  intro: [
    "I'm a full-stack engineer working in TypeScript across Next.js, NestJS and PostgreSQL. As founding engineer at Potluck, a US live-shopping marketplace, I own the Stripe Connect payments stack and the production infrastructure, and I built the realtime messaging system and the live-shopping product end to end.",
    "My work sits where money, reliability and trust meet. I have about two years' experience and have worked fully remote with US teams since January 2026.",
  ],
  links: {
    github: "https://github.com/JalelDridi",
    linkedin: "https://www.linkedin.com/in/mohamed-jalel-dridi",
    email: "med.jalel.dridi@gmail.com",
  },
};

export const flagship = {
  name: "Payout Ledger",
  tagline: "An open-source payout monitor for marketplaces",
  summary:
    "Webhooks from a payment provider arrive twice, out of order, or not at all. Payout Ledger ingests them idempotently, records every money movement in a double-entry ledger that cannot go negative, reconciles against the provider, and alerts on failed or stuck payouts. The live demo has a simulator, so you can send it each kind of failure and watch what it catches.",
  points: [
    "Balances stay correct under concurrent writes: 25 payouts racing for a balance that covers 10, and exactly 10 go through.",
    "Any delivery order reaches the same final state, proven with property-based tests.",
    "The ledger's rules are enforced by the database itself, not only by application code.",
    "Eight design decisions written up with the options considered and the trade-offs.",
  ],
  stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Playwright"],
  demo: "https://payout-ledger-gamma.vercel.app",
  repo: "https://github.com/JalelDridi/payout-ledger",
  image: {
    src: "/payout-ledger.png",
    alt: "The Payout Ledger dashboard: summary tiles, six simulator scenarios, open alerts and a reconciliation mismatch",
  },
};

export type CaseStudy = {
  title: string;
  context: string;
  why: string;
  built: string[];
  outcome?: string;
  stack: string[];
  link?: { label: string; href: string };
};

export const caseStudies: CaseStudy[] = [
  {
    title: "Deal Grader",
    context: "Offa.com · US real-estate marketplace · 2026",
    why: "A free public tool that scores a US real-estate deal in about 30 seconds, built to bring investors to Offa's marketplace.",
    built: [
      "Interactive underwriting inputs with a score that updates as you type.",
      "Address autocomplete and a map of nearby off-market listings, connected to live marketplace data.",
      "Shareable report pages that search engines can index.",
      "Hardened for a public launch: it degrades gracefully when a data source is down, blocks abuse and validates US addresses.",
    ],
    stack: ["React", "TypeScript", "Node.js", "Google Places API", "AWS"],
    link: { label: "grade.offa.com", href: "https://grade.offa.com" },
  },
  {
    title: "Potluck LIVE",
    context: "Potluck · US live-shopping marketplace · 2026",
    why: "The company's live-shopping product, which I built end to end.",
    built: [
      "A public sign-up page per show, with one-field, phone-only signup.",
      "A token ledger kept entirely on the server (earn, spend, referrals) whose balances can never go negative.",
      "Show scheduling, a pre-show console for hosts, live sign-up analytics, giveaways and an admin console.",
    ],
    outcome:
      "Shipped to production through idempotent migrations, with headless test suites covering the flows.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Playwright"],
  },
  {
    title: "Payments on Stripe Connect",
    context: "Potluck · 2026",
    why: "I own the payments stack: checkout, transfers, payouts, webhooks and reconciliation. In a marketplace, every one of those has to be right for both the buyer and the seller.",
    built: [
      "An order is marked paid only after the payment is verified server-side against Stripe, with inventory decremented exactly once.",
      "Checkout validation that rejects client-supplied prices, items no longer on sale and quantities above stock, covered by a suite of attack tests.",
      "Alerts for failed and stuck payouts.",
      "A daily reconciliation of the database against Stripe that classifies every mismatch by cause.",
    ],
    outcome:
      "Payout Ledger, above, is a from-scratch public rebuild of these ideas. It shares no code with Potluck.",
    stack: ["Stripe Connect", "Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    title: "Realtime messaging",
    context: "Potluck · 2026",
    why: "Buyers and sellers needed to talk before and after an order, in real time, without the client ever being trusted with write access.",
    built: [
      "PostgreSQL is the system of record; messages are mirrored by the server to a realtime database.",
      "Clients are read-only, using short-lived tokens that carry the threads the user belongs to.",
      "Per-order threads, system messages at order events, pre-purchase direct messages and admin oversight.",
    ],
    outcome: "About 750 ms from send to display across browsers.",
    stack: [
      "PostgreSQL",
      "Firebase Realtime Database",
      "Next.js",
      "TypeScript",
    ],
  },
  {
    title: "Spyder",
    context: "Offa.com · 2026",
    why: "A multi-provider SMS and email platform that replaced part of Offa's dependence on its CRM for outbound campaigns.",
    built: [
      "Routing across several providers, with failover when one has delivery problems.",
      "Contact management and campaign sends with attribution.",
      "Automated triage of delivery failures.",
    ],
    outcome:
      "14,000+ messages a week at 99.99% delivery reliability, with 35% less CRM dependency and 20% lower delivery cost.",
    stack: ["NestJS", "Prisma", "PostgreSQL", "React"],
  },
];

export const experience = [
  {
    role: "Founding Engineer",
    company: "Potluck",
    detail: "US live-shopping marketplace · fully remote",
    period: "Jun 2026 – present",
  },
  {
    role: "Software Engineer",
    company: "Offa.com",
    detail: "US real-estate marketplace · fully remote",
    period: "Jan 2026 – Jun 2026",
  },
  {
    role: "Software Engineer, end-of-studies internship",
    company: "Pearls Consulting",
    detail: "Tunis · Laravel, React, Kubernetes, Terraform, GitLab CI/CD",
    period: "Feb 2025 – Aug 2025",
  },
  {
    role: "DevOps & Web Consultant, part-time",
    company: "Pearls Consulting",
    detail: "Tunis · alongside studies",
    period: "Jul 2024 – Jan 2025",
  },
];

export const education =
  "Engineering degree in Computer Science (IT Architecture & Cloud Computing), ESPRIT, Tunis, 2025. Arabic (native), English (C2), French (C1).";
