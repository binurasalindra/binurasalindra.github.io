const path = require("node:path");
const os = require("node:os");
const { createRequire } = require("node:module");
const qaRoot =
  process.env.PORTFOLIO_QA_HOME ||
  path.join(os.tmpdir(), "binura-portfolio-qa");
const qaRequire = createRequire(path.join(qaRoot, "package.json"));
const { chromium } = qaRequire("playwright");
const AxeBuilder = qaRequire("@axe-core/playwright").default;
const assert = require("node:assert/strict");
const fs = require("node:fs");
const artifacts = fs.mkdtempSync(
  path.join(os.tmpdir(), "binura-portfolio-results-"),
);
const baseURL = process.env.PORTFOLIO_URL || "http://127.0.0.1:4173";
const results = [];
function pass(name) {
  results.push(name);
  console.log("PASS", name);
}
(async () => {
  const browser = await chromium.launch({
    channel: process.env.PORTFOLIO_BROWSER_CHANNEL || "msedge",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [],
    failedAssets = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.url().startsWith(baseURL) && r.status() >= 400)
      failedAssets.push(r.url());
  });
  await context.route("**/api.emailjs.com/**", (route) => {
    throw new Error("Live email request blocked: " + route.request().url());
  });
  await page.goto(baseURL, { waitUntil: "networkidle" });
  for (const width of [320, 375, 390, 540, 760, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      sections: [...document.querySelectorAll("main section")].map((s) => ({
        id: s.id,
        width: s.getBoundingClientRect().width,
        display: getComputedStyle(s).display,
      })),
    }));
    assert.ok(layout.scroll <= width, JSON.stringify(layout));
    assert.equal(layout.sections.length, 5);
    assert.ok(
      layout.sections.every((s) => s.width > 0 && s.display !== "none"),
    );
  }
  pass(
    "All five sections visible; no horizontal overflow at nine widths, 320–1920px",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.locator(".hamburger");
  await toggle.click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Home",
  );
  await page.keyboard.press("Escape");
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  assert.equal(
    await page.evaluate(() => document.activeElement.className),
    "hamburger",
  );
  await toggle.click();
  await page.locator('#mobile-menu a[href="#service"]').click();
  assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  await page.waitForFunction(
    () => document.querySelector("#service").getBoundingClientRect().top < 150,
  );
  assert.equal(
    await page
      .locator('#mobile-menu a[href="#service"]')
      .getAttribute("aria-current"),
    "location",
  );
  await page.goBack();
  assert.ok((await page.locator("#home").boundingBox()).y < 150);
  pass(
    "Mobile menu: keyboard, Escape, focus restoration, navigation, active state, browser back",
  );
  await page.locator(".tokyo_tm_read_more a").click();
  const dialog = page.locator("dialog");
  assert.equal(await dialog.evaluate((d) => d.open), true);
  assert.equal(
    await dialog.locator(".descriptions p").count(),
    await page.locator("#article-content .descriptions p").count(),
  );
  const fullText = await page
    .locator("#article-content .descriptions")
    .textContent();
  assert.equal(await dialog.locator(".descriptions").textContent(), fullText);
  await page.keyboard.press("Shift+Tab");
  assert.equal(
    await page.evaluate(
      () => document.activeElement.closest("dialog") !== null,
    ),
    true,
  );
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(
      () => document.activeElement.closest("dialog") !== null,
    ),
    true,
  );
  const dialogAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  assert.deepEqual(
    dialogAxe.violations.map((v) => v.id),
    [],
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog").open);
  assert.equal(await dialog.evaluate((d) => d.open), false);
  assert.ok(
    await page.evaluate(
      () => document.activeElement.closest(".tokyo_tm_read_more") !== null,
    ),
  );
  await page.locator(".tokyo_tm_news .title a").click();
  await page.getByRole("button", { name: "Close article" }).click();
  pass(
    "Article: exact full content, all openers, Escape, close control, focus containment and restoration, axe scan",
  );

  await page.goto(baseURL + "/#article-content", { waitUntil: "networkidle" });
  assert.equal(await page.locator("dialog").evaluate((d) => d.open), true);
  await page.keyboard.press("Escape");
  await page.waitForURL(baseURL + "/#news");
  assert.ok(page.url().endsWith("#news"));
  pass("Direct article deep link and return to writing section");

  await page.locator("#contact").scrollIntoViewIfNeeded();
  assert.equal(await page.locator(".returnmessage").isVisible(), false);
  await page.evaluate(() => {
    window.calls = [];
    window.emailjs = {
      init: () => {},
      send: (service, template, values) => {
        window.calls.push({ service, template, values });
        return new Promise((resolve, reject) => {
          window.resolveEmail = resolve;
          window.rejectEmail = reject;
        });
      },
    };
  });
  await page.locator("#send_message").click();
  assert.equal(await page.evaluate(() => window.calls.length), 0);
  await page.locator("#name").fill("Test Engineer");
  await page.locator("#email").fill("invalid");
  await page.locator("#message").fill("Test message");
  await page.locator("#send_message").click();
  assert.equal(await page.evaluate(() => window.calls.length), 0);
  await page.locator("#email").fill("test@example.com");
  await page.locator("#send_message").click();
  assert.equal(await page.locator("#send_message").isDisabled(), true);
  assert.equal(
    await page.locator(".returnmessage").textContent(),
    "⏳ Sending message...",
  );
  await page.evaluate(() =>
    document
      .querySelector("#contact_form")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
  assert.equal(await page.evaluate(() => window.calls.length), 1);
  assert.deepEqual(await page.evaluate(() => window.calls[0]), {
    service: "service_a3nycjj",
    template: "template_qxpw70p",
    values: {
      name: "Test Engineer",
      email: "test@example.com",
      message: "Test message",
    },
  });
  await page.evaluate(() => window.resolveEmail({ status: 200 }));
  await page.waitForFunction(
    () => !document.querySelector("#send_message").disabled,
  );
  assert.equal(
    await page.locator(".returnmessage").textContent(),
    await page.locator(".returnmessage").getAttribute("data-success"),
  );
  assert.equal(await page.locator("#name").inputValue(), "");
  await page.locator("#name").fill("Test Engineer");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#message").fill("Keep this message");
  await page.locator("#send_message").click();
  await page.evaluate(() => window.rejectEmail(new Error("Test failure")));
  await page.waitForFunction(
    () => !document.querySelector("#send_message").disabled,
  );
  assert.equal(
    await page.locator("#message").inputValue(),
    "Keep this message",
  );
  assert.equal(
    await page.locator(".returnmessage").textContent(),
    "❌ Failed to send message. Please try again.",
  );
  await page.evaluate(() => {
    window.emailjs = undefined;
  });
  await page.locator("#send_message").click();
  assert.equal(await page.locator("#send_message").isDisabled(), false);
  pass(
    "Contact: required/email validation, pending state, duplicate protection, preserved payload, success, failure, unavailable SDK (all mocked)",
  );

  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      scan.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
    );
  }
  pass("Zero axe WCAG A/AA violations at mobile, tablet and desktop widths");
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  assert.equal(
    await page
      .locator(".avatar")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  pass("Reduced motion disables smooth scrolling and entrance animation");
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download CV" }).click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), "binura_salindra _cv.pdf");
  assert.equal(await download.failure(), null);
  pass("Original CV download works");

  for (const selector of [
    "#home",
    "#about",
    ".tokyo_tm_skillbox",
    ".tokyo_tm_resumebox",
    "#service",
    "#news",
    "#contact",
  ]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(
        artifacts,
        "section-" + selector.replace(/[.#]/g, "") + ".png",
      ),
    });
  }
  await page.locator("#home").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: path.join(artifacts, "desktop-final.png"),
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  assert.deepEqual(failedAssets, []);
  pass("No JavaScript exceptions or failed local assets");
  const noJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await noJS.newPage();
  await fallback.goto(baseURL, { waitUntil: "domcontentloaded" });
  assert.equal(await fallback.locator("#article-content").isVisible(), true);
  assert.equal(await fallback.locator("#mobile-menu").isVisible(), true);
  assert.equal(await fallback.locator("section").count(), 5);
  pass(
    "No-JavaScript fallback exposes the full article, sections and navigation",
  );
  fs.writeFileSync(
    path.join(artifacts, "test-results.json"),
    JSON.stringify({ passed: results, errors, failedAssets }, null, 2),
  );
  console.log("Artifacts:", artifacts);
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
