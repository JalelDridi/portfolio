// A small model of what Payout Ledger does with a webhook, for the hero
// playground. It mirrors the real rules: an event ID is stored once, an
// event is applied once, and one that arrives before its funds waits.

export type Stage = "webhook" | "inbox" | "ledger";

export type Tone = "ok" | "skip" | "wait";

export type Counters = {
  stored: number;
  applied: number;
  /** Owed to the seller, in cents. */
  balance: number;
};

/** One visible step: which stage lights up, what it reports, and the totals after it. */
export type Step = { stage: Stage; tone: Tone; text: string; after: Counters };

export type SimState = Counters & { nextId: number };

export const initialState: SimState = {
  stored: 0,
  applied: 0,
  balance: 0,
  nextId: 1,
};

export type Scenario = "once" | "twice" | "out-of-order";

export const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: "once", label: "Send a webhook" },
  { id: "twice", label: "Send it twice" },
  { id: "out-of-order", label: "Send out of order" },
];

const AMOUNT = 2500;
const eventId = (n: number) => `evt_${String(n).padStart(3, "0")}`;

/**
 * Returns the steps a scenario plays and the state it ends in. Pure, so the
 * component only has to animate the steps.
 */
export function play(
  scenario: Scenario,
  state: SimState,
): { steps: Step[]; next: SimState } {
  const totals: Counters = {
    stored: state.stored,
    applied: state.applied,
    balance: state.balance,
  };
  const steps: Step[] = [];
  const step = (
    stage: Stage,
    tone: Tone,
    text: string,
    change: Partial<Counters> = {},
  ) => {
    totals.stored += change.stored ?? 0;
    totals.applied += change.applied ?? 0;
    totals.balance += change.balance ?? 0;
    steps.push({ stage, tone, text, after: { ...totals } });
  };
  const id = eventId(state.nextId);
  let used = 1;

  if (scenario === "once" || scenario === "twice") {
    step("webhook", "ok", `${id} arrives, signature verified`);
    step("inbox", "ok", `${id} stored`, { stored: 1 });
    step("ledger", "ok", "Applied: $25.00 to the seller", {
      applied: 1,
      balance: AMOUNT,
    });
    if (scenario === "twice") {
      step("webhook", "ok", `${id} arrives again`);
      step(
        "inbox",
        "skip",
        `${id} is already stored: skipped, nothing applied twice`,
      );
    }
  } else {
    // A payout arrives before the transfer that funds it.
    const payout = id;
    const transfer = eventId(state.nextId + 1);
    used = 2;
    const funded = state.balance >= AMOUNT;

    step("webhook", "ok", `Payout ${payout} arrives first`);
    step("inbox", "ok", `${payout} stored`, { stored: 1 });
    if (funded) {
      step("ledger", "ok", "Applied: $25.00 paid out", {
        applied: 1,
        balance: -AMOUNT,
      });
    } else {
      step(
        "ledger",
        "wait",
        "No funds yet: the payout waits, the balance stays at zero",
      );
    }
    step("webhook", "ok", `Transfer ${transfer} arrives late`);
    step("inbox", "ok", `${transfer} stored`, { stored: 1 });
    step("ledger", "ok", "Applied: $25.00 to the seller", {
      applied: 1,
      balance: AMOUNT,
    });
    if (!funded) {
      step(
        "ledger",
        "ok",
        `Retried ${payout}: $25.00 paid out. Same result as the right order`,
        { applied: 1, balance: -AMOUNT },
      );
    }
  }

  return { steps, next: { ...totals, nextId: state.nextId + used } };
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
