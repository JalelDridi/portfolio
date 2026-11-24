import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("the home page is one episode at a time, starting with Solvedblue", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Mohamed Jalel Dridi" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Solvedblue" }),
  ).toBeVisible();
  const list = page.getByRole("navigation", { name: "Episodes" });
  await expect(list.getByRole("link")).toHaveCount(6);
  await expect(
    list.getByRole("link", { name: /eps1\.1_payoutledger\.ts/ }),
  ).toHaveAttribute("href", "/work/payout-ledger");
});

test("pointing at or focusing an episode selects it", async ({ page }) => {
  await page.goto("/");
  const list = page.getByRole("navigation", { name: "Episodes" });
  await list.getByRole("link", { name: /potluck/ }).hover();
  await expect(
    page.getByRole("heading", { level: 2, name: "Potluck" }),
  ).toBeVisible();
  await list.getByRole("link", { name: /kora/ }).focus();
  await expect(
    page.getByRole("heading", { level: 2, name: "Kora" }),
  ).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("heading", { level: 2, name: "Deal Grader" }),
  ).toBeVisible();
});

test("without JavaScript the six episodes are still links", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Episodes" }).getByRole("link"),
  ).toHaveCount(6);
  await expect(
    page.getByRole("heading", { level: 2, name: "Solvedblue" }),
  ).toBeVisible();
  await context.close();
});

test("with motion reduced the reel does not advance on its own", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(7000);
  await expect(
    page.getByRole("heading", { level: 2, name: "Solvedblue" }),
  ).toBeVisible();
});

test("arrow keys outside the episode list do not change the episode", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Play episode" }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("heading", { level: 2, name: "Solvedblue" }),
  ).toBeVisible();
  await page.locator("body").focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("heading", { level: 2, name: "Solvedblue" }),
  ).toBeVisible();
});

test("a mouse wheel on the page stops the reel", async ({ page }) => {
  await page.goto("/");
  await page.mouse.move(400, 300);
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(7000);
  await expect(
    page.getByRole("heading", { level: 2, name: "Solvedblue" }),
  ).toBeVisible();
});

test("left alone, the reel moves to the next episode", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 2, name: "Payout Ledger" }),
  ).toBeVisible({ timeout: 9000 });
});

test("on a phone every episode is a card with its own link", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Play episode" })).toHaveCount(6);
  await page
    .getByRole("heading", { level: 2, name: "Kora" })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { level: 2, name: "Kora" }),
  ).toBeVisible();
  await context.close();
});

test("the shell is dark, with four header links", async ({ page }) => {
  // TODO(Task 4): point at /about once it exists.
  await page.goto("/changelog");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(7, 7, 7)",
  );
  const nav = page.getByRole("navigation", { name: "Site" });
  for (const [name, href] of [
    ["work", "/"],
    ["about", "/about"],
    ["cv", "/Jalel_Dridi_CV.pdf"],
    ["contact", "/about#contact"],
  ])
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      href,
    );
});

test("the changelog lists version 4.0.0, Episodes, first", async ({ page }) => {
  await page.goto("/changelog");
  await expect(page.getByRole("heading", { level: 2 }).first()).toContainText(
    "Episodes",
  );
});

