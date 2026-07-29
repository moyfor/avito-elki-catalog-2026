"use client";

import { useMemo, useState } from "react";

type TreeVariation = {
  height: number;
  price: number;
  oldPrice: number;
  diameter: string;
  weight: string;
};

type GalleryItem = {
  src: string;
  alt: string;
  label: string;
  kind?: "image" | "video";
};

type Tree = {
  id: string;
  name: string;
  subtitle: string;
  needles: string;
  assembly: string;
  stand?: string;
  image: string;
  imagePosition: string;
  gallery?: GalleryItem[];
  galleryUrl?: string;
  kind: "lush" | "slim";
  badge?: string;
  variations: TreeVariation[];
};

const trees: Tree[] = [
  {
    id: "afrodita",
    name: "Афродита Премиум",
    subtitle: "Выразительная, с густой кроной",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    image: "/catalog-live/afrodita-hero.jpg",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/YL3N2aXdPyYa9A",
    kind: "lush",
    badge: "Премиум",
    variations: [{ height: 240, price: 18900, oldPrice: 34990, diameter: "150 см", weight: "—" }],
  },
  {
    id: "tayga",
    name: "Тайга",
    subtitle: "Натуральный силуэт для дома",
    needles: "Литые ветки + ПВХ",
    assembly: "Шарнирная сборка",
    stand: "Железная складная",
    image: "/catalog-live/tayga-studio-v1.png",
    imagePosition: "center center",
    gallery: [
      {
        src: "/catalog-live/tayga-studio-v1.png",
        alt: "Ёлка Тайга в интерьере",
        label: "Общий вид модели",
      },
      {
        src: "/catalog-live/tayga-angle-02.jpg",
        alt: "Детали хвои ёлки Тайга",
        label: "Реальная хвоя крупным планом",
      },
      {
        src: "/catalog-live/tayga-needles.jpg",
        alt: "Фактура хвои ёлки Тайга",
        label: "Фактура веток и иголок",
      },
      {
        src: "/catalog-live/tayga-detail-02.jpg",
        alt: "Внутренняя конструкция ёлки Тайга",
        label: "Каркас и крепления",
      },
      {
        src: "/catalog-live/tayga-stand.jpg",
        alt: "Железная складная подставка ёлки Тайга",
        label: "Железная складная подставка",
      },
      {
        src: "/catalog-live/tayga-motion-01.mov",
        alt: "Видео ёлки Тайга",
        label: "Видео реальной модели",
        kind: "video",
      },
    ],
    kind: "lush",
    badge: "Топ продаж",
    variations: [
      { height: 210, price: 9700, oldPrice: 16900, diameter: "—", weight: "—" },
      { height: 240, price: 13900, oldPrice: 23490, diameter: "155 см", weight: "—" },
    ],
  },
  {
    id: "krasavitsa",
    name: "Красавица светлая",
    subtitle: "Светлый оттенок хвои, Беларусь",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    image: "/catalog-live/krasavitsa-svetlaya-main.jpg",
    imagePosition: "17% center",
    galleryUrl: "https://disk.yandex.ru/d/0eLf81pnauaqpA",
    kind: "lush",
    variations: [
      { height: 190, price: 13500, oldPrice: 19490, diameter: "130 см", weight: "12,5 кг" },
      { height: 220, price: 15900, oldPrice: 26490, diameter: "140 см", weight: "17 кг" },
    ],
  },
  {
    id: "lady",
    name: "Леди",
    subtitle: "Аккуратная и пышная классика",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    image: "/catalog/lady.png",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/DuwumiPk8ZZffA",
    kind: "lush",
    badge: "Топ продаж",
    variations: [
      { height: 210, price: 12800, oldPrice: 16900, diameter: "128 см", weight: "—" },
      { height: 270, price: 24500, oldPrice: 31000, diameter: "130 см", weight: "—" },
    ],
  },
  {
    id: "victoria",
    name: "Виктория Премиум",
    subtitle: "Строгая форма и литая хвоя",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    image: "/catalog/victoria.png",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/UAyPgIUojCBLAw",
    kind: "lush",
    badge: "Премиум",
    variations: [{ height: 210, price: 16800, oldPrice: 29990, diameter: "135 см", weight: "16,9 кг" }],
  },
  {
    id: "baikal",
    name: "Байкал",
    subtitle: "Большая ёлка для просторной комнаты",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    image: "/catalog-live/baikal-main.jpg",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/_VFuToIuu2lbJQ",
    kind: "lush",
    variations: [{ height: 230, price: 25800, oldPrice: 39990, diameter: "145 см", weight: "22,7 кг" }],
  },
  {
    id: "prezidentskaya",
    name: "Президентская",
    subtitle: "Пышная форма с выразительным объёмом",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    image: "/catalog/prezidentskaya.png",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/wuL5LiG7dK7cVw",
    kind: "lush",
    badge: "Премиум",
    variations: [
      { height: 210, price: 22200, oldPrice: 36990, diameter: "140 см", weight: "16,1 кг" },
      { height: 230, price: 27400, oldPrice: 37990, diameter: "155 см", weight: "21,5 кг" },
    ],
  },
  {
    id: "voronezhskaya",
    name: "Воронежская",
    subtitle: "Крупная модель с натуральной формой",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    image: "/catalog-live/voronezhskaya-main.jpg",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/IBMP6CuH_U4xSw",
    kind: "lush",
    variations: [{ height: 230, price: 30300, oldPrice: 45990, diameter: "155 см", weight: "26,4 кг" }],
  },
];

