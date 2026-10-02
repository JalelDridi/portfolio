// Short articles, each drawn from a design record in the Payout Ledger
// repository. Like the rest of the copy, the wording is Jalel's to approve.

const REPO = "https://github.com/JalelDridi/payout-ledger/blob/main";

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: { lead: string; text: string }[] }
  | { kind: "code"; language: string; code: string; caption?: string };

export type Article = {
  slug: string;
  title: string;
  summary: string;
  /** ISO date, shown on the page and in the sitemap. */
  date: string;
  minutes: number;
  tags: string[];
  blocks: Block[];
  links: { label: string; href: string }[];
};

export const articles: Article[] = [
  {
    slug: "twenty-five-payouts-a-balance-for-ten",
    title: "Twenty-five payouts, a balance that covers ten",
    summary:
      "How Payout Ledger stops a seller's balance going negative when requests race, and why the database gets the last word.",
    date: "2026-10-02",
    minutes: 3,
    tags: ["PostgreSQL", "Concurrency", "Ledgers"],
    blocks: [
      {
        kind: "p",
        text: "Two requests try to pay out the same seller at the same moment. Both read a balance of 100, both decide that 80 is affordable, and both write. The account ends at -60. Nothing crashed and nothing was logged. The money is simply wrong.",
      },
      {
        kind: "p",
        text: "Payout Ledger is my open-source payout monitor, and its ledger has one rule above the others: a balance never goes below zero, however requests interleave. This is how I chose to enforce it.",
      },
      { kind: "h2", text: "Three ways to do it" },
      {
        kind: "list",
        items: [
          {
            lead: "Row locks.",
            text: "Inside one transaction, lock the accounts involved, check the funds, write the entries. A second writer waits for the first to commit, then sees the new balance. The cost: writers on one account queue up, and locks taken in an inconsistent order can deadlock.",
          },
          {
            lead: "SERIALIZABLE isolation with retry.",
            text: "Let Postgres detect conflicting transactions and abort one; the application retries. The cost: every write path needs a retry loop, aborts rise under contention, and failures are harder to reason about.",
          },
          {
            lead: "Constraints only.",
            text: 'Take no locks and let a CHECK on the balance reject the losing write. It is correct, but the loser gets a constraint error instead of a clean "insufficient funds", and the check happens late.',
          },
        ],
      },
      {
        kind: "p",
        text: "One fact narrowed the field. The app runs on serverless functions and reaches Postgres through a pooler in transaction mode, so session-level advisory locks are out: two consecutive statements may land on different connections. Whatever I chose had to live inside a single transaction.",
      },
      { kind: "h2", text: "What I chose" },
      {
        kind: "p",
        text: "Row locks, with the constraint kept underneath as a safety net. Before writing, the application locks the affected accounts in a fixed order:",
      },
      {
        kind: "code",
        language: "TypeScript",
        caption: "src/ledger/post.ts",
        code: `// Lock in a fixed order (by ID) so two transactions touching the same
// accounts can never wait on each other in a cycle.
const accounts = await tx.$queryRaw<LockedAccount[]>\`
  SELECT id, code, balance, allow_negative
    FROM accounts
   WHERE code = ANY(\${codes})
   ORDER BY id
     FOR UPDATE\`;`,
      },
      {
        kind: "p",
        text: "The ordering is what prevents deadlocks. Two transactions that touch the same pair of accounts always ask for them in the same sequence, so neither can hold one lock while waiting for the other's.",
      },
      {
        kind: "p",
        text: "Underneath sits the database's own rule. Each account's balance is maintained by a trigger on the ledger entries, so it cannot drift from them, and a constraint refuses an overdraft:",
      },
      {
        kind: "code",
        language: "SQL",
        caption: "The first migration",
        code: `-- An account's balance may only go negative if explicitly allowed.
ALTER TABLE "accounts"
  ADD CONSTRAINT "accounts_balance_non_negative"
  CHECK ("allow_negative" OR "balance" >= 0);`,
      },
      {
        kind: "p",
        text: "If application code forgets to lock, the constraint still holds. Correctness does not depend on every caller being right.",
      },
      { kind: "h2", text: "Proving it" },
      {
        kind: "p",
        text: "The test runs against a real Postgres, not a mock. It funds a seller with 1,000 and fires 25 concurrent attempts to spend 100:",
      },
      {
        kind: "code",
        language: "TypeScript",
        caption: "src/db/invariants.db.test.ts",
        code: `// 25 concurrent attempts to spend 100 from a balance of 1000.
const results = await Promise.allSettled(
  Array.from({ length: 25 }, () =>
    post(db, [
      { accountId: seller, amount: -100n },
      { accountId: external, amount: 100n },
    ]),
  ),
);

const succeeded = results.filter((r) => r.status === "fulfilled").length;
expect(succeeded).toBe(10);
expect(await balanceOf(seller)).toBe(0n);`,
      },
      {
        kind: "p",
        text: "Exactly ten go through and the balance ends at zero.",
      },
      { kind: "h2", text: "What it costs" },
      {
        kind: "p",
        text: "Writes to one account are serial. That is acceptable here, because contention is per seller, not global: one seller's payouts wait for each other, and nobody else's do.",
      },
    ],
    links: [
      {
        label: "The design record",
        href: `${REPO}/docs/decisions/0003-concurrency-row-locks-with-constraint-backstop.md`,
      },
      { label: "The test", href: `${REPO}/src/db/invariants.db.test.ts` },
      { label: "The posting code", href: `${REPO}/src/ledger/post.ts` },
    ],
  },
  {
    slug: "webhooks-in-any-order",
    title: "Webhooks arrive in any order. The end state should not care.",
    summary:
      "Two kinds of out-of-order delivery in a payments system, and the two rules Payout Ledger uses to end in the same place every time.",
    date: "2026-10-02",
    minutes: 4,
    tags: ["Webhooks", "Stripe", "State machines"],
    blocks: [
      {
        kind: "p",
        text: "Stripe does not guarantee the order in which it delivers events. A payout.paid can arrive before the payout.created it follows, and a delayed payout.updated can arrive after payout.failed. Apply events as they come and a stale one overwrites a newer state.",
      },
      {
        kind: "p",
        text: "In Payout Ledger, my open-source payout monitor, I treated this as two separate problems, because it is: disorder inside one object, and disorder between objects.",
      },
      { kind: "h2", text: "Inside one payout: only move forward" },
      {
        kind: "list",
        items: [
          {
            lead: "Order by the event's timestamp.",
            text: "Ignore any event older than the last one applied. But the timestamps have one-second resolution, so two events in the same second cannot be ordered.",
          },
          {
            lead: "Refetch the object from Stripe.",
            text: "Treat the event as a signal and read the current state from the API. Always correct for real objects, but it costs an API call per event and cannot work for simulated events, which have no object behind them.",
          },
          {
            lead: "A one-way state machine.",
            text: "An event may only move a payout forward; anything else is recorded and skipped. The cost: the allowed transitions are defined and kept correct by hand.",
          },
        ],
      },
      {
        kind: "p",
        text: "I chose the state machine. The whole of it fits on a screen:",
      },
      {
        kind: "code",
        language: "TypeScript",
        caption: "src/payouts/transitions.ts",
        code: `const NEXT: Record<PayoutStatus, readonly PayoutStatus[]> = {
  pending: ["in_transit", "paid", "failed", "canceled"],
  in_transit: ["paid", "failed", "canceled"],
  paid: ["failed"],
  failed: [],
  canceled: [],
};

export function canTransition(from: PayoutStatus, to: PayoutStatus): boolean {
  return NEXT[from].includes(to);
}`,
      },
      {
        kind: "p",
        text: "An event for a payout that does not exist yet creates it in the state the event describes, so a late payout.created is a no-op, not an error. Skipped events stay in the inbox, so nothing is lost.",
      },
      {
        kind: "p",
        text: 'There is one exception to "forward only", and it is Stripe\'s own: a paid payout can later fail when the bank returns it. That transition is allowed explicitly, and it reverses the ledger entries.',
      },
      { kind: "h2", text: "Between objects: fail, then retry" },
      {
        kind: "p",
        text: "The second kind of disorder crosses objects. A payout event can arrive before the transfer that funded the seller's balance. Applying it at once would drive the balance negative, which the ledger forbids.",
      },
      {
        kind: "list",
        items: [
          {
            lead: "Buffer and reorder.",
            text: "Hold events and release them in dependency order. You need to know the dependency graph up front, and how long to wait for an event that may never come.",
          },
          {
            lead: "Allow temporary negative balances.",
            text: "Apply everything on arrival and expect it to net out. That gives up the never-negative rule, so a real overdraft can no longer be told apart from a timing artefact.",
          },
          {
            lead: "Fail and retry.",
            text: 'Applying the event fails with "insufficient funds" and rolls back completely. The event stays in the inbox with an attempt count and the error, and a later sweep retries it, oldest first.',
          },
        ],
      },
      {
        kind: "p",
        text: "I chose fail and retry. Each event is applied in a single transaction, so a failed attempt leaves no partial state. After eight failed attempts the sweep stops and leaves the event for a person to inspect.",
      },
      {
        kind: "p",
        text: "The webhook still answers 200. The event was received and stored; retrying it is this system's job, not Stripe's.",
      },
      { kind: "h2", text: "Proving it" },
      {
        kind: "p",
        text: "A property-based test takes one scenario's events, delivers them in random orders with every event sent twice, and checks that balances and payout statuses always end the same.",
      },
      { kind: "h2", text: "What it costs" },
      {
        kind: "p",
        text: "An event that arrives early is applied late, by up to one sweep interval. In exchange the ledger never shows a state that did not happen: balances are non-negative at every commit.",
      },
      {
        kind: "p",
        text: "And an event that can never succeed, such as a payout that truly exceeds the balance, surfaces as a stuck inbox entry with its error. That is exactly the signal a payout monitor exists to raise.",
      },
    ],
    links: [
      {
        label: "Design record 5: the state machine",
        href: `${REPO}/docs/decisions/0005-out-of-order-events-one-way-state-machine.md`,
      },
      {
        label: "Design record 7: fail and retry",
        href: `${REPO}/docs/decisions/0007-cross-object-ordering-retry-not-reorder.md`,
      },
      {
        label: "The ordering test",
        href: `${REPO}/src/events/ordering.db.test.ts`,
      },
      {
        label: "Try it in the live demo",
        href: "https://payout-ledger-gamma.vercel.app",
      },
    ],
  },
];
