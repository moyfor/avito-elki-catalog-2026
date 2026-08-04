"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject, type TouchEvent as ReactTouchEvent } from "react";
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

type HeightFilter = "Все" | number;
type TouchPoint = { x: number; y: number };
type LightboxPan = { x: number; y: number };
type LightboxTouchState =
  | { mode: "swipe"; x: number; y: number }
  | { mode: "pan"; x: number; y: number; pan: LightboxPan }
  | { mode: "pinch"; distance: number; center: TouchPoint; zoom: number; pan: LightboxPan };
type GallerySlot =
  | "01_main"
  | "02_angle"
  | "03_branch"
  | "04_needles"
  | "05_stand"
  | "06_construction"
  | "07_video";
type GalleryStatus = "source" | "processing" | "approved" | "published";

type GalleryItem = {
  slot?: GallerySlot;
  role?: GallerySlot;
  title?: string;
  description?: string;
  source?: string;
  status?: GalleryStatus;
  src: string;
  alt: string;
  label: string;
  kind?: "image" | "video";
  thumbPosition?: string;
};

type Tree = {
  id: string;
  name: string;
  subtitle: string;
  needles: string;
  assembly: string;
  stand?: string;
  image: string;
  cardImage?: string;
  imagePosition: string;
  cardTone?: "studio";
  gallery?: GalleryItem[];
  galleryUrl?: string;
  kind: "lush" | "slim";
  badge?: string;
  variations: TreeVariation[];
};

const placeholderCatalogImage = "/catalog/hero-atmosphere.png";
const placeholderCatalogPosition = "center center";
const metalStand = "Металл";

const variation = (height: number, price: number, oldPrice: number, diameter = "—", weight = "—"): TreeVariation => ({
  height,
  price,
  oldPrice,
  diameter,
  weight,
});

