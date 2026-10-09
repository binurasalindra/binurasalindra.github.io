/* Run against the same local preview and development-only tools as portfolio.cjs. */
const path = require("node:path");
const os = require("node:os");
const assert = require("node:assert/strict");
const { createRequire } = require("node:module");
const qaRequire = createRequire(
  path.join(
    process.env.PORTFOLIO_QA_HOME ||
      path.join(os.tmpdir(), "binura-portfolio-qa"),
    "package.json",
  ),
);
const playwright = qaRequire("playwright");
const baseURL = process.env.PORTFOLIO_URL || "http://127.0.0.1:4173";
const engine = process.env.PORTFOLIO_ENGINE || "chromium";

(async function () {
  const browser = await playwright[engine].launch({
    ...(engine === "chromium"
      ? { channel: process.env.PORTFOLIO_BROWSER_CHANNEL || "msedge" }
      : {}),
    headless: true,
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "no-preference",
    });
    await context.addInitScript(() => {
      window.motionEvents = [];
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (frames, options) {
        const animation = animate.call(this, frames, options);
        window.motionEvents.push({ element: this, animation, options });
        return animation;
      };
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(baseURL, { waitUntil: "networkidle" });
    const logo = await page
      .locator(".leftpart .brand-wordmark")
      .evaluate((image) => ({
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        src: image.getAttribute("src"),
        width: image.getBoundingClientRect().width,
      }));
    assert.equal(logo.complete, true);
    assert.ok(logo.naturalWidth > 0);
    assert.equal(logo.src, "img/logo/wordmark-selected.png");
    assert.ok(logo.width >= 130 && logo.width <= 150);
    await page.waitForFunction(() =>
      document.querySelector(".avatar").classList.contains("portrait-in-view"),
    );
    assert.equal(
      await page
        .locator(".avatar > picture")
        .evaluate((e) => getComputedStyle(e).animationName),
      "portrait-float",
    );
    const avatar = await page.locator(".avatar").boundingBox();
    await page.mouse.move(
      avatar.x + avatar.width * 0.8,
      avatar.y + avatar.height * 0.4,
    );
    await page.waitForFunction(
      () =>
        document
          .querySelector(".portrait")
          .style.getPropertyValue("--portrait-tilt-y") !== "",
    );
    assert.equal(await page.locator(".hero-tech-map").count(), 1);
    assert.equal(
      await page.locator(".scroll-indicator").getAttribute("href"),
      "#about",
    );
    assert.ok(
      Math.abs(
        await page
          .locator(".portrait")
          .evaluate((e) =>
            parseFloat(e.style.getPropertyValue("--portrait-tilt-y")),
          ),
      ) <= 2,
    );
    assert.ok(
      Math.abs(
        await page
          .locator(".avatar")
          .evaluate((e) =>
            parseFloat(e.style.getPropertyValue("--circuit-shift-x")),
          ),
      ) <= 3.5,
    );
    await page.mouse.move(0, 0);
    assert.equal(
      await page
        .locator(".portrait")
        .evaluate((e) => e.style.getPropertyValue("--portrait-tilt-y")),
      "",
    );
    assert.equal(
      await page
        .locator(".avatar")
        .evaluate((e) => e.style.getPropertyValue("--circuit-shift-x")),
      "",
    );
    console.log(
      "PASS portrait/circuit depth, pointer reset, scroll cue and floating entrance",
    );

    await page.evaluate(() =>
      document
        .querySelector("#service .list")
        .scrollIntoView({ behavior: "instant", block: "center" }),
    );
    await page.waitForFunction(() =>
      window.motionEvents.some((e) =>
        e.element.matches(".tokyo_tm_services li"),
      ),
    );
    const delays = await page.evaluate(() =>
      window.motionEvents
        .filter((e) => e.element.matches(".tokyo_tm_services li"))
        .map((e) => e.options.delay),
    );
    assert.ok(new Set(delays).size > 1);
    assert.ok(Math.max(...delays) <= 180);
    await page.waitForTimeout(900);
    const count = await page.evaluate(() => window.motionEvents.length);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.evaluate(() =>
      document
        .querySelector("#service .list")
        .scrollIntoView({ behavior: "instant", block: "center" }),
    );
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => window.motionEvents.length), count);
    console.log(
      "PASS staggered scroll reveals finish visibly and do not replay",
    );

    await page.evaluate(() =>
      document
        .querySelector(".fields")
        .scrollIntoView({ behavior: "instant", block: "center" }),
    );
    await page.waitForFunction(() =>
      window.motionEvents.some((e) => e.element.matches(".fields")),
    );
    await page.locator("#name").focus();
    assert.equal(
      await page
        .locator(".fields")
        .evaluate((e) => getComputedStyle(e).opacity),
      "1",
    );
    assert.equal(
      await page.locator(".fields").evaluate((e) => e.getAnimations().length),
      0,
    );
    console.log("PASS keyboard focus immediately reveals form controls");

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(
      () =>
        !document
          .querySelector(".avatar")
          .classList.contains("portrait-in-view"),
    );
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== "running"),
    );
    assert.equal(
      await page
        .locator(".avatar")
        .evaluate((e) => e.style.getPropertyValue("--portrait-parallax")),
      "",
    );
    assert.equal(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
      "auto",
    );
    assert.equal(
      await page
        .locator(".hero-tech-map .tech-path")
        .first()
        .evaluate((e) => getComputedStyle(e).animationName),
      "none",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForFunction(() =>
      document.querySelector(".avatar").classList.contains("portrait-in-view"),
    );
    await page.waitForTimeout(5100);
    assert.equal(
      await page
        .locator(".avatar")
        .evaluate(
          (e) =>
            e
              .getAnimations({ subtree: true })
              .filter((a) => a.playState === "running").length,
        ),
      0,
    );
    console.log(
      "PASS live reduced-motion changes and finite ambient animations",
    );

    const touch = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      reducedMotion: "no-preference",
    });
    const mobile = await touch.newPage();
    await mobile.goto(baseURL, { waitUntil: "networkidle" });
    await mobile.evaluate(() =>
      window.scrollTo({ top: 250, behavior: "instant" }),
    );
    assert.equal(
      await mobile
        .locator(".avatar")
        .evaluate((e) => e.style.getPropertyValue("--portrait-parallax")),
      "",
    );
    assert.equal(
      await mobile.evaluate(() => document.documentElement.scrollWidth),
      390,
    );
    await mobile.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await mobile
        .locator(".avatar > picture")
        .evaluate((e) => getComputedStyle(e).animationName),
      "none",
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS touch devices omit parallax; reduced motion and layout remain intact (" +
        engine +
        ")",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
