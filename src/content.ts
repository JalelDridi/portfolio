// All copy for the site lives here, so wording can be reviewed in one place.

export const SITE_URL = "https://jaleldridi.vercel.app";

export const site = {
  version: "3.0.0",
  repo: "https://github.com/JalelDridi/portfolio",
};

export const profile = {
  name: "Mohamed Jalel Dridi",
  shortName: "Jalel Dridi",
  role: "Founding Engineer",
  headline: "Full-stack TypeScript, payments and reliability",
  availability: "Open to remote roles",
  location: "Bizerte, Tunisia · UTC+1",
  intro:
    "I build the parts of a product where money, reliability and trust meet. As founding engineer at Potluck, a US live-shopping marketplace, I own the Stripe Connect payments stack and the production infrastructure, and I built the realtime messaging system and the live-shopping product end to end.",
  facts: [
    "About two years' experience",
    "Fully remote with US teams since January 2026",
    "English C2 · French C1 · Arabic native",
  ],
  links: {
    github: "https://github.com/JalelDridi",
    linkedin: "https://www.linkedin.com/in/mohamed-jalel-dridi",
    email: "med.jalel.dridi@gmail.com",
    cv: "/Jalel_Dridi_CV.pdf",
  },
};

export const flagship = {
  name: "Payout Ledger",
  tagline: "An open-source payout monitor for marketplaces",
  summary:
    "Webhooks from a payment provider arrive twice, out of order, or not at all. Payout Ledger ingests them idempotently, records every money movement in a double-entry ledger that cannot go negative, reconciles against the provider, and alerts on failed or stuck payouts.",
  points: [
    {
      title: "Correct under concurrency",
      text: "25 payouts race for a balance that covers 10. Exactly 10 go through.",
    },
    {
      title: "Order does not matter",
      text: "Property-based tests deliver events in random orders. The end state is always the same.",
    },
    {
      title: "Enforced by the database",
      text: "Unbalanced transactions, overdrafts and edits to ledger rows are rejected by Postgres itself.",
    },
    {
      title: "Decisions written down",
      text: "Eight design records with the options considered and the trade-offs.",
    },
  ],
  stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Playwright"],
  demo: "https://payout-ledger-gamma.vercel.app",
  repo: "https://github.com/JalelDridi/payout-ledger",
  decisions:
    "https://github.com/JalelDridi/payout-ledger/tree/main/docs/decisions",
  video: {
    mp4: "/demo/payout-ledger.mp4",
    webm: "/demo/payout-ledger.webm",
    poster: "/demo/payout-ledger-poster.jpg",
    label:
      "Screen recording of the Payout Ledger demo: a dropped webhook is sent, the checks run, and reconciliation flags the mismatch",
  },
};

export type DiagramSpec = {
  /** Columns left to right; each holds the nodes stacked in it. */
  columns: { id: string; label: string; icon: IconName }[][];
  edges: [from: string, to: string][];
  caption: string;
};

export type IconName =
  | "user"
  | "server"
  | "database"
  | "card"
  | "webhook"
  | "shield"
  | "bell"
  | "radio"
  | "send"
  | "route"
  | "mail"
  | "message"
  | "chart"
  | "ticket"
  | "gift"
  | "video"
  | "git"
  | "rocket"
  | "check"
  | "layers"
  | "gateway"
  | "phone"
  | "box"
  | "activity";

/** A screenshot of a page anyone can open without logging in. */
export type Shot = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  frame: "browser" | "phone";
  /** Shown in the browser frame's address bar. */
  url?: string;
};

/** A short, silent screen recording. */
export type Clip = {
  mp4: string;
  webm: string;
  poster: string;
  label: string;
  caption: string;
  frame: "browser" | "phone";
  url?: string;
};

export type Project = {
  slug: string;
  title: string;
  company: string;
  year: string;
  /** One line for the card. */
  summary: string;
  why: string;
  built: string[];
  outcome?: string;
  stack: string[];
  links: { label: string; href: string }[];
  visual:
    | { kind: "image"; src: string; alt: string; width: number; height: number }
    | { kind: "diagram"; diagram: DiagramSpec };
  note?: string;
  /** Sections of a case study that covers several pieces of work. */
  parts?: {
    title: string;
    built: string[];
    outcome?: string;
    diagram?: DiagramSpec;
  }[];
  /** Older work, listed after an "Earlier" divider. */
  earlier?: boolean;
  /** Picture for the card and the top of the case study. */
  cover?: Shot;
  clip?: Clip;
  gallery?: Shot[];
};

