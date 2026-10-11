import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const baseUrl = process.env.SITE_URL || "http://127.0.0.1:4173/";
const basePath = new URL(baseUrl).pathname;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const results = [];
await mkdir("artifacts", { recursive: true });
for (const width of [320, 375, 390, 430, 1280]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of [
    "index",
    "about",
    "contact",
    "privacy",
    "terms",
    "security",
    "404",
  ]) {
    await page.goto(`${baseUrl}${route}.html`);
    assert.equal(await page.locator("h1").count(), 1);
    assert.ok(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.every((img) => img.complete && img.naturalWidth > 0),
        ),
      `${route}: broken image`,
    );
    const metrics = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    assert.ok(
      metrics.scroll <= metrics.client,
      `${width} ${route} overflow ${JSON.stringify(metrics)}`,
    );
    results.push({ width, route, overflow: false });
  }
  await page.goto(`${baseUrl}index.html`);
  await page.screenshot({
    path: `artifacts/home-${width}.png`,
    fullPage: true,
  });
}
await page.goto(`${baseUrl}index.html`);
await page.keyboard.press("Tab");
assert.equal(
  await page.evaluate(() => document.activeElement.className),
  "skip",
);
await page.keyboard.press("Enter");
assert.equal(await page.evaluate(() => location.hash), "#main");
await page.locator(`header a[href="${basePath}about.html"]`).click();
assert.match(await page.title(), /關於/);
await page.locator(`header a[href="${basePath}contact.html"]`).click();
assert.match(await page.title(), /聯絡/);
await page.locator(`footer a[href="${basePath}privacy.html"]`).click();
assert.match(await page.title(), /隱私/);
assert.deepEqual(errors, []);
await writeFile(
  "artifacts/browser-results.json",
  JSON.stringify(
    {
      results,
      keyboardSkipLink: "pass",
      navigation: "pass",
      pageErrors: errors,
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  `PASS: ${results.length} viewport/route combinations, keyboard skip link, navigation, no browser errors; five screenshots.`,
);
