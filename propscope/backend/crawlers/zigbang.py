"""직방 크롤러 — requests 기반 (JS 렌더링 불필요)"""
import asyncio
import time
from typing import List, Optional

import requests

from .base import BaseCrawler
from ..models.filter import FilterCondition
from ..models.property import PropertyItem
from ..utils.price_parser import format_price_str, parse_price_to_man

# 직방 서비스 타입 매핑
PROPERTY_TYPE_MAP = {
    "빌라": "villa",
    "오피스텔": "officetel",
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json",
    "Referer": "https://www.zigbang.com/",
}

GEO_ITEMS_URL = "https://apis.zigbang.com/v2/items/geo-items"
ITEMS_DETAIL_URL = "https://apis.zigbang.com/v2/items"
BATCH_SIZE = 100
SLEEP_SEC = 0.5


class ZigbangCrawler(BaseCrawler):
    SOURCE = "zigbang"

    async def fetch(self, condition: FilterCondition) -> List[PropertyItem]:
        results: List[PropertyItem] = []

        for ptype in condition.property_types:
            service_type = PROPERTY_TYPE_MAP.get(ptype)
            if not service_type:
                self._log(f"알 수 없는 매물 유형: {ptype} — 건너뜀")
                continue

            self._log(f"{ptype} 매물 수집 시작 (서비스타입: {service_type})")
            items = await asyncio.to_thread(
                self._fetch_by_type, condition, service_type, ptype
            )
            results.extend(items)
            self._log(f"{ptype} 수집 완료: {len(items)}건")

        return results

    def _fetch_by_type(
        self,
        condition: FilterCondition,
        service_type: str,
        property_type_label: str,
    ) -> List[PropertyItem]:
        # Step 1: 매물 ID 목록 수집
        item_ids = self._get_item_ids(condition, service_type)
        if not item_ids:
            return []

        self._log(f"  ID 수집: {len(item_ids)}건 → 상세 조회 시작")

        # Step 2: 배치 상세 조회
        items: List[PropertyItem] = []
        for i in range(0, len(item_ids), BATCH_SIZE):
            batch = item_ids[i : i + BATCH_SIZE]
            details = self._get_item_details(batch, service_type)
            for d in details:
                item = self._parse_item(d, property_type_label)
                if item and self._passes_filter(item, condition):
                    items.append(item)
            time.sleep(SLEEP_SEC)

        return items

    def _get_item_ids(
        self, condition: FilterCondition, service_type: str
    ) -> List[str]:
        params = {
            "serviceType": service_type,
            "transactionType": "buy",  # 매매 고정
            "lat": condition.lat,
            "lng": condition.lng,
            "radius": 1000,
            "zoom": 15,
        }
        try:
            resp = requests.get(GEO_ITEMS_URL, params=params, headers=HEADERS, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            return [str(item.get("itemId", "")) for item in data.get("items", []) if item.get("itemId")]
        except Exception as e:
            self._log(f"  ID 수집 실패: {e}")
            return []

    def _get_item_details(self, item_ids: List[str], service_type: str) -> List[dict]:
        params = {
            "serviceType": service_type,
            "itemIds": ",".join(item_ids),
        }
        try:
            resp = requests.get(ITEMS_DETAIL_URL, params=params, headers=HEADERS, timeout=20)
            resp.raise_for_status()
            data = resp.json()
            return data.get("items", [])
        except Exception as e:
            self._log(f"  상세 조회 실패: {e}")
            return []

    def _parse_item(self, raw: dict, property_type_label: str) -> Optional[PropertyItem]:
        try:
            article = raw.get("article", raw)
            price_raw = article.get("price", 0)
            price_man = int(price_raw) if price_raw else 0
            if price_man <= 0:
                return None

            area_val = article.get("exclusiveArea") or article.get("area") or ""
            floor_val = article.get("floor") or article.get("currentFloor") or ""
            build_year_raw = article.get("buildYear") or article.get("approvalDate") or ""
            build_year = str(build_year_raw)[:4] if build_year_raw else ""

            return PropertyItem(
                source="zigbang",
                property_type=property_type_label,
                name=article.get("buildingName") or article.get("name") or "",
                address=article.get("address") or article.get("roadAddress") or "",
                price=format_price_str(price_man),
                area=f"{area_val}㎡" if area_val else "",
                floor=str(floor_val),
                build_year=build_year,
                description=article.get("description") or "",
                url=f"https://www.zigbang.com/home/{article.get('serviceType','')}/{article.get('itemId','')}",
                lat=float(article.get("lat") or 0),
                lng=float(article.get("lng") or 0),
            )
        except Exception as e:
            self._log(f"  파싱 오류: {e}")
            return None

    def _passes_filter(self, item: PropertyItem, cond: FilterCondition) -> bool:
        from ..utils.price_parser import parse_price_to_man, parse_area_to_float

        price = parse_price_to_man(item.price)
        if cond.price_min and price < cond.price_min:
            return False
        if cond.price_max and price > cond.price_max:
            return False

        area = parse_area_to_float(item.area)
        if cond.area_min and area < cond.area_min:
            return False
        if cond.area_max and area > cond.area_max:
            return False

        try:
            floor = int(item.floor) if item.floor.isdigit() else 0
            if cond.floor_min and floor > 0 and floor < cond.floor_min:
                return False
            if cond.floor_max and floor > 0 and floor > cond.floor_max:
                return False
        except Exception:
            pass

        try:
            build_year = int(item.build_year) if item.build_year.isdigit() else 0
            if cond.build_year_min and build_year > 0 and build_year < cond.build_year_min:
                return False
        except Exception:
            pass

        return True


if __name__ == "__main__":
    import asyncio
    from ..models.filter import FilterCondition

    async def _test():
        cond = FilterCondition(
            region_name="서울 마포구 공덕동",
            region_code="1144010200",
            lat=37.5443,
            lng=126.9510,
            property_types=["빌라", "오피스텔"],
            price_min=5000,
            price_max=80000,
            build_year_min=2000,
        )
        crawler = ZigbangCrawler()
        items = await crawler.fetch(cond)
        print(f"수집 완료: {len(items)}건")
        for it in items[:3]:
            print(it)

    asyncio.run(_test())