export const projects: Project[] = [
  {
    slug: "potluck",
    cover: {
      src: "/work/potluck-how-it-works.jpg",
      alt: "Potluck's How it works page, with four steps for customers and four for chefs",
      caption:
        "How Potluck works: customers pay when they order, and the chef is paid after pickup.",
      width: 1440,
      height: 900,
      frame: "browser",
      url: "bigpotluck.com/how-it-works",
    },
    clip: {
      mp4: "/demo/potluck-mobile.mp4",
      webm: "/demo/potluck-mobile.webm",
      poster: "/demo/potluck-mobile-poster.jpg",
      label:
        "Screen recording of Potluck on a phone: scrolling the feed, opening a kitchen page, then a product page",
      caption:
        "Potluck on a phone: the feed, a kitchen page, then a product page.",
      frame: "phone",
    },
    gallery: [
      {
        src: "/work/potluck-item-phone.jpg",
        alt: "A product page on a phone: a chocolate chip cookie at five dollars, with pickup or delivery and an Add to cart button",
        caption:
          "A product page. The price shown is set on the server, never taken from the client.",
        width: 780,
        height: 1688,
        frame: "phone",
      },

      {
        src: "/work/potluck-live.jpg",
        alt: "The Live shows page on Potluck, listing upcoming shows",
        caption:
          "The public Live shows page, where viewers save a spot for an upcoming show.",
        width: 1440,
        height: 900,
        frame: "browser",
        url: "bigpotluck.com/live",
      },

      {
        src: "/work/potluck-kitchen-phone.jpg",
        alt: "The same kitchen page on a phone",
        caption: "The same page on a phone, where most buyers are.",
        width: 780,
        height: 1688,
        frame: "phone",
      },
    ],
    title: "Potluck",
    company: "Potluck",
    year: "2026",
    summary:
      "Founding engineer: the Stripe Connect payments stack, the live-shopping product, realtime messaging and the release pipeline of a US live-shopping marketplace.",
    why: "Potluck is a US marketplace where home bakers sell on camera. I joined as its founding engineer in June 2026 and own the parts with the least room for error: payments, production infrastructure and the realtime systems.",
    built: [],
    parts: [
      {
        title: "Payments on Stripe Connect",
        built: [
          "An order is marked paid only after the payment is verified server-side against Stripe, with inventory decremented exactly once.",
          "Checkout validation that rejects client-supplied prices, items no longer on sale and quantities above stock, covered by a suite of attack tests.",
          "Alerts for failed and stuck payouts.",
          "A daily reconciliation of the database against Stripe that classifies every mismatch by cause.",
        ],
        outcome:
          "Payout Ledger is a from-scratch public rebuild of these ideas. It shares no code with Potluck.",
        diagram: {
          columns: [
            [
              { id: "checkout", label: "Checkout", icon: "card" },
              { id: "webhooks", label: "Stripe webhooks", icon: "webhook" },
            ],
            [{ id: "verify", label: "Server verification", icon: "shield" }],
            [
              { id: "order", label: "Order and stock", icon: "box" },
              { id: "recon", label: "Reconciliation", icon: "activity" },
              { id: "alerts", label: "Payout alerts", icon: "bell" },
            ],
          ],
          edges: [
            ["checkout", "verify"],
            ["webhooks", "verify"],
            ["verify", "order"],
            ["verify", "recon"],
            ["verify", "alerts"],
          ],
          caption:
            "Nothing the client sends is trusted: the server verifies with Stripe before an order is paid.",
        },
      },
      {
        title: "Potluck LIVE",
        built: [
          "A public sign-up page per show, with one-field, phone-only signup.",
          "A token ledger kept entirely on the server (earn, spend, referrals) whose balances can never go negative.",
          "Show scheduling, a pre-show console for hosts, live sign-up analytics, giveaways and an admin console.",
        ],
        outcome:
          "Shipped to production through idempotent migrations, with headless test suites covering the flows.",
        diagram: {
          columns: [
            [{ id: "signup", label: "Show sign-up", icon: "phone" }],
            [{ id: "ledger", label: "Token ledger", icon: "ticket" }],
            [
              { id: "console", label: "Host console", icon: "video" },
              { id: "giveaway", label: "Giveaways", icon: "gift" },
              { id: "analytics", label: "Live analytics", icon: "chart" },
            ],
          ],
          edges: [
            ["signup", "ledger"],
            ["ledger", "console"],
            ["ledger", "giveaway"],
            ["ledger", "analytics"],
          ],
          caption:
            "Sign-ups earn tokens in a server-only ledger that feeds the show console, giveaways and analytics.",
        },
      },
      {
        title: "Realtime messaging",
        built: [
          "PostgreSQL is the system of record; messages are mirrored by the server to a realtime database.",
          "Clients are read-only, using short-lived tokens that carry the threads the user belongs to.",
          "Per-order threads, system messages at order events, pre-purchase direct messages and admin oversight.",
        ],
        outcome: "About 750 ms from send to display across browsers.",
        diagram: {
          columns: [
            [{ id: "sender", label: "Sender", icon: "user" }],
            [{ id: "api", label: "API server", icon: "server" }],
            [
              { id: "pg", label: "PostgreSQL", icon: "database" },
              { id: "rtdb", label: "Realtime mirror", icon: "radio" },
            ],
            [{ id: "reader", label: "Read-only client", icon: "message" }],
          ],
          edges: [
            ["sender", "api"],
            ["api", "pg"],
            ["api", "rtdb"],
            ["rtdb", "reader"],
          ],
          caption:
            "Writes go through the server to Postgres; clients only ever read the mirror.",
        },
      },
      {
        title: "Infrastructure and release pipeline",
        built: [
          "Postgres with backups, object storage with scoped permissions, and TLS.",
          "Push-to-main auto-deploy that confirms the new version is serving before it runs migrations.",
          "A Playwright visual and accessibility suite behind a 25-check smoke test.",
          "Performance work: self-hosted fonts and a server-rendered first feed image removed 5.7 to 8.1 seconds of LCP load delay.",
        ],
        outcome:
          "I also lead release engineering: cutting releases, reviewing PRs, setting review conventions and onboarding new engineers.",
        diagram: {
          columns: [
            [{ id: "push", label: "Push to main", icon: "git" }],
            [{ id: "deploy", label: "Build and deploy", icon: "rocket" }],
            [{ id: "version", label: "Version check", icon: "check" }],
            [
              { id: "migrate", label: "Migrations", icon: "database" },
              { id: "smoke", label: "Smoke tests", icon: "shield" },
            ],
          ],
          edges: [
            ["push", "deploy"],
            ["deploy", "version"],
            ["version", "migrate"],
            ["version", "smoke"],
          ],
          caption:
            "Migrations only run once the new version is confirmed to be serving.",
        },
      },
    ],
    stack: [
      "Stripe Connect",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Playwright",
      "Firebase Realtime Database",
    ],
    links: [
      { label: "Potluck", href: "https://www.bigpotluck.com" },
      {
        label: "Payout Ledger, the public rebuild",
        href: "https://payout-ledger-gamma.vercel.app",
      },
      {
        label: "Live shows on Potluck",
        href: "https://www.bigpotluck.com/live",
      },
    ],
    visual: {
      kind: "diagram",
      diagram: {
        columns: [
          [
            { id: "checkout", label: "Checkout", icon: "card" },
            { id: "webhooks", label: "Stripe webhooks", icon: "webhook" },
          ],
          [{ id: "verify", label: "Server verification", icon: "shield" }],
          [
            { id: "order", label: "Order and stock", icon: "box" },
            { id: "recon", label: "Reconciliation", icon: "activity" },
            { id: "alerts", label: "Payout alerts", icon: "bell" },
          ],
        ],
        edges: [
          ["checkout", "verify"],
          ["webhooks", "verify"],
          ["verify", "order"],
          ["verify", "recon"],
          ["verify", "alerts"],
        ],
        caption:
          "Nothing the client sends is trusted: the server verifies with Stripe before an order is paid.",
      },
    },
  },
  {
    slug: "tnpay",
    title: "tnpay",
    company: "Open source",
    year: "2026",
    summary:
      "Typed SDKs for Tunisia's payment gateways, with webhook handlers that verify before they act.",
    why: "Tunisia's online payments reached 19 million transactions in 2025, through about a thousand sites. More than 600 public repositories integrate Konnect or Flouci by hand, and the only JavaScript package for either had 32 downloads a month. Both gateways notify a shop with an unsigned GET that anyone could forge. tnpay makes the safe integration the easy one.",
    built: [
      "Typed clients for Konnect and Flouci: create a payment, read it back, refund it.",
      "A webhook handler that takes only the reference from the request, fetches the payment from the gateway, and runs your code once per payment however many times the webhook is delivered.",
      "A fake Konnect and a fake Flouci, in-process, so tests and local development need no account.",
      "Runs on Node 20+ and edge runtimes; one function serves as a Next.js route handler.",
    ],
    outcome:
      "Three packages on npm, 75 tests including a property test that delivers webhooks in random orders, a live checkout demo on the Konnect sandbox, and two bugs found and fixed against the real API.",
    stack: ["TypeScript", "Node.js", "Vitest", "fast-check", "Next.js"],
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/JalelDridi/tnpay",
      },
      { label: "Checkout demo", href: "https://tnpay-demo.vercel.app" },
      {
        label: "@tnpay/konnect on npm",
        href: "https://www.npmjs.com/package/@tnpay/konnect",
      },
    ],
    visual: {
      kind: "diagram",
      diagram: {
        columns: [
          [{ id: "shop", label: "Your checkout", icon: "card" }],
          [
            { id: "konnect", label: "Konnect", icon: "webhook" },
            { id: "flouci", label: "Flouci", icon: "webhook" },
          ],
          [{ id: "verify", label: "Verify by lookup", icon: "shield" }],
          [{ id: "once", label: "onPaid, once", icon: "check" }],
        ],
        edges: [
          ["shop", "konnect"],
          ["shop", "flouci"],
          ["konnect", "verify"],
          ["flouci", "verify"],
          ["verify", "once"],
        ],
        caption:
          "The webhook proves nothing on its own: the handler asks the gateway, then acts once.",
      },
    },
  },
  {
    slug: "deal-grader",
    cover: {
      src: "/work/deal-grader-report.jpg",
      alt: "A Deal Grader report: a score of 77 out of 100 labelled Strong Exit, a score breakdown, price against the market, and nearby off-market deals",
      caption:
        "A public report page. The score updates live as the price and down payment sliders move.",
      width: 1440,
      height: 900,
      frame: "browser",
      url: "grade.offa.com/report",
    },
    clip: {
      mp4: "/demo/deal-grader.mp4",
      webm: "/demo/deal-grader.webm",
      poster: "/demo/deal-grader-poster.jpg",
      label:
        "Screen recording scrolling through a Deal Grader report: score, value estimate, rental income, financing calculator, neighbourhood data and nearby deals",
      caption:
        "Scrolling through a public report: score, value estimate, rental income, financing, neighbourhood and nearby deals.",
      frame: "browser",
      url: "grade.offa.com/report",
    },
    gallery: [
      {
        src: "/work/deal-grader-financing.jpg",
        alt: "The financing calculator and neighbourhood profile sections of a Deal Grader report",
        caption:
          "Financing calculator with live monthly cash flow, above the neighbourhood profile.",
        width: 1440,
        height: 900,
        frame: "browser",
        url: "grade.offa.com/report",
      },
      {
        src: "/work/deal-grader-nearby.jpg",
        alt: "A grid of nearby off-market property listings with photos, prices and after-repair values",
        caption: "Nearby off-market deals, pulled from live marketplace data.",
        width: 1440,
        height: 900,
        frame: "browser",
        url: "grade.offa.com/report",
      },
    ],
    title: "Deal Grader",
    company: "Offa.com",
    year: "2026",
    summary:
      "A public tool that scores any US real-estate deal in about 30 seconds.",
    why: "A free public tool that scores a US real-estate deal in about 30 seconds, built to bring investors to Offa's marketplace.",
    built: [
      "Interactive underwriting inputs with a score that updates as you type.",
      "Address autocomplete and a map of nearby off-market listings, connected to live marketplace data.",
      "Shareable report pages that search engines can index.",
      "Hardened for a public launch: it degrades gracefully when a data source is down, blocks abuse and validates US addresses.",
    ],
    stack: ["React", "TypeScript", "Node.js", "Google Places API", "AWS"],
    links: [
      { label: "Open Deal Grader", href: "https://grade.offa.com" },
      { label: "Offa.com", href: "https://offa.com" },
    ],
    visual: {
      kind: "image",
      src: "/work/deal-grader.png",
      alt: "The Deal Grader page: a form asking for a property address, price, beds and baths, with a Grade This Deal button",
      width: 1440,
      height: 900,
    },
  },
  {
    slug: "kora",
    cover: {
      src: "/work/kora-chkoun.png",
      alt: "Chkoun?, Kora's daily puzzle, in French: a grid of guesses with some fields revealed",
      caption: "Chkoun?, the daily puzzle, in French.",
      width: 1280,
      height: 1306,
      frame: "browser",
      url: "kora-tn.vercel.app/fr/chkoun",
    },
    title: "Kora",
    company: "Open source · side project",
    year: "2026",
    summary:
      "A daily guess-the-footballer game for Tunisia, in Arabic, French and English, with its own data pipeline.",
    why: "Daily sports puzzles exist for the big leagues and not for Tunisian football. Kora is a hub of small daily games about the national team and Ligue 1, built to have real Tunisian players, not just code.",
    built: [
      "Chkoun?, a daily guess-the-footballer puzzle in Arabic, French and English, with a result card, a share grid and streaks.",
      "A data pipeline from Wikidata, English and French Wikipedia and Wikimedia Commons, with provenance and a confidence level for every field, synced into Postgres on deploy.",
      "A nightly workflow that proposes a data pull request, an admin calendar, and Sources and privacy pages.",
      "More than a thousand automated tests across unit, database and browser suites, with a Lighthouse budget in CI.",
    ],
    outcome: "Live since 6 October 2026, with a new puzzle every day.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Playwright"],
    links: [
      { label: "Play Kora", href: "https://kora-tn.vercel.app" },
      { label: "Source on GitHub", href: "https://github.com/JalelDridi/kora" },
    ],
    visual: {
      kind: "image",
      src: "/work/kora-chkoun.png",
      alt: "Chkoun?, Kora's daily puzzle, in French: a grid of guesses with some fields revealed",
      width: 1280,
      height: 1306,
    },
  },
  {
    slug: "spyder",
    title: "Spyder",
    company: "Offa.com",
    year: "2026",
    summary:
      "A multi-provider SMS and email platform sending 14,000+ messages a week.",
    why: "A multi-provider SMS and email platform that replaced part of Offa's dependence on its CRM for outbound campaigns.",
    built: [
      "Routing across several providers, with failover when one has delivery problems.",
      "Contact management and campaign sends with attribution.",
      "Automated triage of delivery failures.",
    ],
    outcome:
      "14,000+ messages a week at 99.99% delivery reliability, with 35% less CRM dependency and 20% lower delivery cost.",
    stack: ["NestJS", "Prisma", "PostgreSQL", "React"],
    links: [{ label: "Offa.com", href: "https://offa.com" }],
    visual: {
      kind: "diagram",
      diagram: {
        columns: [
          [{ id: "campaign", label: "Campaign", icon: "send" }],
          [{ id: "router", label: "Provider router", icon: "route" }],
          [
            { id: "sms1", label: "SMS provider", icon: "message" },
            { id: "sms2", label: "Failover provider", icon: "message" },
            { id: "email", label: "Email provider", icon: "mail" },
          ],
          [{ id: "triage", label: "Delivery triage", icon: "activity" }],
        ],
        edges: [
          ["campaign", "router"],
          ["router", "sms1"],
          ["router", "sms2"],
          ["router", "email"],
          ["sms1", "triage"],
          ["sms2", "triage"],
          ["email", "triage"],
        ],
        caption:
          "Messages are routed across providers, with failover and automated triage of failures.",
      },
    },
  },
  {
    slug: "inspection-platform",
    earlier: true,
    title: "Field-inspection platform",
    company: "Pearls Consulting",
    year: "2025",
    summary:
      "A web and mobile inspection platform, deployed to Kubernetes through GitLab CI/CD.",
    why: "My end-of-studies project: a full-stack platform for running field inspections, with a web app and a mobile app.",
    built: [
      "The web application in Laravel 12 and React with TypeScript, and the mobile app in React Native.",
      "GitLab CI/CD pipelines that deploy to Kubernetes.",
      "Infrastructure provisioned with Terraform.",
      "Observability with Prometheus and Grafana.",
    ],
    stack: [
      "Laravel",
      "React",
      "React Native",
      "Kubernetes",
      "Terraform",
      "GitLab CI/CD",
    ],
    links: [],
    visual: {
      kind: "diagram",
      diagram: {
        columns: [
          [{ id: "ci", label: "GitLab CI/CD", icon: "git" }],
          [{ id: "k8s", label: "Kubernetes", icon: "layers" }],
          [
            { id: "web", label: "Web app", icon: "server" },
            { id: "mobile", label: "Mobile API", icon: "phone" },
          ],
          [{ id: "obs", label: "Prometheus, Grafana", icon: "chart" }],
        ],
        edges: [
          ["ci", "k8s"],
          ["k8s", "web"],
          ["k8s", "mobile"],
          ["web", "obs"],
          ["mobile", "obs"],
        ],
        caption:
          "Pipelines deploy to Kubernetes on infrastructure defined in Terraform.",
      },
    },
  },
  {
    slug: "event-orchestrator",
    earlier: true,
    title: "Event Orchestrator",
    company: "ESPRIT · team project",
    year: "2024",
    summary:
      "An event-management platform built as Spring Boot microservices with Kafka and Kubernetes.",
    why: "A university team project: an event-management platform built as microservices, to learn how a distributed system is put together and deployed.",
    built: [
      "Spring Boot services behind an API gateway, with service discovery and a central configuration server.",
      "Real-time notifications through Apache Kafka.",
      "An Angular frontend, with Docker Compose and Kubernetes manifests for deployment.",
    ],
    note: "Built by a team of six. The repository is public.",
    stack: ["Spring Boot", "Angular", "Kafka", "Docker", "Kubernetes"],
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/JalelDridi/pi-event-management-application",
      },
    ],
    visual: {
      kind: "diagram",
      diagram: {
        columns: [
          [{ id: "ui", label: "Angular app", icon: "user" }],
          [{ id: "gw", label: "API gateway", icon: "gateway" }],
          [
            { id: "events", label: "Event service", icon: "server" },
            { id: "users", label: "User service", icon: "server" },
          ],
          [{ id: "kafka", label: "Kafka notifications", icon: "bell" }],
        ],
        edges: [
          ["ui", "gw"],
          ["gw", "events"],
          ["gw", "users"],
          ["events", "kafka"],
        ],
        caption: "Services sit behind a gateway and notify through Kafka.",
      },
    },
  },
];

