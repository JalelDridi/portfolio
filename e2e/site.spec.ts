import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PROJECTS = [
  "Deal Grader",
  "Potluck LIVE",
  "Payments on Stripe Connect",
  "Realtime messaging",
  "Infrastructure and release pipeline",
  "Spyder",
  "Field-inspection platform",
  "Event Orchestrator",
];

test("shows who I am, the open-source project and every piece of work", async ({
  page,
}) => {
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

  for (const title of PROJECTS) {
    await expect(
      page.getByRole("heading", { level: 3, name: title, exact: true }),
    ).toBeVisible();
  }
});

test("a project card opens its case study, which links out", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Deal Grader", exact: true }).click();

  await expect(page).toHaveURL(/\/work\/deal-grader$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Deal Grader" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "What I built" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open Deal Grader" }),
  ).toHaveAttribute("href", "https://grade.offa.com");

  await page.getByRole("link", { name: "All work" }).click();
  await expect(page).toHaveURL(/\/#work$/);
});

test.describe("the pipeline playground", () => {
  test.beforeEach(async ({ page }) => {
    // Steps are instant with motion reduced, which keeps these tests fast.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
  });

  const counters = (page: import("@playwright/test").Page) =>
    page.locator("dl").filter({ hasText: "Owed to seller" });

  test("a webhook sent twice is stored and applied once", async ({ page }) => {
    await page.getByRole("button", { name: "Send it twice" }).click();

    await expect(page.getByRole("status")).toContainText(
      "already stored: skipped",
    );
    await expect(counters(page)).toContainText("Stored1");
    await expect(counters(page)).toContainText("Applied1");
    await expect(counters(page)).toContainText("$25.00");
  });

  test("an out-of-order payout waits, then ends at the same balance", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Send out of order" }).click();

    await expect(page.getByRole("status")).toContainText("Retried");
    await expect(counters(page)).toContainText("Stored2");
    await expect(counters(page)).toContainText("Applied2");
    await expect(counters(page)).toContainText("$0.00");
  });

  test("balances add up across several runs", async ({ page }) => {
    const send = page.getByRole("button", { name: "Send a webhook" });
    await send.click();
    await expect(counters(page)).toContainText("Applied1");
    await send.click();

    await expect(counters(page)).toContainText("Applied2");
    await expect(counters(page)).toContainText("$50.00");
  });
});

test("shows the local time in Bizerte and the gap to the visitor", async ({
  browser,
}) => {
  const context = await browser.newContext({ timezoneId: "America/New_York" });
  const page = await context.newPage();
  await page.goto("/");

  await expect(
    page.getByText(/\d{2}:\d{2} here now, [56] hours ahead of you/),
  ).toBeVisible();
  await context.close();
});

test("an unknown case study is a 404", async ({ page }) => {
  const response = await page.goto("/work/does-not-exist");

  expect(response?.status()).toBe(404);
});

test("every link has a destination", async ({ page }) => {
  await page.goto("/");

  const hrefs = await page
    .getByRole("link")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")));

  expect(hrefs.length).toBeGreaterThan(15);
  for (const href of hrefs) {
    expect(href).toMatch(/^(https:\/\/|mailto:|\/|#)/);
  }
});

test("the theme switch changes the colour scheme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);

  await page
    .getByRole("button", { name: "Switch between light and dark theme" })
    .click();

  await expect(html).toHaveClass(/dark/);
});

for (const colorScheme of ["light", "dark"] as const) {
  for (const path of ["/", "/work/payments"]) {
    test(`no detectable accessibility violations on ${path} in ${colorScheme} mode`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto(path);
      // Bring every scroll-revealed section into view before scanning.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
      });
      // Let the last fade-in finish so colours are measured at full opacity.
      await page.waitForTimeout(1200);

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  }
}

test("fits a phone screen without horizontal scrolling", async ({ page }) => {
  // Narrower than most phones, to leave a margin for font differences.
  await page.setViewportSize({ width: 340, height: 812 });
  for (const path of ["/", "/work/spyder"]) {
    await page.goto(path);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );

    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test("a phone gets the section links behind a menu button", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open the menu" }).click();
  await page
    .getByRole("navigation", { name: "Sections" })
    .getByRole("link", { name: "Experience" })
    .click();

  await expect(page).toHaveURL(/#experience$/);
  await expect(
    page.getByRole("button", { name: "Open the menu" }),
  ).toBeVisible();
});

test("an unknown address shows a way back to the home page", async ({
  page,
}) => {
  await page.goto("/no-such-page");

  await expect(
    page.getByRole("heading", { level: 1, name: "This page does not exist" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to the home page" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("a shared case study describes itself, not the home page", async ({
  page,
}) => {
  await page.goto("/work/spyder");

  const meta = (property: string) =>
    page.locator(`meta[property="${property}"]`).getAttribute("content");
  expect(await meta("og:title")).toBe("Spyder");
  expect(await meta("og:url")).toMatch(/\/work\/spyder$/);
  expect(await meta("og:image")).toContain("/work/spyder/opengraph-image");
});

test("the home page describes its subject to search engines", async ({
  page,
}) => {
  await page.goto("/");

  const raw = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const data = JSON.parse(raw ?? "{}");

  expect(data["@type"]).toBe("ProfilePage");
  expect(data.mainEntity.name).toBe("Mohamed Jalel Dridi");
  expect(data.mainEntity.sameAs).toContain("https://github.com/JalelDridi");
});

test("recordings wait until they are near the screen", async ({ page }) => {
  await page.goto("/");
  const video = page.locator("#project video");

  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("poster");

  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("poster", /payout-ledger-poster/);
});
