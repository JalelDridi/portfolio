const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-10-02" → "2 Oct 2026". */
export function formatShortDate(iso: string): string {
  return shortDate.format(new Date(iso));
}
