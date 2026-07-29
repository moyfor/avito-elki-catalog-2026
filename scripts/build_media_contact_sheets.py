"""Build local contact sheets from the public Yandex Disk galleries used by the catalog.

Only public previews are downloaded. This never uploads, changes, or republishes
the source media; it helps select real product material for the catalog.
"""

from __future__ import annotations

import io
import json
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "research" / "media-contact-sheets"
INVENTORY = ROOT / "research" / "2026-07-28-медиа-реестр.json"
API_URL = "https://cloud-api.yandex.net/v1/disk/public/resources"

GALLERIES = {
    "afrodita-premium": {"title": "Афродита Премиум", "key": "https://disk.yandex.ru/d/YL3N2aXdPyYa9A"},
    "tayga": {"title": "Тайга", "key": "https://disk.yandex.ru/d/206VvEUPu84xXg", "paths": ["/Фото", "/Видео"]},
    "krasavitsa-svetlaya": {"title": "Красавица светлая", "key": "https://disk.yandex.ru/d/0eLf81pnauaqpA"},
    "lady": {"title": "Леди", "key": "https://disk.yandex.ru/d/DuwumiPk8ZZffA", "paths": ["/Леди 230"]},
    "victoria-premium": {"title": "Виктория Премиум", "key": "https://disk.yandex.ru/d/UAyPgIUojCBLAw"},
    "baikal": {"title": "Байкал", "key": "https://disk.yandex.ru/d/_VFuToIuu2lbJQ"},
    "prezidentskaya": {"title": "Президентская", "key": "https://disk.yandex.ru/d/wuL5LiG7dK7cVw"},
    "voronezhskaya": {"title": "Воронежская", "key": "https://disk.yandex.ru/d/IBMP6CuH_U4xSw"},
}


def get_json(key: str, path: str | None = None) -> dict:
    params = {
        "public_key": key,
        "limit": 100,
        "fields": "_embedded.total,_embedded.items.name,_embedded.items.media_type,_embedded.items.preview",
    }
    if path:
        params["path"] = path
    request = Request(f"{API_URL}?{urlencode(params)}", headers={"User-Agent": "CatalogMediaAudit/1.0"})
    with urlopen(request, timeout=30) as response:
        return json.load(response)


def load_preview(url: str) -> Image.Image:
    request = Request(url, headers={"User-Agent": "CatalogMediaAudit/1.0"})
    with urlopen(request, timeout=30) as response:
        return Image.open(io.BytesIO(response.read())).convert("RGB")


def font(size: int) -> ImageFont.ImageFont:
    for candidate in (
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    ):
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def build_sheet(title: str, items: list[dict], output: Path) -> None:
    columns, tile_w, tile_h, gutter, header_h = 4, 260, 220, 14, 76
    rows = max(1, (len(items) + columns - 1) // columns)
    canvas = Image.new("RGB", (columns * tile_w + (columns + 1) * gutter, header_h + rows * tile_h + (rows + 1) * gutter), "#faf9f4")
    draw = ImageDraw.Draw(canvas)
    draw.text((gutter, 16), f"{title}: {len(items)} материалов", fill="#123b30", font=font(26))
    draw.text((gutter, 48), "Номера и имена нужны только для отбора живых кадров; источник — исходная публичная галерея.", fill="#537269", font=font(12))

    for index, item in enumerate(items):
        row, column = divmod(index, columns)
        x = gutter + column * (tile_w + gutter)
        y = header_h + gutter + row * (tile_h + gutter)
        tile = Image.new("RGB", (tile_w, tile_h), "#e8ede6")
        try:
            preview = load_preview(item["preview"])
            fitted = ImageOps.contain(preview, (tile_w, tile_h - 38))
            tile.paste(fitted, ((tile_w - fitted.width) // 2, 0))
        except Exception as error:  # A single broken preview must not stop the audit.
            ImageDraw.Draw(tile).text((12, 18), f"Не удалось загрузить превью\n{type(error).__name__}", fill="#8b3a3a", font=font(13))
        tile_draw = ImageDraw.Draw(tile)
        label = f"{index + 1}. {item['name']}"
        if item.get("media_type") == "video":
            label = "▶ " + label
        tile_draw.rectangle((0, tile_h - 38, tile_w, tile_h), fill="#123b30")
        tile_draw.text((9, tile_h - 28), label[:39], fill="white", font=font(12))
        canvas.paste(tile, (x, y))

    canvas.save(output, quality=87, optimize=True)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    inventory: dict[str, dict] = {}
    for slug, gallery in GALLERIES.items():
        paths = gallery.get("paths") or [None]
        items: list[dict] = []
        for path in paths:
            resource = get_json(gallery["key"], path)
            for item in resource.get("_embedded", {}).get("items", []):
                if item.get("preview"):
                    items.append({
                        "name": item.get("name", "Без имени"),
                        "media_type": item.get("media_type") or "unknown",
                        "source_path": path,
                        "has_preview": True,
                    })
        # Downloadable previews are only used during this run; no expiring preview URLs are stored in inventory.
        resource_items = []
        for path in paths:
            resource = get_json(gallery["key"], path)
            resource_items.extend(item for item in resource.get("_embedded", {}).get("items", []) if item.get("preview"))
        build_sheet(gallery["title"], resource_items, OUTPUT / f"{slug}.jpg")
        inventory[slug] = {
            "model": gallery["title"],
            "source_gallery": gallery["key"],
            "photos": sum(item["media_type"] == "image" for item in items),
            "videos": sum(item["media_type"] == "video" for item in items),
            "items": items,
        }
        print(f"{gallery['title']}: {inventory[slug]['photos']} фото, {inventory[slug]['videos']} видео")
    INVENTORY.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