export const skills = [
  {
    group: "Languages",
    items: ["TypeScript", "JavaScript", "PHP", "Python", "Java"],
  },
  {
    group: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "Redis",
      "WebSockets",
      "Laravel",
    ],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "React Native", "Tailwind CSS"],
  },
  {
    group: "Payments",
    items: ["Stripe", "Stripe Connect", "Webhooks", "Reconciliation"],
  },
  {
    group: "Cloud and DevOps",
    items: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "GitLab CI/CD",
    ],
  },
  {
    group: "Quality",
    items: ["Playwright", "Vitest", "Sentry", "Prometheus", "Grafana"],
  },
];

/** The hero's account summary: one row per project, each value from the CV or the repo. */
export const ledger = {
  title: "Account summary",
  asOf: "as of today",
  rows: [
    {
      name: "Payout Ledger",
      detail: "Open-source payout monitor with a live demo",
      value: "99 tests · 8 design records",
      href: flagship.repo,
    },
    {
      name: "tnpay",
      detail: "Typed SDKs for Tunisia's payment gateways",
      value: "3 packages on npm · 75 tests",
      href: "https://github.com/JalelDridi/tnpay",
    },
    {
      name: "Kora",
      detail: "Daily football puzzle in Arabic, French and English",
      value: "live every day since 6 Oct 2026",
      href: "https://kora-tn.vercel.app",
    },
    {
      name: "Spyder",
      detail: "Multi-provider messaging platform at Offa.com",
      value: "14,000+ messages a week · 99.99% delivered",
      href: "/work/spyder",
    },
    {
      name: "Potluck",
      detail: "Stripe Connect payments stack and production infrastructure",
      value: "owned since Jun 2026",
      href: "https://www.bigpotluck.com",
    },
  ] as { name: string; detail: string; value: string; href?: string }[],
  total: { label: profile.availability, value: "Bizerte · UTC+1" },
};

