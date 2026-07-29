import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the catalog shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Каталог искусственных елей \| В наличии<\/title>/);
  assert.match(html, /Каталог остатков/);
  assert.match(html, /Актуальные остатки/);
  assert.match(html, /Афродита Премиум/);
  assert.match(html, /Тайга/);
});

test("keeps the mobile gallery and full-screen photo controls in the deployable catalog", async () => {
  const [staticCatalog, page, layout, packageJson] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(staticCatalog, /<title>Искусственные ели — каталог в наличии<\/title>/);
  assert.match(staticCatalog, /id="gallery-prev"/);
  assert.match(staticCatalog, /id="gallery-next"/);
  assert.match(staticCatalog, /id="fullscreen"/);
  assert.match(staticCatalog, /id="lightbox"/);
  assert.match(staticCatalog, /id="zoom-in"/);
  assert.match(staticCatalog, /tayga-motion-web\.mov/);
  assert.match(staticCatalog, /Железная складная подставка/);
  assert.match(staticCatalog, /Актуальные остатки/);
  assert.doesNotMatch(staticCatalog, /Тестовая версия/);
  assert.doesNotMatch(staticCatalog, /В следующей версии/);

  assert.match(page, /isLightboxOpen/);
  assert.match(page, /MagnifyingGlassPlus/);
  assert.match(page, /tayga-motion-web\.mov/);
  assert.match(page, /Железная складная/);
  assert.match(layout, /Каталог искусственных елей \| В наличии/);
  assert.match(packageJson, /"@phosphor-icons\/react"/);
});