const heightOptions = ["Все", "до 150", "180–210", "от 230"];
const kindOptions = [
  { id: "all", label: "Все формы" },
  { id: "lush", label: "Пышные" },
  { id: "slim", label: "Узкие" },
];

const price = new Intl.NumberFormat("ru-RU");

function formatPrice(value: number) {
  return `${price.format(value)} ₽`;
}

function lowestPrice(tree: Tree) {
  return Math.min(...tree.variations.map((variation) => variation.price));
}

export default function Home() {
  const [height, setHeight] = useState("Все");
  const [kind, setKind] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [activeTree, setActiveTree] = useState<Tree | null>(null);
  const [activeHeight, setActiveHeight] = useState<number | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const activeVariation = activeTree?.variations.find((variation) => variation.height === activeHeight) ?? activeTree?.variations[0];
  const activeMedia = activeTree?.gallery?.[activeMediaIndex];

  const filteredTrees = useMemo(() => {
    return trees.filter((tree) => {
      const matchesKind = kind === "all" || tree.kind === kind;
      const matchesHeight =
        height === "Все" ||
        (height === "до 150" && tree.variations.some((variation) => variation.height <= 150)) ||
        (height === "180–210" && tree.variations.some((variation) => variation.height >= 180 && variation.height <= 210)) ||
        (height === "от 230" && tree.variations.some((variation) => variation.height >= 230));

      return matchesKind && matchesHeight;
    });
  }, [height, kind]);

  const visibleTrees = showAll ? filteredTrees : filteredTrees.slice(0, 6);

  function scrollToCatalog() {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }

  function openTree(tree: Tree) {
    setActiveTree(tree);
    setActiveHeight(tree.variations[0].height);
    setActiveMediaIndex(0);
  }

  function closeTree() {
    setActiveTree(null);
    setActiveHeight(null);
    setActiveMediaIndex(0);
  }

  return (
    <main>
      <section className="hero">
        <div className="shell hero-content">
          <nav className="topbar" aria-label="Главная навигация">
            <a className="brand" href="#top" aria-label="Каталог елей">
              <span className="brand-mark">Е</span>
              <span>Ели<br />в наличии</span>
            </a>
            <a className="nav-link" href="#catalog">Каталог</a>
            <button className="outline-button" onClick={scrollToCatalog}>Подобрать ёлку</button>
          </nav>

          <div className="hero-copy" id="top">
            <p className="eyebrow">Каталог остатков · сезон 2026</p>
            <h1>Выберите ёлку,<br />которую приятно <em>видеть дома.</em></h1>
            <p className="hero-text">
              Выберите высоту — и сразу увидите её цену, диаметр и наличие.
              Смотрите спокойно, без обязательной переписки.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={scrollToCatalog}>Смотреть каталог <span>↓</span></button>
              <p>На обложке — живое фото «Афродиты Премиум».<br />Фотогалереи и видео переносим в карточки моделей.</p>
            </div>
          </div>

          <div className="hero-image" aria-hidden="true" />

          <div className="hero-note">
            <span className="note-dot" />
            <span>Тестовая версия</span>
            <span className="note-divider" />
            <span>8 моделей из остатков</span>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="shell trust-grid">
          <p><strong>Доступные ростовки</strong><span>скрываем то, чего уже нет</span></p>
          <p><strong>Цена по выбранной высоте</strong><span>без путаницы с «от»</span></p>
          <p><strong>Реальные фотогалереи</strong><span>связаны с карточками моделей</span></p>
        </div>
      </section>

      <section className="catalog-section shell" id="catalog">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow dark">Выберите свою</p>
            <h2>Каталог елей</h2>
          </div>
          <p className="catalog-intro">Для сравнения откройте любую модель: там будут её размеры, фото, видео и детали комплектации.</p>
        </div>

        <div className="filters" aria-label="Фильтры каталога">
          <div className="filter-group">
            <span className="filter-label">Высота</span>
            <div className="filter-pills">
              {heightOptions.map((option) => (
                <button
                  key={option}
                  className={height === option ? "filter-pill active" : "filter-pill"}
                  onClick={() => setHeight(option)}
                >
                  {option === "Все" ? "Любая" : `${option} см`}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Форма</span>
            <div className="filter-pills">
              {kindOptions.map((option) => (
                <button
                  key={option.id}
                  className={kind === option.id ? "filter-pill active" : "filter-pill"}
                  onClick={() => setKind(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="result-count">Показано: {visibleTrees.length} из {filteredTrees.length} моделей</p>

        {visibleTrees.length ? (
          <div className="product-grid">
            {visibleTrees.map((tree) => (
              <article className="product-card" key={tree.id}>
                <button className="product-image" onClick={() => openTree(tree)} aria-label={`Открыть ${tree.name}`}>
                  <img src={tree.image} alt={`Ёлка ${tree.name}`} style={{ objectPosition: tree.imagePosition }} />
                  <span className="photo-label">Смотреть фото <b>↗</b></span>
                  {tree.badge && <span className="badge">{tree.badge}</span>}
                </button>
                <div className="product-info">
                  <p className="product-type">{tree.subtitle}</p>
                  <h3>{tree.name}</h3>
                  <p className="size-row"><span>В наличии</span>{tree.variations.map((variation) => variation.height).join(" · ")} см</p>
                  <div className="price-row">
                    <span>от</span>
                    <strong>{formatPrice(lowestPrice(tree))}</strong>
                  </div>
                  <button className="text-button" onClick={() => openTree(tree)}>Подробнее <span>→</span></button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>В этой тестовой подборке пока нет подходящей модели.</p>
            <button className="text-button" onClick={() => { setHeight("Все"); setKind("all"); }}>Сбросить фильтры <span>→</span></button>
          </div>
        )}

        {filteredTrees.length > 6 && (
          <button className="show-more" onClick={() => setShowAll((value) => !value)}>
            {showAll ? "Свернуть каталог" : `Показать ещё ${filteredTrees.length - visibleTrees.length} модели`}
            <span>{showAll ? "↑" : "↓"}</span>
          </button>
        )}
      </section>

      <section className="selection-callout">
        <div className="shell selection-inner">
          <div>
            <p className="eyebrow">Не хочется выбирать самому?</p>
            <h2>Скажите высоту,<br />бюджет и город.</h2>
          </div>
          <p>В следующей версии эта форма станет точкой входа для менеджера: он пришлёт 2–3 подходящие ёлки с живыми фото и видео.</p>
          <a className="light-button" href="tel:+79650298353">Связаться с Максимом <span>→</span></a>
        </div>
      </section>

      <footer className="shell footer">
        <a className="brand footer-brand" href="#top"><span className="brand-mark">Е</span><span>Ели в наличии</span></a>
        <p>Тестовый каталог по остаткам прошлого сезона.<br />Наличие и окончательную цену уточняйте перед заказом.</p>
      </footer>

      {activeTree && activeVariation && (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeTree}>
          <section className="product-modal" role="dialog" aria-modal="true" aria-label={`Модель ${activeTree.name}`} onMouseDown={(event) => event.stopPropagation()}>
            <button className="close-button" onClick={closeTree} aria-label="Закрыть">×</button>
            <div className="modal-gallery">
              <div className="modal-photo">
                {activeMedia?.kind === "video" ? (
                  <video controls playsInline preload="metadata" src={activeMedia.src} aria-label={activeMedia.alt} />
                ) : (
                  <img
                    src={activeMedia?.src ?? activeTree.image}
                    alt={activeMedia?.alt ?? `Ёлка ${activeTree.name}`}
                    style={{ objectPosition: activeMedia ? "center center" : activeTree.imagePosition }}
                  />
                )}
                <span>{activeMedia?.label ?? "Фото модели"}</span>
              </div>
              {activeTree.gallery && activeTree.gallery.length > 1 && (
                <div className="gallery-thumbnails" aria-label="Фотогалерея модели">
                  {activeTree.gallery.map((item, index) => (
                    <button
                      key={item.src}
                      type="button"
                      className={activeMediaIndex === index ? "gallery-thumbnail active" : "gallery-thumbnail"}
                      onClick={() => setActiveMediaIndex(index)}
                      aria-label={item.label}
                      aria-pressed={activeMediaIndex === index}
                    >
                      {item.kind === "video" ? <span>Видео</span> : <img src={item.src} alt="" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-content">
              <p className="eyebrow dark">В наличии</p>
              <h2>{activeTree.name}</h2>
              <p className="modal-subtitle">{activeTree.subtitle}</p>
              <p className="modal-price">{formatPrice(activeVariation.price)}</p>
              <div className="height-options" aria-label="Выберите высоту">
                {activeTree.variations.map((variation) => (
                  <button
                    className={activeVariation.height === variation.height ? "height-option active" : "height-option"}
                    key={variation.height}
                    onClick={() => setActiveHeight(variation.height)}
                  >
                    {variation.height} см
                  </button>
                ))}
              </div>
              <dl>
                <div><dt>Высота</dt><dd>{activeVariation.height} см</dd></div>
                <div><dt>Диаметр</dt><dd>{activeVariation.diameter}</dd></div>
                <div><dt>Хвоя</dt><dd>{activeTree.needles}</dd></div>
                <div><dt>Сборка</dt><dd>{activeTree.assembly}</dd></div>
                {activeTree.stand && <div><dt>Подставка</dt><dd>{activeTree.stand}</dd></div>}
                <div><dt>Вес</dt><dd>{activeVariation.weight}</dd></div>
              </dl>
              <div className="modal-notice"><span>✦</span>{activeTree.gallery ? "Листайте реальные фото модели: общий вид, хвоя, конструкция, подставка и видео." : "Откройте реальную фотогалерею этой модели."}</div>
              {!activeTree.gallery && activeTree.galleryUrl && <a className="gallery-link" href={activeTree.galleryUrl} target="_blank" rel="noreferrer">Открыть фотогалерею <span>↗</span></a>}
              <a className="primary-button modal-button" href="tel:+79650298353">Уточнить наличие <span>→</span></a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