export const experience = [
  {
    role: "Founding Engineer",
    company: "Potluck",
    href: "https://www.bigpotluck.com",
    detail: "US live-shopping marketplace · fully remote",
    period: "Jun 2026 – present",
    summary:
      "Own the Stripe Connect payments stack and production infrastructure. Built the live-shopping product and realtime messaging. Lead releases for a three-person team.",
  },
  {
    role: "Software Engineer",
    company: "Offa.com",
    href: "https://offa.com",
    detail: "US real-estate marketplace · fully remote",
    period: "Jan 2026 – Jun 2026",
    summary:
      "Built and launched Deal Grader and Spyder, a multi-provider messaging platform. Replaced polling with WebSocket notifications.",
  },
  {
    role: "Software Engineer, end-of-studies internship",
    company: "Pearls Consulting",
    detail: "Tunis",
    period: "Feb 2025 – Aug 2025",
    summary:
      "Built a field-inspection platform in Laravel, React and React Native, with CI/CD to Kubernetes and Terraform.",
  },
  {
    role: "DevOps & Web Consultant, part-time",
    company: "Pearls Consulting",
    detail: "Tunis · alongside studies",
    period: "Jul 2024 – Jan 2025",
    summary:
      "Laravel deployments with 30% better uptime; CI/CD automation that cut manual deploys by 60%.",
  },
];