const trees: Tree[] = [
  {
    id: "afrodita",
    name: "Афродита Премиум",
    subtitle: "Выразительная, с густой кроной",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    stand: metalStand,
    image: "/catalog-live/afrodita-hero.jpg",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/YL3N2aXdPyYa9A",
    kind: "lush",
    badge: "Премиум",
    variations: [
      variation(240, 18900, 34990, "150 см", "—"),
    ],
  },
  {
    id: "tayga",
    name: "Тайга",
    subtitle: "Натуральный силуэт для дома",
    needles: "Литые ветки + ПВХ",
    assembly: "Шарнирная сборка",
    stand: "Железная складная",
    image: "/catalog-live/tayga/01_main.webp",
    cardImage: "/catalog-live/tayga/01_main_card.webp",
    imagePosition: "center center",
    cardTone: "studio",
    gallery: [
      {
        slot: "01_main",
        role: "01_main",
        title: "Главная фотография",
        description: "Основное фото модели Тайга для карточки и начала галереи.",
        source: "/catalog-live/tayga/01_main.webp",
        status: "published",
        src: "/catalog-live/tayga/01_main.webp",
        alt: "Ёлка Тайга, главная фотография",
        label: "Главная фотография",
        thumbPosition: "50% 45%",
      },
      {
        slot: "02_angle",
        role: "02_angle",
        title: "Ракурс 45°",
        description: "Ракурс для оценки силуэта, объёма и формы модели.",
        source: "/catalog-live/tayga/02_angle.jpg",
        status: "published",
        src: "/catalog-live/tayga/02_angle.jpg",
        alt: "Ёлка Тайга, ракурс 45 градусов",
        label: "Ракурс 45°",
        thumbPosition: "82% 50%",
      },
      {
        slot: "03_branch",
        role: "03_branch",
        title: "Ветка",
        description: "Крупный план ветки для оценки сборки и фактуры.",
        source: "/catalog-live/tayga-needles.jpg",
        status: "published",
        src: "/catalog-live/tayga/03_branch.jpg",
        alt: "Ветка ёлки Тайга крупным планом",
        label: "Ветка",
        thumbPosition: "48% 50%",
      },
      {
        slot: "04_needles",
        role: "04_needles",
        title: "Хвоя",
        description: "Макро хвои для оценки материала, цвета и смешанного типа веток.",
        source: "/catalog-live/tayga-angle-02.jpg",
        status: "published",
        src: "/catalog-live/tayga/04_needles.jpg",
        alt: "Хвоя ёлки Тайга крупным планом",
        label: "Хвоя",
        thumbPosition: "82% 50%",
      },
      {
        slot: "05_stand",
        role: "05_stand",
        title: "Подставка",
        description: "Фото комплектной железной складной подставки.",
        source: "/catalog-live/tayga-stand.jpg",
        status: "published",
        src: "/catalog-live/tayga/05_stand.jpg",
        alt: "Железная складная подставка ёлки Тайга",
        label: "Подставка",
        thumbPosition: "76% 54%",
      },
      {
        slot: "06_construction",
        role: "06_construction",
        title: "Крепление ветвей",
        description: "Деталь конструкции и крепления ветвей.",
        source: "/catalog-live/tayga-detail-02.jpg",
        status: "published",
        src: "/catalog-live/tayga/06_construction.jpg",
        alt: "Крепление ветвей ёлки Тайга",
        label: "Крепление ветвей",
        thumbPosition: "48% 42%",
      },
      {
        slot: "07_video",
        role: "07_video",
        title: "Видео",
        description: "Видео реальной модели Тайга.",
        source: "/catalog-live/tayga-motion-web.mov",
        status: "published",
        src: "/catalog-live/tayga/07_video.mov",
        alt: "Видео ёлки Тайга",
        label: "Видео",
        kind: "video",
      },
    ],
    kind: "lush",
    badge: "Топ продаж",
    variations: [
      variation(210, 9700, 16900, "—", "—"),
      variation(240, 13900, 23490, "155 см", "—"),
    ],
  },
  {
    id: "krasavitsa",
    name: "Красавица светлая",
    subtitle: "Светлый оттенок хвои, Беларусь",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: "/catalog-live/krasavitsa-svetlaya-main.jpg",
    imagePosition: "17% center",
    galleryUrl: "https://disk.yandex.ru/d/0eLf81pnauaqpA",
    kind: "lush",
    variations: [
      variation(190, 13500, 19490, "130 см", "12,5 кг"),
      variation(220, 15900, 26490, "140 см", "17 кг"),
    ],
  },
  {
    id: "lady",
    name: "Леди",
    subtitle: "Аккуратная и пышная классика",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    stand: metalStand,
    image: "/catalog/lady.png",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/DuwumiPk8ZZffA",
    kind: "lush",
    badge: "Топ продаж",
    variations: [
      variation(210, 12800, 16900, "128 см", "—"),
      variation(270, 24500, 31000, "130 см", "—"),
    ],
  },
  {
    id: "victoria",
    name: "Виктория Премиум",
    subtitle: "Строгая форма и литая хвоя",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    stand: metalStand,
    image: "/catalog/victoria.png",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/UAyPgIUojCBLAw",
    kind: "lush",
    badge: "Премиум",
    variations: [
      variation(210, 16800, 29990, "135 см", "16,9 кг"),
    ],
  },
  {
    id: "baikal",
    name: "Байкал",
    subtitle: "Большая ёлка для просторной комнаты",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: "/catalog-live/baikal-main.jpg",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/_VFuToIuu2lbJQ",
    kind: "lush",
    variations: [
      variation(230, 25800, 39990, "145 см", "22,7 кг"),
    ],
  },
  {
    id: "prezidentskaya",
    name: "Президентская",
    subtitle: "Пышная форма с выразительным объёмом",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: "/catalog/prezidentskaya.png",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/wuL5LiG7dK7cVw",
    kind: "lush",
    badge: "Премиум",
    variations: [
      variation(210, 22200, 36990, "140 см", "16,1 кг"),
      variation(230, 27400, 37990, "155 см", "21,5 кг"),
    ],
  },
  {
    id: "voronezhskaya",
    name: "Воронежская",
    subtitle: "Крупная модель с натуральной формой",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: "/catalog-live/voronezhskaya-main.jpg",
    imagePosition: "18% center",
    galleryUrl: "https://disk.yandex.ru/d/IBMP6CuH_U4xSw",
    kind: "lush",
    variations: [
      variation(230, 30300, 45990, "155 см", "26,4 кг"),
    ],
  },
  {
    id: "krymskaya-zelenaya-uzkaya",
    name: "Крымская зелёная узкая",
    subtitle: "Узкий силуэт для компактной комнаты",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "slim",
    variations: [variation(210, 26500, 36990, "100 см", "16,7 кг")],
  },
  {
    id: "krymskaya-golubaya-uzkaya",
    name: "Крымская голубая узкая",
    subtitle: "Холодный оттенок хвои и узкая форма",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "slim",
    variations: [variation(240, 27700, 37990, "115 см", "20,2 кг")],
  },
  {
    id: "koroleva-karpat-uzkaya",
    name: "Королева-Карпат узкая",
    subtitle: "Узкая форма для аккуратной постановки",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "slim",
    variations: [
      variation(230, 21600, 36990, "110 см", "16,3 кг"),
      variation(250, 29600, 37990, "125 см", "22,6 кг"),
    ],
  },
  {
    id: "koroleva-karpat-zasnezhennaya",
    name: "Королева-Карпат заснеженная",
    subtitle: "Заснеженная хвоя и отгибная сборка",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    variations: [
      variation(180, 13300, 36990, "110 см", "12,2 кг"),
      variation(210, 16800, 37990, "125 см", "14,4 кг"),
    ],
  },
  {
    id: "karnaval-zasnezhennaya",
    name: "Карнавал заснеженная",
    subtitle: "Заснеженная модель в классической форме",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    variations: [
      variation(180, 9900, 36990, "—", "—"),
    ],
  },
  {
    id: "dvoryanskaya-zelenaya",
    name: "Дворянская зелёная",
    subtitle: "Классическая зелёная модель с литой хвоей",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    variations: [variation(250, 32200, 48990, "145 см", "24,1 кг")],
  },
  {
    id: "dvoryanskaya-golubaya",
    name: "Дворянская голубая",
    subtitle: "Голубой оттенок хвои в классической форме",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    variations: [variation(230, 24400, 39990, "135 см", "19,7 кг")],
  },
  {
    id: "taezhnaya-lux",
    name: "Таёжная Люкс",
    subtitle: "Плотная литая хвоя и популярные размеры",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    badge: "Топ продаж",
    variations: [
      variation(210, 15600, 22900, "—", "—"),
      variation(230, 18200, 34490, "—", "—"),
    ],
  },
  {
    id: "krasavitsa-tyomnaya",
    name: "Красавица тёмная",
    subtitle: "Тёмный оттенок хвои, Беларусь",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    badge: "Топ продаж",
    variations: [
      variation(220, 15900, 26490, "140 см", "16,9 кг"),
    ],
  },
  {
    id: "simfoniya-s-girlyandoy",
    name: "Симфония с гирляндой",
    subtitle: "Встроенная гирлянда и тёплый свет",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    badge: "Топ продаж",
    variations: [variation(240, 25500, 52490, "146 см", "16,9 кг")],
  },
  {
    id: "imperatorskaya-svetlaya",
    name: "Императорская светлая",
    subtitle: "Светлый оттенок хвои, Беларусь",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    variations: [
      variation(190, 12500, 19490, "120 см", "11,5 кг"),
      variation(220, 14500, 26490, "130 см", "14,5 кг"),
    ],
  },
  {
    id: "edelveys-premium",
    name: "Эдельвейс Премиум",
    subtitle: "Широкий силуэт премиальной серии",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    badge: "Премиум",
    variations: [
      variation(180, 10500, 23990, "120 см", "—"),
      variation(240, 17300, 34990, "190 см", "—"),
    ],
  },
  {
    id: "bogema-premium",
    name: "Богема Премиум",
    subtitle: "Премиальная серия с аккуратной формой",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    badge: "Премиум",
    variations: [variation(240, 19800, 34990, "135 см", "—")],
  },
  {
    id: "sibir-tyomnaya",
    name: "Сибирь тёмная",
    subtitle: "Тёмный оттенок хвои, Беларусь",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    variations: [variation(270, 24900, 41990, "170 см", "—")],
  },
  {
    id: "lyusiya-snezhnaya",
    name: "Люсия снежная",
    subtitle: "Снежная фактура и шарнирная сборка",
    needles: "100% литые ветки",
    assembly: "Шарнирная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    badge: "Топ продаж",
    variations: [variation(180, 10450, 22900, "110 см", "12,5 кг")],
  },
  {
    id: "lyusiya-snezhnaya-s-girlyandoy",
    name: "Люсия снежная с гирляндой",
    subtitle: "Снежная хвоя и встроенная гирлянда",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    badge: "Топ продаж",
    variations: [variation(180, 13950, 22900, "110 см", "12,5 кг")],
  },
  {
    id: "dvoryanskaya-zasnezhennaya",
    name: "Дворянская заснеженная",
    subtitle: "Заснеженная версия классической серии",
    needles: "100% литые ветки",
    assembly: "Отгибная сборка",
    stand: metalStand,
    image: placeholderCatalogImage,
    imagePosition: placeholderCatalogPosition,
    kind: "lush",
    variations: [
      variation(180, 17100, 29990, "110 см", "13,9 кг"),
      variation(210, 22600, 37990, "125 см", "16,5 кг"),
      variation(230, 29700, 44990, "135 см", "22,5 кг"),
    ],
  },
];

