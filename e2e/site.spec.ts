import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("shows who I am, the project and the case studies", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Mohamed Jalel Dridi" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Try the live demo" }),
  ).toHaveAttribute("href", "https://payout-ledger-gamma.vercel.app");
  await expect(
    page.getByRole("link", { name: "Read the code" }),
  ).toHaveAttribute("href", "https://github.com/JalelDridi/payout-ledger");

  for (const title of [
    "Deal Grader",
    "Potluck LIVE",
    "Payments on Stripe Connect",
    "Realtime messaging",
    "Spyder",
  ]) {
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
});

test("every link has a destination", async ({ page }) => {
  await page.goto("/");

  const hrefs = await page
    .getByRole("link")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")));

  expect(hrefs.length).toBeGreaterThan(5);
  for (const href of hrefs) {
    expect(href).toMatch(/^(https:\/\/|mailto:)/);
  }
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`no detectable accessibility violations in ${colorScheme} mode`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}

test("fits a phone screen without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
});
