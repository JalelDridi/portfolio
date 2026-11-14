import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PROJECTS = [
  "Solvedblue",
  "Potluck",
  "tnpay",
  "Deal Grader",
  "Kora",
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

test("the hero door opens and closes with the keyboard", async ({ page }) => {
  await page.goto("/");
  const door = page.getByRole("button", { name: "Open the door" });
  await expect(door).toHaveAttribute("aria-expanded", "false");
  await expect(
    page
      .locator("#hero-room")
      .getByRole("link", { name: "Read the case study" }),
  ).toHaveCount(0);
  await door.focus();
  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "Close the door" });
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await expect(
    page
      .locator("#hero-room")
      .getByRole("link", { name: "Read the case study" }),
  ).toHaveAttribute("href", "/work/solvedblue");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Open the door" }),
  ).toBeVisible();
});

test("a project door swings open on hover and on keyboard focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const street = page.locator("#work");
  const link = street.getByRole("link", { name: /Potluck/ }).first();
  const leaf = link.locator(".door-leaf-r");
  expect(await leaf.evaluate((el) => getComputedStyle(el).transform)).toBe(
    "none",
  );
  await link.hover();
  expect(await leaf.evaluate((el) => getComputedStyle(el).transform)).not.toBe(
    "none",
  );
  await page.mouse.move(0, 0);
  await link.focus();
  expect(await leaf.evaluate((el) => getComputedStyle(el).transform)).not.toBe(
    "none",
  );
});

test("the street shows five doors with their numbers before any JavaScript runs", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const doors = page.locator("#work ol > li");
  await expect(doors).toHaveCount(5);
  await expect(doors.first()).toContainText("N° 01");
  await expect(doors.first()).toContainText("Solvedblue");
  await expect(doors.nth(1)).toContainText("99 tests");
  await context.close();
});

test("a project card opens its case study, which links out", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("list", { name: /Also on this street/ })
    .getByRole("link", { name: "Deal Grader", exact: true })
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

test("Solvedblue is the current job and has a case study", async ({ page }) => {
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

  test("each step posts an entry in the ledger book", async ({ page }) => {
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
  for (const path of [
    "/",
    "/work/potluck",
    "/writing/webhooks-in-any-order",
    "/changelog",
  ]) {
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
  // The playground's steps are instant with motion reduced.
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    "/",
    "/work/spyder",
    "/work/potluck",
    "/writing/twenty-five-payouts-a-balance-for-ten",
    "/changelog",
  ]) {
    await page.goto(path);
    if (path === "/") {
      // Open the hero door, its widest state, before measuring.
      await page.getByRole("button", { name: "Open the door" }).click();
      await expect(
        page.getByRole("button", { name: "Close the door" }),
      ).toBeVisible();
      // Fill the ledger book, its widest state, before measuring.
      await page.getByRole("button", { name: "Send out of order" }).click();
      await expect(page.getByRole("status")).toContainText("Retried");
    }

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
  expect(data.mainEntity.worksFor.name).toBe("Solvedblue");
});

test("recordings wait until they are near the screen", async ({ page }) => {
  await page.goto("/");
  const video = page.locator("#project video");

  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("poster");

  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("poster", /payout-ledger-poster/);
});

test("the flagship sits on the blue band with its recording in an arch", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const band = page.locator("#project");
  const bg = await band.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgb(23, 99, 182)");
  await expect(band.locator("video")).toHaveAttribute("preload", "none");
  expect(
    await band
      .locator("video")
      .evaluate((el) => getComputedStyle(el.closest("[data-arch]")!).clipPath),
  ).toContain("url(");
});

test("the about section shows the portrait, the story and live clocks", async ({
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

test("the leadership section lists the three JCI roles in order", async ({
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

test("the copy button puts the email on the clipboard", async ({ browser }) => {
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

test("an article opens from the home page and links to its sources", async ({
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

test("the status strip shows three live clocks, the site version and the deploy date", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByText(/^\d{2}:\d{2}$/)).toHaveCount(3);
  await expect(footer).toContainText(/Site v\d+\.\d+\.\d+/);
  await expect(footer).toContainText(/Last deploy \d{1,2} \w{3,4} \d{4}/);
  await expect(footer).not.toContainText("Built with");
});

test("the changelog lists the current version first and is linked from the status strip", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "changelog" })
    .click();
  await expect(page).toHaveURL(/\/changelog$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Changelog" }),
  ).toBeVisible();
  await expect(page.locator("main ol li").first()).toContainText("3.0.0");
});

test("with motion reduced the hero is visible at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const h1 = page.getByRole("heading", {
    level: 1,
    name: "Mohamed Jalel Dridi",
  });
  await expect(h1).toBeVisible();
  expect(
    await h1.evaluate((el) => getComputedStyle(el.parentElement!).opacity),
  ).toBe("1");
  // The last entrance, the hero door, is not held back either.
  const room = page.locator("#hero-room");
  expect(
    await room.evaluate(
      (el) => getComputedStyle(el.closest(".animate-in")!).opacity,
    ),
  ).toBe("1");
});

test("the page is set in the Bab typefaces and ends on a band of tiles", async ({
  page,
}) => {
  await page.goto("/");
  const h1Font = await page
    .getByRole("heading", { level: 1 })
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(h1Font).toMatch(/Alexandria/i);
  const bodyFont = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(bodyFont).toMatch(/Onest/i);
  await expect(
    page.getByRole("contentinfo").locator("svg pattern"),
  ).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toContainText("Bislema");
});

test("every Arabic word is marked as Arabic", async ({ page }) => {
  await page.goto("/");
  const unmarked = await page.evaluate(() => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    const bad: string[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      // Skip the framework's inline scripts, which repeat the page's text.
      if (node.parentElement?.closest("script, style")) continue;
      if (
        /[\u0600-\u06FF]/.test(node.data) &&
        !node.parentElement?.closest('[lang="ar"]')
      )
        bad.push(node.data.trim());
    }
    return bad;
  });
  expect(unmarked).toEqual([]);
});
