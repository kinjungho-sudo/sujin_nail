"""네이버 부동산 크롤러 — Playwright (Chromium, headless)"""
import asyncio
import json
from typing import List, Optional

from .base import BaseCrawler
from ..models.filter import FilterCondition
from ..models.property import PropertyItem
from ..utils.price_parser import format_price_str, parse_price_to_man

# 네이버 부동산 내부 API
NAVER_API_URL = (
    "https://new.land.naver.com/api/articles/complex/{region_code}"
    "?realEstateType={estate_type}&tradeType=A1&page={page}&pageSize=20"
)

ESTATE_TYPE_MAP = {
    "빌라": "VL",
    "오피스텔": "OR",
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "ko-KR,ko;q=0.9",
    "Referer": "https://new.land.naver.com/",
}

MAX_PAGES = 5
SLEEP_SEC = 1.0


class NaverCrawler(BaseCrawler):
    SOURCE = "naver"

    async def fetch(self, condition: FilterCondition) -> List[PropertyItem]:
        try:
            from playwright.async_api import async_playwright
        except ImportError:
            self._log("Playwright 미설치 — 네이버 크롤링 건너뜀")
            return []

        results: List[PropertyItem] = []

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent=HEADERS["User-Agent"],
                extra_http_headers={k: v for k, v in HEADERS.items() if k != "User-Agent"},
            )

            for ptype in condition.property_types:
                estate_type = ESTATE_TYPE_MAP.get(ptype)
                if not estate_type:
                    self._log(f"알 수 없는 매물 유형: {ptype} — 건너뜀")
                    continue

                self._log(f"{ptype} 매물 수집 시작 (코드: {estate_type})")
                items = await self._fetch_by_type(context, condition, estate_type, ptype)
                results.extend(items)
                self._log(f"{ptype} 수집 완료: {len(items)}건")

            await browser.close()

        return results

    async def _fetch_by_type(
        self, context, condition: FilterCondition, estate_type: str, property_type_label: str
    ) -> List[PropertyItem]:
        items: List[PropertyItem] = []

        for page in range(1, MAX_PAGES + 1):
            url = NAVER_API_URL.format(
                region_code=condition.region_code,
                estate_type=estate_type,
                page=page,
            )

            try:
                response = await context.request.get(url)
                if response.status != 200:
                    self._log(f"  페이지 {page} 응답 오류: {response.status}")
                    break

                data = await response.json()
                article_list = data.get("articleList", [])

                if not article_list:
                    self._log(f"  페이지 {page} 매물 없음 — 중단")
                    break

                for raw in article_list:
                    item = self._parse_item(raw, property_type_label)
                    if item and self._passes_filter(item, condition):
                        items.append(item)

                self._log(f"  페이지 {page}: {len(article_list)}건 수집")

                # 마지막 페이지 확인
                if len(article_list) < 20:
                    break

            except Exception as e:
                self._log(f"  페이지 {page} 오류: {e}")
                break

            await asyncio.sleep(SLEEP_SEC)

        return items

    def _parse_item(self, raw: dict, property_type_label: str) -> Optional[PropertyItem]:
        try:
            price_str = raw.get("dealOrWarrantPrc", "")
            price_man = parse_price_to_man(price_str) if price_str else 0
            if price_man <= 0:
                return None

            area_val = raw.get("area2") or raw.get("area1") or ""
            floor_val = raw.get("floorInfo", "").split("/")[0].strip() if raw.get("floorInfo") else ""
            build_year = str(raw.get("buildYear", ""))

            article_no = raw.get("articleNo", "")
            url = f"https://new.land.naver.com/complexes/{article_no}" if article_no else ""

            return PropertyItem(
                source="naver",
                property_type=property_type_label,
                name=raw.get("articleName") or raw.get("complexName") or "",
                address=raw.get("buildingName") or raw.get("address") or "",
                price=format_price_str(price_man),
                area=f"{area_val}㎡" if area_val else "",
                floor=floor_val,
                build_year=build_year,
                description=raw.get("articleFeatureDesc") or "",
                url=url,
                lat=float(raw.get("lat") or 0),
                lng=float(raw.get("lng") or 0),
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
            floor_str = item.floor.replace("층", "").strip()
            floor = int(floor_str) if floor_str.isdigit() else 0
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
        crawler = NaverCrawler()
        items = await crawler.fetch(cond)
        print(f"수집 완료: {len(items)}건")
        for it in items[:3]:
            print(it)

    asyncio.run(_test())