const heightOptions: HeightFilter[] = ["Все", ...Array.from(new Set(trees.flatMap((tree) => tree.variations.map((variation) => variation.height)))).sort((left, right) => left - right)];
const LIGHTBOX_MIN_ZOOM = 1;
const LIGHTBOX_MAX_ZOOM = 2.75;

const price = new Intl.NumberFormat("ru-RU");

function formatPrice(value: number) {
  return `${price.format(value)} ₽`;
}

function formatSizeCount(value: number) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return `${value} размер`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${value} размера`;
  return `${value} размеров`;
}

function matchesHeightFilter(tree: Tree, height: HeightFilter) {
  return height === "Все" || tree.variations.some((variation) => variation.height === height);
}

function getInitialVariation(tree: Tree, height: HeightFilter) {
  return tree.variations.find((variation) => height !== "Все" && variation.height === height) ?? tree.variations[0];
}

function handleSwipeStart(event: ReactTouchEvent<HTMLElement>, ref: MutableRefObject<TouchPoint | null>) {
  const touch = event.touches[0];
  ref.current = { x: touch.clientX, y: touch.clientY };
}

function handleSwipeEnd(
  event: ReactTouchEvent<HTMLElement>,
  ref: MutableRefObject<TouchPoint | null>,
  onSwipe: (direction: 1 | -1) => void,
) {
  const start = ref.current;
  ref.current = null;

  if (!start) return false;

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - start.x;
  const deltaY = touch.clientY - start.y;

  if (Math.abs(deltaX) < 44 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.15) {
    return false;
  }

  onSwipe(deltaX < 0 ? 1 : -1);
  return true;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTouchDistance(touches: TouchList) {
  const first = touches[0];
  const second = touches[1];
  if (!first || !second) return 0;
  return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
}

function getTouchCenter(touches: TouchList): TouchPoint {
  const first = touches[0];
  const second = touches[1];
  if (!first || !second) return { x: 0, y: 0 };
  return {
    x: (first.clientX + second.clientX) / 2,
    y: (first.clientY + second.clientY) / 2,
  };
}

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
    const style = window.getComputedStyle(element);
    return !element.hidden && style.display !== "none" && style.visibility !== "hidden";
  });
}

function trapFocus(event: KeyboardEvent, container: HTMLElement) {
  const focusable = getFocusableElements(container);

  if (!focusable.length) {
    event.preventDefault();
    container.focus({ preventScroll: true });
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!container.contains(document.activeElement)) {
    event.preventDefault();
    first.focus({ preventScroll: true });
    return;
  }

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus({ preventScroll: true });
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  }
}

export default function Home() {
  const [height, setHeight] = useState<HeightFilter>("Все");
  const [showAll, setShowAll] = useState(false);
  const [activeTree, setActiveTree] = useState<Tree | null>(null);
  const [activeHeight, setActiveHeight] = useState<number | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPan, setLightboxPan] = useState<LightboxPan>({ x: 0, y: 0 });
  const [isLightboxGesturing, setIsLightboxGesturing] = useState(false);
  const modalRef = useRef<HTMLElement | null>(null);
  const lightboxRef = useRef<HTMLElement | null>(null);
  const lightboxStageRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const lightboxReturnRef = useRef<HTMLElement | null>(null);
  const modalSwipeStartRef = useRef<TouchPoint | null>(null);
  const lightboxTouchStateRef = useRef<LightboxTouchState | null>(null);
  const lightboxTransformRef = useRef({ zoom: 1, pan: { x: 0, y: 0 } });
  const suppressLightboxOpenUntilRef = useRef(0);

  const activeVariation = activeTree?.variations.find((variation) => variation.height === activeHeight) ?? activeTree?.variations[0];
  const activeMedia = activeTree?.gallery?.[activeMediaIndex];
  const galleryLength = activeTree?.gallery?.length ?? 0;

  const filteredTrees = useMemo(() => {
    return trees.filter((tree) => matchesHeightFilter(tree, height));
  }, [height]);

  const visibleTrees = showAll ? filteredTrees : filteredTrees.slice(0, 6);

  function scrollToCatalog() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("catalog")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  function clampLightboxPan(pan: LightboxPan, zoom: number) {
    const stage = lightboxStageRef.current;
    if (zoom <= 1 || !stage) return { x: 0, y: 0 };

    const maxX = (stage.clientWidth * (zoom - 1)) / 2;
    const maxY = (stage.clientHeight * (zoom - 1)) / 2;
    return {
      x: clamp(pan.x, -maxX, maxX),
      y: clamp(pan.y, -maxY, maxY),
    };
  }

  function applyLightboxTransform(zoom: number, pan: LightboxPan = lightboxTransformRef.current.pan) {
    const nextZoom = clamp(zoom, LIGHTBOX_MIN_ZOOM, LIGHTBOX_MAX_ZOOM);
    const nextPan = clampLightboxPan(pan, nextZoom);
    lightboxTransformRef.current = { zoom: nextZoom, pan: nextPan };
    setLightboxZoom(nextZoom);
    setLightboxPan(nextPan);
  }

  function resetLightboxTransform() {
    lightboxTouchStateRef.current = null;
    lightboxTransformRef.current = { zoom: 1, pan: { x: 0, y: 0 } };
    setLightboxZoom(1);
    setLightboxPan({ x: 0, y: 0 });
    setIsLightboxGesturing(false);
  }

  function openTree(tree: Tree, opener?: HTMLElement) {
    lastFocusedElementRef.current = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setActiveTree(tree);
    setActiveHeight(getInitialVariation(tree, height).height);
    setActiveMediaIndex(0);
    setIsLightboxOpen(false);
    resetLightboxTransform();
  }

  function closeTree() {
    const opener = lastFocusedElementRef.current;
    setActiveTree(null);
    setActiveHeight(null);
    setActiveMediaIndex(0);
    setIsLightboxOpen(false);
    resetLightboxTransform();
    lightboxReturnRef.current = null;
    lastFocusedElementRef.current = null;
    requestAnimationFrame(() => opener?.isConnected && opener.focus({ preventScroll: true }));
  }

  function setMedia(index: number) {
    setActiveMediaIndex(index);
    resetLightboxTransform();
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

  function openLightbox(opener?: HTMLElement) {
    if (activeMedia?.kind === "video") return;
    lightboxReturnRef.current = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    resetLightboxTransform();
    setIsLightboxOpen(true);
  }

  function closeLightbox(restoreFocus = true) {
    const returnTo = lightboxReturnRef.current;
    setIsLightboxOpen(false);
    resetLightboxTransform();
    lightboxReturnRef.current = null;
    if (restoreFocus) requestAnimationFrame(() => returnTo?.isConnected && returnTo.focus({ preventScroll: true }));
  }

  function handleLightboxTouchStart(event: ReactTouchEvent<HTMLDivElement>) {
    if (event.touches.length >= 2) {
      const distance = getTouchDistance(event.touches);
      lightboxTouchStateRef.current = {
        mode: "pinch",
        distance,
        center: getTouchCenter(event.touches),
        zoom: lightboxTransformRef.current.zoom,
        pan: lightboxTransformRef.current.pan,
      };
      setIsLightboxGesturing(true);
      event.preventDefault();
      return;
    }

    const touch = event.touches[0];
    if (!touch) return;

    if (lightboxTransformRef.current.zoom > 1) {
      lightboxTouchStateRef.current = {
        mode: "pan",
        x: touch.clientX,
        y: touch.clientY,
        pan: lightboxTransformRef.current.pan,
      };
      setIsLightboxGesturing(true);
      event.preventDefault();
      return;
    }

    lightboxTouchStateRef.current = { mode: "swipe", x: touch.clientX, y: touch.clientY };
  }

  function handleLightboxTouchMove(event: ReactTouchEvent<HTMLDivElement>) {
    const gesture = lightboxTouchStateRef.current;
    if (!gesture) return;

    if (event.touches.length >= 2) {
      const distance = getTouchDistance(event.touches);
      const center = getTouchCenter(event.touches);
      const pinch = gesture.mode === "pinch"
        ? gesture
        : {
          mode: "pinch" as const,
          distance,
          center,
          zoom: lightboxTransformRef.current.zoom,
          pan: lightboxTransformRef.current.pan,
        };

      lightboxTouchStateRef.current = pinch;
      const nextZoom = pinch.distance > 0 ? pinch.zoom * (distance / pinch.distance) : pinch.zoom;
      applyLightboxTransform(nextZoom, {
        x: pinch.pan.x + center.x - pinch.center.x,
        y: pinch.pan.y + center.y - pinch.center.y,
      });
      setIsLightboxGesturing(true);
      event.preventDefault();
      return;
    }

    if (gesture.mode !== "pan") return;

    const touch = event.touches[0];
    if (!touch) return;

    applyLightboxTransform(lightboxTransformRef.current.zoom, {
      x: gesture.pan.x + touch.clientX - gesture.x,
      y: gesture.pan.y + touch.clientY - gesture.y,
    });
    event.preventDefault();
  }

  function handleLightboxTouchEnd(event: ReactTouchEvent<HTMLDivElement>) {
    const gesture = lightboxTouchStateRef.current;
    if (!gesture) return;

    if (gesture.mode === "swipe") {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - gesture.x;
      const deltaY = touch.clientY - gesture.y;
      lightboxTouchStateRef.current = null;

      if (Math.abs(deltaX) >= 44 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
        moveMedia(deltaX < 0 ? 1 : -1, true);
      }
      return;
    }

    if (event.touches.length === 1 && lightboxTransformRef.current.zoom > 1) {
      const touch = event.touches[0];
      lightboxTouchStateRef.current = {
        mode: "pan",
        x: touch.clientX,
        y: touch.clientY,
        pan: lightboxTransformRef.current.pan,
      };
      return;
    }

    lightboxTouchStateRef.current = null;
    setIsLightboxGesturing(false);
    if (lightboxTransformRef.current.zoom <= 1) applyLightboxTransform(1, { x: 0, y: 0 });
  }

  useEffect(() => {
    if (!activeTree || isLightboxOpen) return;
    requestAnimationFrame(() => modalRef.current?.focus({ preventScroll: true }));
  }, [activeTree, isLightboxOpen]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    requestAnimationFrame(() => lightboxRef.current?.focus({ preventScroll: true }));
  }, [isLightboxOpen]);

  useEffect(() => {
    if (!activeTree) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isLightboxOpen) closeLightbox();
        else closeTree();
      }

      if (event.key === "Tab") {
        const activeFocusArea = isLightboxOpen ? lightboxRef.current : modalRef.current;
        if (activeFocusArea) {
          trapFocus(event, activeFocusArea);
          return;
        }
      }

      if (isLightboxOpen) {
        if (event.key === "ArrowLeft") moveMedia(-1, true);
        if (event.key === "ArrowRight") moveMedia(1, true);
        return;
      }

      if (event.key === "ArrowLeft") moveMedia(-1);
      if (event.key === "ArrowRight") moveMedia(1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTree, activeMediaIndex, isLightboxOpen]);

  return (
    <main>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="shell hero-content">
          <nav className="topbar" aria-label="Главная навигация">
            <a className="brand" href="#top" aria-label="Ёлки Тут — каталог искусственных елей">
              <span className="brand-mark">Ё</span>
              <span><strong>Ёлки Тут</strong><small>Каталог искусственных елей</small></span>
            </a>
          </nav>

          <div className="hero-stage">
            <div className="hero-copy">
              <p className="eyebrow">Коллекция 2026</p>
              <h1 id="hero-title">Ёлки, с которыми дома начинается праздник</h1>
              <p className="hero-text">
                Реальные модели, актуальные размеры, цены, фото и видео — всё для быстрого выбора.
              </p>
              <div className="hero-actions">
                <button className="primary-button" onClick={scrollToCatalog}>Смотреть каталог <span>↓</span></button>
                <p className="hero-trust">Реальные модели • Актуальные размеры • Помощь с выбором</p>
              </div>
            </div>
            <div className="hero-ornament" aria-hidden="true">
              <span className="ornament-line one" />
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-section shell" id="catalog">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow dark">Каталог</p>
            <h2>Выберите свою ёлку</h2>
          </div>
          <p className="catalog-intro">Откройте модель, выберите высоту и посмотрите подробные фото.</p>
        </div>

        <div className="filters" aria-label="Фильтры каталога">
          <div className="filter-group">
            <span className="filter-label">Высота</span>
            <div className="filter-pills">
              {heightOptions.map((option) => (
                <button
                  key={option}
                  className={height === option ? "filter-pill active" : "filter-pill"}
                  onClick={() => { setHeight(option); setShowAll(false); }}
                  aria-pressed={height === option}
                >
                  {option}
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
                <button className={tree.cardTone === "studio" ? "product-image product-image-studio" : "product-image"} onClick={(event) => openTree(tree, event.currentTarget)} aria-label={`Открыть ${tree.name}`}>
                  <img src={tree.cardImage ?? tree.image} alt={`Ёлка ${tree.name}`} style={{ objectPosition: tree.imagePosition }} />
                  <span className="photo-label">{tree.gallery || tree.galleryUrl ? "Все фото" : "Открыть"} <ArrowRight weight="bold" aria-hidden="true" /></span>
                  {tree.badge && <span className="badge">{tree.badge}</span>}
                </button>
                <div className="product-info">
                  <div className="product-copy">
                    <h3 className="product-name">{tree.name}</h3>
                    <p className="product-type">{tree.subtitle}</p>
                    <p className="product-facts">{tree.needles} · {tree.assembly}</p>
                  </div>
                  <div className="product-pricing">
                    <div className="product-availability" aria-label={`В наличии ${formatSizeCount(tree.variations.length)}`}>
                      <span className="product-availability-label">В наличии</span>
                      <span className="product-availability-value">{formatSizeCount(tree.variations.length)}</span>
                    </div>
                    <div className="product-prices" aria-label={`Размеры и цены модели ${tree.name}`}>
                      {tree.variations.map((variation) => (
                        <div className={height === variation.height ? "product-price-item active" : "product-price-item"} key={variation.height}>
                          <span className="product-price-size">{variation.height} см</span>
                          <span className="product-price-rule" aria-hidden="true" />
                          <strong>{formatPrice(variation.price)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="product-open-button" onClick={(event) => openTree(tree, event.currentTarget)}>Открыть модель <ArrowRight weight="bold" aria-hidden="true" /></button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>В этой тестовой подборке пока нет подходящей модели.</p>
            <button className="text-button" onClick={() => { setHeight("Все"); setShowAll(false); }}>Сбросить фильтры <span>→</span></button>
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
        <a className="brand footer-brand" href="#top"><span className="brand-mark">Ё</span><span><strong>Ёлки Тут</strong><small>Каталог искусственных елей</small></span></a>
        <p>Каталог остатков прошлого сезона.<br />Наличие и окончательную цену уточняйте перед заказом.</p>
      </footer>

      {activeTree && activeVariation && (
        <>
          <div className="modal-backdrop" role="presentation" onClick={closeTree}>
            <section ref={modalRef} className="product-modal" role="dialog" aria-modal="true" aria-label={`Модель ${activeTree.name}`} tabIndex={-1} onClick={(event) => event.stopPropagation()}>
              <button className="close-button" type="button" onClick={closeTree} aria-label="Закрыть карточку модели"><X weight="bold" aria-hidden="true" /></button>
              <div className="modal-gallery">
                <div
                  className="modal-photo"
                  onTouchStart={(event) => handleSwipeStart(event, modalSwipeStartRef)}
                  onTouchEnd={(event) => {
                    const swiped = handleSwipeEnd(event, modalSwipeStartRef, (direction) => moveMedia(direction));
                    if (swiped) suppressLightboxOpenUntilRef.current = Date.now() + 320;
                  }}
                >
                  {activeMedia?.kind === "video" ? (
                    <video controls playsInline preload="metadata" src={activeMedia.src} aria-label={activeMedia.alt} />
                  ) : (
                    <img
                      className="modal-photo-image"
                      src={activeMedia?.src ?? activeTree.image}
                      alt={activeMedia?.alt ?? `Ёлка ${activeTree.name}`}
                      style={{ objectPosition: activeMedia ? "center center" : activeTree.imagePosition }}
                      onClick={(event) => {
                        if (Date.now() < suppressLightboxOpenUntilRef.current) return;
                        openLightbox(event.currentTarget);
                      }}
                    />
                  )}
                  {galleryLength > 1 && (
                    <>
                      <button className="gallery-control gallery-control-prev" type="button" onClick={() => moveMedia(-1)} aria-label="Предыдущее фото или видео"><ArrowLeft weight="bold" aria-hidden="true" /></button>
                      <button className="gallery-control gallery-control-next" type="button" onClick={() => moveMedia(1)} aria-label="Следующее фото или видео"><ArrowRight weight="bold" aria-hidden="true" /></button>
                    </>
                  )}
                  {activeMedia?.kind !== "video" && (
                    <button className="open-lightbox" type="button" onClick={(event) => openLightbox(event.currentTarget)} aria-label="Открыть фото на весь экран">
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
                        key={item.slot ?? item.src}
                        type="button"
                        className={activeMediaIndex === index ? "gallery-thumbnail active" : "gallery-thumbnail"}
                        onClick={() => setMedia(index)}
                        aria-label={item.label}
                        aria-pressed={activeMediaIndex === index}
                      >
                        {item.kind === "video" ? <span><Play weight="fill" aria-hidden="true" /></span> : <img src={item.src} alt="" style={{ objectPosition: item.thumbPosition ?? "50% 50%" }} />}
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
                      aria-pressed={activeVariation.height === variation.height}
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
                <div className="modal-notice"><span>✦</span>{activeTree.gallery ? "Нажмите на фото, чтобы открыть его на весь экран. Свайп и стрелки листают галерею." : "Нажмите на фото, чтобы открыть его на весь экран."}</div>
                {!activeTree.gallery && activeTree.galleryUrl && <a className="gallery-link" href={activeTree.galleryUrl} target="_blank" rel="noreferrer">Открыть фотогалерею <ArrowRight weight="bold" aria-hidden="true" /></a>}
                <a className="primary-button modal-button" href="tel:+79650298353">Уточнить наличие <ArrowRight weight="bold" aria-hidden="true" /></a>
              </div>
            </section>
          </div>

          {isLightboxOpen && activeMedia?.kind !== "video" && (
            <div className="lightbox-backdrop" role="presentation" onClick={() => closeLightbox()}>
              <section ref={lightboxRef} className="lightbox" role="dialog" aria-modal="true" aria-label={`Фото модели ${activeTree.name}`} tabIndex={-1} onClick={(event) => event.stopPropagation()}>
                <div className="lightbox-topbar">
                  <p>{activeMedia?.label ?? "Фото модели"}</p>
                  <div className="lightbox-actions">
                    <button type="button" onClick={() => applyLightboxTransform(lightboxZoom - 0.25)} aria-label="Уменьшить фото" disabled={lightboxZoom === 1}><MagnifyingGlassMinus weight="bold" aria-hidden="true" /></button>
                    <button type="button" onClick={() => applyLightboxTransform(lightboxZoom + 0.25)} aria-label="Увеличить фото"><MagnifyingGlassPlus weight="bold" aria-hidden="true" /></button>
                    <button type="button" onClick={() => closeLightbox()} aria-label="Закрыть просмотр фото"><X weight="bold" aria-hidden="true" /></button>
                  </div>
                </div>
                <div
                  ref={lightboxStageRef}
                  className={`lightbox-stage${lightboxZoom > 1 ? " is-zoomed" : ""}${isLightboxGesturing ? " is-gesturing" : ""}`}
                  onTouchStart={handleLightboxTouchStart}
                  onTouchMove={handleLightboxTouchMove}
                  onTouchEnd={handleLightboxTouchEnd}
                  onTouchCancel={handleLightboxTouchEnd}
                >
                  {galleryLength > 1 && <button className="lightbox-nav lightbox-nav-prev" type="button" onClick={() => moveMedia(-1, true)} aria-label="Предыдущее фото"><ArrowLeft weight="bold" aria-hidden="true" /></button>}
                  <img
                    src={activeMedia?.src ?? activeTree.image}
                    alt={activeMedia?.alt ?? `Ёлка ${activeTree.name}`}
                    draggable={false}
                    style={{ transform: `translate3d(${lightboxPan.x}px, ${lightboxPan.y}px, 0) scale(${lightboxZoom})` }}
                  />
                  {galleryLength > 1 && <button className="lightbox-nav lightbox-nav-next" type="button" onClick={() => moveMedia(1, true)} aria-label="Следующее фото"><ArrowRight weight="bold" aria-hidden="true" /></button>}
                </div>
                <p className="lightbox-hint">Свайп листает фото. Двумя пальцами можно увеличить и двигать изображение.</p>
              </section>
            </div>
          )}
        </>
      )}
    </main>
  );
}