test("an episode opens its case study, which links out", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Episodes" })
    .getByRole("link", { name: /dealgrader/ })
    .click();

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

test("old Potluck case-study links redirect to the merged one", async ({
  page,
  request,
}) => {
  const response = await request.get("/work/payments", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  for (const old of [
    "/work/payments",
    "/work/potluck-live",
    "/work/realtime-messaging",
    "/work/release-pipeline",
  ]) {
    await page.goto(old);
    await expect(page).toHaveURL(/\/work\/potluck$/);
  }
  await expect(
    page.getByRole("heading", { level: 1, name: "Potluck" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Payments on Stripe Connect" }),
  ).toBeVisible();
});

test("a case study opens on a band in its door's colour", async ({ page }) => {
  await page.goto("/work/potluck");
  const band = page.locator("main > header");
  expect(
    await band.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(237, 176, 33)");
});

test("Kora has a case study with its live link", async ({ page }) => {
  await page.goto("/work/kora");
  await expect(
    page.getByRole("heading", { level: 1, name: "Kora" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Play Kora" })).toHaveAttribute(
    "href",
    "https://kora-tn.vercel.app",
  );
});

// The experience list left the home page: restored in Task 4.
test.fixme("Solvedblue is the current job and has a case study", async ({
  page,
}) => {
  await page.goto("/");
  const first = page.locator("#experience li").first();
  await expect(first).toContainText("Solvedblue");
  await expect(first).toContainText("Nov 2026 – present");
  await expect(page.locator("#experience li").nth(1)).toContainText(
    "Jun 2026 – Oct 2026",
  );
  await page.goto("/work/solvedblue");
  await expect(
    page.getByRole("heading", { level: 1, name: "Solvedblue" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Solvedblue", exact: true }).first(),
  ).toHaveAttribute("href", "https://solvedblue.com");
});

// The playground left the home page: restored in Task 3.
test.describe("the pipeline playground", () => {
  test.beforeEach(async ({ page }) => {
    // Steps are instant with motion reduced, which keeps these tests fast.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
  });

  const counters = (page: import("@playwright/test").Page) =>
    page.locator("dl").filter({ hasText: "Owed to seller" });

  test.fixme("a webhook sent twice is stored and applied once", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Send it twice" }).click();

    await expect(page.getByRole("status")).toContainText(
      "already stored: skipped",
    );
    await expect(counters(page)).toContainText("Stored1");
    await expect(counters(page)).toContainText("Applied1");
    await expect(counters(page)).toContainText("$25.00");
  });

  test.fixme("an out-of-order payout waits, then ends at the same balance", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Send out of order" }).click();

    await expect(page.getByRole("status")).toContainText("Retried");
    await expect(counters(page)).toContainText("Stored2");
    await expect(counters(page)).toContainText("Applied2");
    await expect(counters(page)).toContainText("$0.00");
  });

  test.fixme("each step posts an entry in the ledger book", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Send it twice" }).click();
    const rows = page
      .getByRole("table", { name: "Ledger entries" })
      .locator("tbody tr");
    await expect(rows).toHaveCount(5);
    await expect(rows.last()).toContainText("evt_001");
    await expect(rows.last()).toContainText("skipped");
    await expect(rows.last().locator("td").last()).toHaveText("skipped");
    await expect(rows.nth(2)).toContainText("$25.00");
  });

  test.fixme("balances add up across several runs", async ({ page }) => {
    const send = page.getByRole("button", { name: "Send a webhook" });
    await send.click();
    await expect(counters(page)).toContainText("Applied1");
    await send.click();

    await expect(counters(page)).toContainText("Applied2");
    await expect(counters(page)).toContainText("$50.00");
  });
});

// The local time left the home page: restored in Task 4.
test.fixme("shows the local time in Bizerte and the gap to the visitor", async ({
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

  // The header, the six episodes, the play link and the earlier episodes.
  expect(hrefs.length).toBeGreaterThanOrEqual(15);
  for (const href of hrefs) {
    expect(href).toMatch(/^(https:\/\/|mailto:|\/|#)/);
  }
});

// The site is dark only: each path is scanned once.
for (const path of ["/", "/about", "/work/potluck"]) {
  test(`no detectable accessibility violations on ${path}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
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

test("fits a phone screen without horizontal scrolling", async ({ page }) => {
  // Narrower than most phones, to leave a margin for font differences.
  await page.setViewportSize({ width: 340, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    "/",
    "/work/spyder",
    "/work/potluck",
    "/writing/twenty-five-payouts-a-balance-for-ten",
    "/changelog",
  ]) {
    await page.goto(path);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );

    expect(overflow, path).toBeLessThanOrEqual(0);
  }
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
  expect(data.mainEntity.worksFor.name).toBe("Solvedblue");
});

// The recordings left the home page: restored in Task 3.
test.fixme("recordings wait until they are near the screen", async ({
  page,
}) => {
  await page.goto("/");
  const video = page.locator("#project video");

  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("poster");

  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("poster", /payout-ledger-poster/);
});

// The about section left the home page: restored in Task 4.
test.fixme("the about section shows the portrait, the story and live clocks", async ({
  page,
}) => {
  await page.goto("/");
  const about = page.locator("#about");

  await expect(
    about.getByRole("img", { name: /Mohamed Jalel Dridi/ }),
  ).toBeVisible();
  await expect(
    about.getByText("I started on the infrastructure side"),
  ).toBeVisible();
  // Each clock shows a real time once the browser has one.
  await expect(about.getByText(/^\d{2}:\d{2}$/)).toHaveCount(4);
});

// The leadership section left the home page: restored in Task 4.
test.fixme("the leadership section lists the three JCI roles in order", async ({
  page,
}) => {
  await page.goto("/");

  const roles = page.locator("#leadership ol li");
  await expect(roles).toHaveText([
    /2022.*Secretary General/,
    /2024.*Vice-President/,
    /2026.*President/,
  ]);
});

// The contact section left the home page: restored in Task 4.
test.fixme("the copy button puts the email on the clipboard", async ({
  browser,
}) => {
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "med.jalel.dridi@gmail.com",
  );
  await context.close();
});

// The writing list left the home page: restored in Task 3.
test.fixme("an article opens from the home page and links to its sources", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", {
      name: "Twenty-five payouts, a balance that covers ten",
    })
    .click();

  await expect(page).toHaveURL(/\/writing\/twenty-five-payouts/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Twenty-five payouts, a balance that covers ten",
  );
  await expect(
    page.getByRole("link", { name: "The design record" }),
  ).toHaveAttribute("href", /0003-concurrency/);

  await page.getByRole("link", { name: "All writing" }).click();
  await expect(page).toHaveURL(/\/#writing$/);
});

test("the changelog lists the current version first and is linked from the footer", async ({
  page,
}) => {
  // The home page has no footer; any other page does.
  await page.goto("/work/kora");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "changelog" })
    .click();
  await expect(page).toHaveURL(/\/changelog$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Changelog" }),
  ).toBeVisible();
  await expect(page.locator("main ol li").first()).toContainText("4.0.0");
});
