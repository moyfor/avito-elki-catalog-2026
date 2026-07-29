"""Download the selected real main photos for the local catalog.

Only files selected in research/2026-07-28-медиа-отбор-первая-волна.md are
downloaded from public source galleries. No source file is modified or uploaded.
"""

from __future__ import annotations

from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "catalog-live"
API_URL = "https://cloud-api.yandex.net/v1/disk/public/resources"

SELECTIONS = [
    {
        "model": "Тайга",
        "key": "https://disk.yandex.ru/d/206VvEUPu84xXg",
        "path": "/Фото",
        "source_name": "IMG_9853.jpg",
        "output": "tayga-main.jpg",
    },
    {
        "model": "Красавица светлая",
        "key": "https://disk.yandex.ru/d/0eLf81pnauaqpA",
        "path": None,
        "source_name": "IMG_8618.JPG",
        "output": "krasavitsa-svetlaya-main.jpg",
    },
    {
        "model": "Леди",
        "key": "https://disk.yandex.ru/d/DuwumiPk8ZZffA",
        "path": "/Леди 230",
        "source_name": "DSC_0037.JPG",
        "output": "lady-main.jpg",
    },
    {
        "model": "Байкал",
        "key": "https://disk.yandex.ru/d/_VFuToIuu2lbJQ",
        "path": None,
        "source_name": "R_Y61s2tasg.jpg",
        "output": "baikal-main.jpg",
    },
    {
        "model": "Воронежская",
        "key": "https://disk.yandex.ru/d/IBMP6CuH_U4xSw",
        "path": None,
        "source_name": "ksb-QQmu-LA.jpg",
        "output": "voronezhskaya-main.jpg",
    },
]


def get_items(key: str, path: str | None) -> list[dict]:
    params = {
        "public_key": key,
        "limit": 100,
        "fields": "_embedded.items.name,_embedded.items.file,_embedded.items.media_type",
    }
    if path:
        params["path"] = path
    request = Request(f"{API_URL}?{urlencode(params)}", headers={"User-Agent": "CatalogMediaImport/1.0"})
    with urlopen(request, timeout=30) as response:
        return json.load(response).get("_embedded", {}).get("items", [])


def download(url: str, output: Path) -> None:
    request = Request(url, headers={"User-Agent": "CatalogMediaImport/1.0"})
    with urlopen(request, timeout=60) as response:
        output.write_bytes(response.read())


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for selection in SELECTIONS:
        item = next((item for item in get_items(selection["key"], selection["path"]) if item.get("name") == selection["source_name"]), None)
        if not item or not item.get("file"):
            raise RuntimeError(f"Не найден исходник {selection['source_name']} для модели «{selection['model']}»")
        target = OUTPUT / selection["output"]
        download(item["file"], target)
        print(f"{selection['model']}: {target.name} ({target.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
