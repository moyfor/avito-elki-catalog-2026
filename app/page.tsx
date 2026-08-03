"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowsOutSimple,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Play,
  X,
} from "@phosphor-icons/react";

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
        src: "/catalog-live/tayga-motion-web.mov",
        alt: "Видео ёлки Тайга",
        label: "Видео реальной модели · 12 с",
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const activeVariation = activeTree?.variations.find((variation) => variation.height === activeHeight) ?? activeTree?.variations[0];
  const activeMedia = activeTree?.gallery?.[activeMediaIndex];
  const galleryLength = activeTree?.gallery?.length ?? 0;

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
    setIsLightboxOpen(false);
    setLightboxZoom(1);
  }

  function closeTree() {
    setActiveTree(null);
    setActiveHeight(null);
    setActiveMediaIndex(0);
    setIsLightboxOpen(false);
    setLightboxZoom(1);
  }

  function setMedia(index: number) {
    setActiveMediaIndex(index);
    setLightboxZoom(1);
  }

  function moveMedia(direction: 1 | -1, imagesOnly = false) {
    if (!activeTree?.gallery?.length) return;

    const gallery = activeTree.gallery;
    for (let step = 1; step <= gallery.length; step += 1) {
      const nextIndex = (activeMediaIndex + direction * step + gallery.length) % gallery.length;
      if (!imagesOnly || gallery[nextIndex].kind !== "video") {
        setMedia(nextIndex);
        return;
      }
    }
  }

  function openLightbox() {
    if (activeMedia?.kind === "video") return;
    setLightboxZoom(1);
    setIsLightboxOpen(true);
  }

  function closeLightbox() {
    setIsLightboxOpen(false);
    setLightboxZoom(1);
  }

  useEffect(() => {
    if (!activeTree) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isLightboxOpen) closeLightbox();
        else closeTree();
      }

      if (!isLightboxOpen) return;
      if (event.key === "ArrowLeft") moveMedia(-1, true);
      if (event.key === "ArrowRight") moveMedia(1, true);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTree, activeMediaIndex, isLightboxOpen]);

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
            <p className="eyebrow">Каталог елей · сезон 2026</p>
            <h1>Ёлка, с которой дома становится <em>празднично.</em></h1>
            <p className="hero-text">
              Смотрите спокойно: ростовки, цены, наличие, живые фото и видео
              собраны в одном каталоге.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={scrollToCatalog}>Смотреть каталог <span>↓</span></button>
              <p>На обложке — настроение. В карточках — реальные фото конкретных моделей.</p>
            </div>
          </div>

          <div className="hero-image" aria-hidden="true" />

          <div className="hero-note">
            <span className="note-dot" />
            <span>Актуальные остатки</span>
            <span className="note-divider" />
            <span>8 моделей из остатков</span>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="shell trust-grid">
          <p><strong>Ростовки в наличии</strong><span>показываем только доступные размеры</span></p>
          <p><strong>Цена по высоте</strong><span>выбрали рост — сразу видно цену</span></p>
          <p><strong>Живые материалы</strong><span>фото, видео, хвоя и комплектация в карточках</span></p>
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
                  <span className="photo-label">Открыть галерею <ArrowRight weight="bold" aria-hidden="true" /></span>
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
                  <button className="text-button" onClick={() => openTree(tree)}>Подробнее <ArrowRight weight="bold" aria-hidden="true" /></button>
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
          <p>Напишите высоту, бюджет и город — подберём 2–3 подходящие модели с реальными фото и видео.</p>
          <a className="light-button" href="tel:+79650298353">Связаться с Максимом <ArrowRight weight="bold" aria-hidden="true" /></a>
        </div>
      </section>

      <footer className="shell footer">
        <a className="brand footer-brand" href="#top"><span className="brand-mark">Е</span><span>Ели в наличии</span></a>
        <p>Каталог остатков прошлого сезона.<br />Наличие и окончательную цену уточняйте перед заказом.</p>
      </footer>

      {activeTree && activeVariation && (
        <>
          <div className="modal-backdrop" role="presentation" onMouseDown={closeTree}>
            <section className="product-modal" role="dialog" aria-modal="true" aria-label={`Модель ${activeTree.name}`} onMouseDown={(event) => event.stopPropagation()}>
              <button className="close-button" type="button" onClick={closeTree} aria-label="Закрыть карточку модели"><X weight="bold" aria-hidden="true" /></button>
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
                  {galleryLength > 1 && (
                    <>
                      <button className="gallery-control gallery-control-prev" type="button" onClick={() => moveMedia(-1)} aria-label="Предыдущее фото или видео"><ArrowLeft weight="bold" aria-hidden="true" /></button>
                      <button className="gallery-control gallery-control-next" type="button" onClick={() => moveMedia(1)} aria-label="Следующее фото или видео"><ArrowRight weight="bold" aria-hidden="true" /></button>
                    </>
                  )}
                  {activeMedia?.kind !== "video" && (
                    <button className="open-lightbox" type="button" onClick={openLightbox} aria-label="Открыть фото на весь экран">
                      <ArrowsOutSimple weight="bold" aria-hidden="true" />
                      <span>На весь экран</span>
                    </button>
                  )}
                  <div className="photo-meta">
                    <span>{activeMedia?.label ?? "Фото модели"}</span>
                    {galleryLength > 1 && <b>{activeMediaIndex + 1} / {galleryLength}</b>}
                  </div>
                </div>
                {activeTree.gallery && activeTree.gallery.length > 1 && (
                  <div className={activeTree.gallery.length === 6 ? "gallery-thumbnails has-six" : "gallery-thumbnails"} aria-label="Фотогалерея модели">
                    {activeTree.gallery.map((item, index) => (
                      <button
                        key={item.src}
                        type="button"
                        className={activeMediaIndex === index ? "gallery-thumbnail active" : "gallery-thumbnail"}
                        onClick={() => setMedia(index)}
                        aria-label={item.label}
                        aria-pressed={activeMediaIndex === index}
                      >
                        {item.kind === "video" ? <span><Play weight="fill" aria-hidden="true" /></span> : <img src={item.src} alt="" />}
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
                <div className="modal-notice"><span>✦</span>{activeTree.gallery ? "Нажмите на фото, чтобы открыть его на весь экран. Стрелки листают галерею." : "Нажмите на фото, чтобы открыть его на весь экран."}</div>
                {!activeTree.gallery && activeTree.galleryUrl && <a className="gallery-link" href={activeTree.galleryUrl} target="_blank" rel="noreferrer">Открыть фотогалерею <ArrowRight weight="bold" aria-hidden="true" /></a>}
                <a className="primary-button modal-button" href="tel:+79650298353">Уточнить наличие <ArrowRight weight="bold" aria-hidden="true" /></a>
              </div>
            </section>
          </div>

          {isLightboxOpen && activeMedia?.kind !== "video" && (
            <div className="lightbox-backdrop" role="presentation" onMouseDown={closeLightbox}>
              <section className="lightbox" role="dialog" aria-modal="true" aria-label={`Фото модели ${activeTree.name}`} onMouseDown={(event) => event.stopPropagation()}>
                <div className="lightbox-topbar">
                  <p>{activeMedia?.label ?? "Фото модели"}</p>
                  <div className="lightbox-actions">
                    <button type="button" onClick={() => setLightboxZoom((value) => Math.max(1, value - 0.25))} aria-label="Уменьшить фото" disabled={lightboxZoom === 1}><MagnifyingGlassMinus weight="bold" aria-hidden="true" /></button>
                    <button type="button" onClick={() => setLightboxZoom((value) => Math.min(2.25, value + 0.25))} aria-label="Увеличить фото"><MagnifyingGlassPlus weight="bold" aria-hidden="true" /></button>
                    <button type="button" onClick={closeLightbox} aria-label="Закрыть просмотр фото"><X weight="bold" aria-hidden="true" /></button>
                  </div>
                </div>
                <div className="lightbox-stage">
                  {galleryLength > 1 && <button className="lightbox-nav lightbox-nav-prev" type="button" onClick={() => moveMedia(-1, true)} aria-label="Предыдущее фото"><ArrowLeft weight="bold" aria-hidden="true" /></button>}
                  <img src={activeMedia?.src ?? activeTree.image} alt={activeMedia?.alt ?? `Ёлка ${activeTree.name}`} style={{ transform: `scale(${lightboxZoom})` }} />
                  {galleryLength > 1 && <button className="lightbox-nav lightbox-nav-next" type="button" onClick={() => moveMedia(1, true)} aria-label="Следующее фото"><ArrowRight weight="bold" aria-hidden="true" /></button>}
                </div>
                <p className="lightbox-hint">Используйте +/− для масштаба. Стрелки листают фото.</p>
              </section>
            </div>
          )}
        </>
      )}
    </main>
  );
}
