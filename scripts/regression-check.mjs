import assert from "node:assert/strict";
import { test } from "node:test";
import { cp, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { tmpdir } from "node:os";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const source = fileURLToPath(new URL("../", import.meta.url));
async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), "haomeh-regression-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const name of ["src", "scripts"]) {
    await cp(join(source, name), join(directory, name), { recursive: true });
  }
  return directory;
}
function run(directory, command, args, basePath = "/") {
  const result = spawnSync(command, args, {
    cwd: directory,
    env: { ...process.env, BASE_PATH: basePath },
    encoding: "utf8",
  });
  assert.equal(
    result.status,
    0,
    `${command} ${args.join(" ")}\n${result.stdout}\n${result.stderr}`,
  );
}

test("brand check runs after build in a clean checkout, without browser artifacts", async (t) => {
  const directory = await fixture(t);
  run(directory, process.execPath, ["scripts/build.mjs"]);
  await assert.rejects(stat(join(directory, "artifacts")), { code: "ENOENT" });
  run(directory, "python3", ["scripts/check-brand.py"]);
  const report = JSON.parse(
    await readFile(join(directory, "artifacts/brand-tests.json")),
  );
  assert.equal(report.svgAssets.length, 4);
});

// Mimics a static host preserving the missing request URL and returning 404.html
// with HTTP 404. No redirects to /404.html, which would conceal relative-URL bugs.
async function serve(directory, basePath) {
  const dist = join(directory, "dist");
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".svg": "image/svg+xml",
  };
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    let contents;
    let file;
    try {
      assert.ok(pathname.startsWith(basePath));
      const relative = decodeURIComponent(pathname.slice(basePath.length));
      assert.ok(!relative.split("/").includes(".."));
      file = join(dist, relative || "index.html");
      contents = await readFile(file);
      response.writeHead(200, {
        "Content-Type": types[extname(file)] || "application/octet-stream",
      });
    } catch {
      contents = await readFile(join(dist, "404.html"));
      response.writeHead(404, { "Content-Type": types[".html"] });
    }
    response.end(contents);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

test("nested missing URLs retain CSS, branding and navigation at root and project base paths", async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  for (const [configured, basePath] of [
    ["/", "/"],
    ["/haomeh-website", "/haomeh-website/"],
  ]) {
    await t.test(basePath, async (t) => {
      const directory = await fixture(t);
      run(directory, process.execPath, ["scripts/build.mjs"], configured);
      const { server, origin } = await serve(directory, basePath);
      t.after(() => new Promise((resolve) => server.close(resolve)));
      const page = await browser.newPage();
      t.after(() => page.close());
      for (const suffix of ["missing/deep", "missing/deep/"]) {
        for (const width of [320, 1280]) {
          await page.setViewportSize({ width, height: 900 });
          const requested = `${origin}${basePath}${suffix}`;
          const response = await page.goto(requested);
          assert.equal(response.status(), 404);
          assert.equal(page.url(), requested);
          assert.match(await page.locator("h1").innerText(), /暫時不在這裡/);
          assert.equal(
            await page.evaluate(
              () => getComputedStyle(document.body).backgroundColor,
            ),
            "rgb(248, 247, 242)",
          );
          for (const selector of [
            'link[rel="stylesheet"]',
            'link[rel="icon"]',
          ]) {
            const url = await page
              .locator(selector)
              .evaluate((element) => element.href);
            assert.ok(url.startsWith(origin + basePath));
            const asset = await page.request.get(url);
            assert.equal(asset.status(), 200, url);
            assert.match(
              asset.headers()["content-type"],
              selector.includes("stylesheet") ? /text\/css/ : /image\/svg\+xml/,
            );
          }
          assert.ok(
            await page
              .locator("img")
              .evaluateAll((images) =>
                images.every(
                  (image) => image.complete && image.naturalWidth > 0,
                ),
              ),
          );
          const anchors = await page
            .locator("a")
            .evaluateAll((links) =>
              links.map((link) => ({
                raw: link.getAttribute("href"),
                url: link.href,
              })),
            );
          for (const anchor of anchors.filter((a) => !a.raw.startsWith("#"))) {
            assert.ok(anchor.url.startsWith(origin + basePath), anchor.url);
            assert.equal(
              (await page.request.get(anchor.url.split("#")[0])).status(),
              200,
              anchor.url,
            );
          }
          await page.keyboard.press("Tab");
          assert.equal(
            await page.evaluate(() => document.activeElement.className),
            "skip",
          );
          await page.keyboard.press("Enter");
          assert.equal(page.url(), requested + "#main");
          await page.locator("main .button").click();
          assert.equal(page.url(), origin + basePath + "index.html");
          assert.match(await page.title(), /把日常/);
        }
      }
      assert.equal((await page.goto(origin + basePath)).status(), 200);
      assert.ok(
        await page
          .locator("header img")
          .first()
          .evaluate((img) => img.naturalWidth > 0),
      );
    });
  }
});
