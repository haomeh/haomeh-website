import { readFile, readdir, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
const root = new URL("../dist/", import.meta.url);
const files = await readdir(root);
let links = 0;
for (const file of files.filter((f) => f.endsWith(".html"))) {
  const html = await readFile(new URL(file, root), "utf8");
  assert.match(html, /<html lang="zh-Hant">/);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, file);
  assert.match(html, /noindex,nofollow/);
  assert.ok(!/<script|<iframe|<form|https:\/\/fonts/.test(html), file);
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    links++;
    if (href.startsWith("https:")) continue;
    const [path, hash] = href.split("#");
    if (path) await access(new URL(path, root));
    if (hash) {
      const target = path ? await readFile(new URL(path, root), "utf8") : html;
      assert.ok(target.includes(`id="${hash}"`), href);
    }
  }
}
console.log(
  `PASS: 7 HTML pages, ${links} links, static privacy constraints and heading structure.`,
);
const selected = await readFile(
  new URL("brand/haomeh-selected.svg", root),
  "utf8",
);
assert.equal(
  createHash("sha256").update(selected).digest("hex"),
  "7c63b694bafd0b749075518c112b4eaa4c6580e714b3024df0108a69dcc9a112",
  "Selected option 01 must remain unchanged",
);
assert.equal(
  selected,
  await readFile(new URL("brand/favicon.svg", root), "utf8"),
  "Favicon preserves selected silhouette and colors",
);
for (const route of [
  "index",
  "about",
  "contact",
  "privacy",
  "terms",
  "security",
  "404",
]) {
  const html = await readFile(new URL(route + ".html", root), "utf8");
  assert.equal(
    (html.match(/src="brand\/haomeh-selected.svg"/g) || []).length,
    2,
    route + " header and footer",
  );
  assert.match(html, /href="brand\/favicon.svg"/);
}
console.log(
  "PASS: option 01 unchanged; shared header/footer and favicon match on all 7 website pages.",
);
