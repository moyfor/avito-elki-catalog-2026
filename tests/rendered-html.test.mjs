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
  assert.match(html, /<title>Ёлки Тут — каталог искусственных елей<\/title>/);
  assert.match(html, /Каталог остатков/);
  assert.match(html, /Ёлки, которые выглядят как настоящие/);
  assert.match(html, /Смотреть ёлки/);
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

  assert.match(staticCatalog, /<title>Ёлки Тут — каталог искусственных елей<\/title>/);
  assert.match(staticCatalog, /<meta name="description" content="Ёлки Тут/);
  assert.match(staticCatalog, /og:title" content="Ёлки Тут — каталог искусственных елей/);
  assert.match(staticCatalog, /Ёлки, которые выглядят как настоящие/);
  assert.match(staticCatalog, /Выберите модель и высоту/);
  assert.match(staticCatalog, /Смотреть ёлки/);
  assert.match(staticCatalog, /public\/catalog-live\/afrodita-hero\.jpg/);
  assert.match(staticCatalog, /Искусственная ёлка Афродита Премиум в праздничном интерьере/);
  assert.match(staticCatalog, /id="gallery-prev"/);
  assert.match(staticCatalog, /id="gallery-next"/);
  assert.match(staticCatalog, /id="fullscreen"/);
  assert.match(staticCatalog, /id="lightbox"/);
  assert.match(staticCatalog, /id="zoom-in"/);
  assert.match(staticCatalog, /tabindex="-1"/);
  assert.match(staticCatalog, /aria-pressed/);
  assert.match(staticCatalog, /trapFocus/);
  assert.match(staticCatalog, /tayga-motion-web\.mov/);
  assert.match(staticCatalog, /Железная складная подставка/);
  assert.match(staticCatalog, /Выберите свою ёлку/);
  assert.doesNotMatch(staticCatalog, /Тестовая версия/);
  assert.doesNotMatch(staticCatalog, /В следующей версии/);

  assert.match(page, /isLightboxOpen/);
  assert.match(page, /trapFocus/);
  assert.match(page, /aria-pressed/);
  assert.match(page, /MagnifyingGlassPlus/);
  assert.match(page, /tayga-motion-web\.mov/);
  assert.match(page, /Железная складная/);
  assert.match(layout, /Ёлки Тут — каталог искусственных елей/);
  assert.match(layout, /мобильный каталог искусственных елей/);
  assert.match(packageJson, /"@phosphor-icons\/react"/);
});

test("uses one shared token source and keeps media preparation internal", async () => {
  const [staticCatalog, globalCss, designTokens, mediaManifestRaw, mediaRules] = await Promise.all([
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../styles/design-tokens.css", import.meta.url), "utf8"),
    readFile(new URL("../catalog-media/media-manifest.json", import.meta.url), "utf8"),
    readFile(new URL("../catalog-media/README.md", import.meta.url), "utf8"),
  ]);

  assert.match(staticCatalog, /href="styles\/design-tokens\.css"/);
  assert.match(globalCss, /@import "\.\.\/styles\/design-tokens\.css"/);
  assert.match(designTokens, /--color-accent-gold: #B79A66/);
  assert.match(designTokens, /prefers-reduced-motion|--duration-fast/);
  assert.doesNotMatch(staticCatalog, /--color-accent-gold:\s*#B79A66/);
  assert.doesNotMatch(globalCss, /--color-accent-gold:\s*#B79A66/);

  const mediaManifest = JSON.parse(mediaManifestRaw);
  const expectedIds = [
    "afrodita",
    "baikal",
    "krasavitsa",
    "lady",
    "prezidentskaya",
    "tayga",
    "victoria",
    "voronezhskaya",
  ];
  assert.equal(mediaManifest.brand, "Ёлки Тут");
  assert.deepEqual(
    mediaManifest.products.map((product) => product.productId).sort(),
    expectedIds,
  );
  assert.ok(mediaManifest.products.every((product) => product.media.every((item) => item.localPath && item.alt && item.processingStatus && typeof item.productTruthConfirmed === "boolean")));
  assert.match(mediaRules, /Запрещено/);
  assert.match(mediaRules, /силуэт ели/);
  assert.match(mediaRules, /исходники: локально, не коммитить/);
});