export const education =
  "Engineering degree in Computer Science (IT Architecture & Cloud Computing), ESPRIT, Tunis, 2025.";

/** The personal section. Every sentence here is Jalel's to approve. */
export const about = {
  title: "From keeping servers up to moving money",
  portrait: {
    src: "/me/portrait.jpg",
    alt: "Mohamed Jalel Dridi, smiling, in a navy suit and glasses",
    width: 460,
    height: 460,
  },
  paragraphs: [
    "I started on the infrastructure side. After two years of preparatory classes at IPEI El Manar I studied IT architecture and cloud computing at ESPRIT in Tunis, and my first paid work was at Pearls Consulting: deploying Laravel applications, automating releases, then building a field-inspection platform and the Kubernetes pipeline that shipped it.",
    "In January 2026 I joined the team behind Offa.com, a US real-estate marketplace, and moved from running software to building products: first Deal Grader, then Spyder. In June I followed the same founding team to Potluck as its founding engineer, and took on the part with the least room for error: the payments.",
    "The infrastructure habit stayed. I ask what happens when a webhook is late, a deploy stops halfway or two requests race for one balance, and I would rather have the database refuse a wrong state than trust every caller to avoid it. Payout Ledger is that habit, written down in public.",
  ],
  facts: [
    { label: "Based in", value: "Bizerte, on Tunisia's north coast" },
    {
      label: "Working",
      value: "Fully remote with US teams since January 2026",
    },
    { label: "Speaks", value: "Arabic, English and French" },
    { label: "Studied", value: "IT architecture and cloud computing, ESPRIT" },
    { label: "Hours", value: "Flexible: I adapt to the team's time zone." },
    {
      label: "Hiring setup",
      value: "Contractor or employer of record; no visa sponsorship needed.",
    },
  ],
  /** The caption under the portrait. */
  figure: { label: "fig. 1 · Bizerte", coordinates: "37°16′N 9°52′E" },
  clocksCaption: "The time right now at home and across the United States.",
  /** Shown as analogue clocks. The first is home. */
  clocks: [
    { city: "Bizerte", zone: "Africa/Tunis" },
    { city: "New York", zone: "America/New_York" },
    { city: "Chicago", zone: "America/Chicago" },
    { city: "San Francisco", zone: "America/Los_Angeles" },
  ],
};

/** Roles outside engineering, as listed on the CV. */
export const leadership = {
  title: "Leading outside of code",
  intro:
    "Since 2022 I have helped run the El Alia chapter of JCI, Junior Chamber International, a worldwide network of young people who organise projects in their own towns. This year I am its president.",
  organisation: {
    name: "JCI El Alia",
    detail: "Local chapter of Junior Chamber International · Bizerte, Tunisia",
    href: "https://www.facebook.com/jcielalia",
    linkLabel: "JCI El Alia on Facebook",
  },
  roles: [
    { year: "2022", role: "Secretary General" },
    { year: "2024", role: "Vice-President" },
    { year: "2026", role: "President" },
  ],
  /** From the chapter's public posts in 2026. */
  activity: {
    label: "The chapter in 2026",
    items: [
      "A career event, Unlock Your Career",
      "A three-day train-the-trainers course",
      "The Coupe El Alia football tournament",
      "A forum on creativity and branding",
    ],
  },
  also: [
    {
      role: "Marketing Manager",
      organisation: "Inceptum Junior Enterprise, ESPRIT",
    },
  ],
  bridge:
    "It is the same job as leading releases at Potluck: agree a plan, split the work, keep people informed and make sure it ships.",
};
