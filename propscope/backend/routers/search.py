"""POST /api/search 라우터"""
import asyncio
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..crawlers.naver import NaverCrawler
from ..crawlers.zigbang import ZigbangCrawler
from ..models.filter import FilterCondition
from ..models.property import PropertyItem
from ..models.response import PropertyItemSchema, SearchResponse
from ..services.analyzer import analyze

router = APIRouter()


class SearchRequest(BaseModel):
    region:      str
    region_code: str = ""
    lat:         float
    lng:         float
    types:       List[str] = ["빌라", "오피스텔"]
    price_min:   Optional[int] = None
    price_max:   Optional[int] = None
    area_min:    Optional[float] = None
    area_max:    Optional[float] = None
    floor_min:   Optional[int] = None
    floor_max:   Optional[int] = None
    build_year:  Optional[int] = None


def _to_schema(item: PropertyItem) -> PropertyItemSchema:
    return PropertyItemSchema(
        source=item.source,
        property_type=item.property_type,
        name=item.name,
        address=item.address,
        price=item.price,
        area=item.area,
        floor=item.floor,
        build_year=item.build_year,
        description=item.description,
        url=item.url,
        lat=item.lat,
        lng=item.lng,
    )


@router.post("/search", response_model=SearchResponse)
async def search(req: SearchRequest):
    condition = FilterCondition(
        region_name=req.region,
        region_code=req.region_code,
        lat=req.lat,
        lng=req.lng,
        property_types=req.types,
        price_min=req.price_min,
        price_max=req.price_max,
        area_min=req.area_min,
        area_max=req.area_max,
        floor_min=req.floor_min,
        floor_max=req.floor_max,
        build_year_min=req.build_year,
    )

    naver_crawler = NaverCrawler()
    zigbang_crawler = ZigbangCrawler()

    # 두 크롤러 병렬 실행
    naver_task = naver_crawler.fetch(condition)
    zigbang_task = zigbang_crawler.fetch(condition)

    try:
        naver_items, zigbang_items = await asyncio.gather(
            naver_task, zigbang_task, return_exceptions=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"크롤링 오류: {str(e)}")

    # 예외 처리
    if isinstance(naver_items, Exception):
        print(f"[search] 네이버 크롤링 오류: {naver_items}")
        naver_items = []
    if isinstance(zigbang_items, Exception):
        print(f"[search] 직방 크롤링 오류: {zigbang_items}")
        zigbang_items = []

    all_items: List[PropertyItem] = list(naver_items) + list(zigbang_items)

    # 통계 분석
    stats = analyze(all_items)

    return SearchResponse(
        region=req.region,
        collected_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        total=len(all_items),
        naver_count=len(naver_items),
        zigbang_count=len(zigbang_items),
        items=[_to_schema(i) for i in all_items],
        stats=stats,
    )
