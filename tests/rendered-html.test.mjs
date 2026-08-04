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
  assert.match(html, /Ёлки, с которыми дома начинается праздник/);
  assert.match(html, /Смотреть каталог/);
  assert.match(html, /Афродита Премиум/);
  assert.match(html, /Тайга/);
  assert.match(html, /210[\s\S]*см/);
  assert.match(html, /9[\s\u00A0]700 ₽/);
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
  assert.match(staticCatalog, /Коллекция 2026/);
  assert.match(staticCatalog, /Ёлки, с которыми дома начинается праздник/);
  assert.match(staticCatalog, /Реальные модели, актуальные размеры, цены, фото и видео — всё для быстрого выбора\./);
  assert.match(staticCatalog, /Смотреть каталог/);
  assert.match(staticCatalog, /Реальные модели • Актуальные размеры • Помощь с выбором/);
  assert.match(staticCatalog, /hero-ornament/);
  assert.match(staticCatalog, /ornament-line one/);
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
  assert.match(staticCatalog, /Все фото/);
  assert.match(staticCatalog, /В наличии/);
  assert.match(staticCatalog, /Открыть модель <b>→<\/b>/);
  assert.match(staticCatalog, /Крымская зелёная узкая/);
  assert.match(staticCatalog, /Люсия снежная/);
  assert.match(staticCatalog, /Дворянская заснеженная/);
  assert.match(staticCatalog, /190/);
  assert.match(staticCatalog, /270/);
  assert.match(staticCatalog, /250/);
  assert.match(staticCatalog, /Свайп и стрелки листают галерею/);
  assert.doesNotMatch(staticCatalog, /Тестовая версия/);
  assert.doesNotMatch(staticCatalog, /В следующей версии/);
  assert.doesNotMatch(staticCatalog, /Подробнее/);
  assert.doesNotMatch(staticCatalog, /180–210/);
  const firstScreen = staticCatalog.slice(0, staticCatalog.indexOf('<section class="catalog'));
  assert.doesNotMatch(firstScreen, /afrodita-hero\.jpg/);
  assert.doesNotMatch(firstScreen, /hero-christmas-mood-v2\.png/);
  assert.doesNotMatch(firstScreen, /<img\b/);
  assert.doesNotMatch(firstScreen, /ornament-branch/);
  assert.doesNotMatch(firstScreen, /ornament-ring/);

  assert.match(page, /isLightboxOpen/);
  assert.match(page, /trapFocus/);
  assert.match(page, /handleSwipeStart/);
  assert.match(page, /handleSwipeEnd/);
  assert.match(page, /aria-pressed/);
  assert.match(page, /MagnifyingGlassPlus/);
  assert.match(page, /Ёлки, с которыми дома начинается праздник/);
  assert.match(page, /hero-ornament/);
  assert.match(page, /tayga-motion-web\.mov/);
  assert.match(page, /Железная складная/);
  assert.match(page, /product-availability/);
  assert.match(page, /product-prices/);
  assert.match(page, /placeholderCatalogImage/);
  assert.match(page, /Крымская зелёная узкая/);
  assert.match(page, /Открыть модель <ArrowRight/);
  assert.doesNotMatch(page, /Подробнее/);
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
