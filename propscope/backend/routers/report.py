"""POST /api/report/pdf 라우터"""
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import BaseModel

from ..crawlers.naver import NaverCrawler
from ..crawlers.zigbang import ZigbangCrawler
from ..models.filter import FilterCondition
from ..models.property import PropertyItem
from ..models.response import PropertyItemSchema, SearchResponse
from ..services.analyzer import analyze
from ..services.pdf_generator import generate_pdf
import asyncio

router = APIRouter()


class ReportRequest(BaseModel):
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


@router.post("/report/pdf")
async def generate_report(req: ReportRequest):
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

    naver_items, zigbang_items = await asyncio.gather(
        naver_crawler.fetch(condition),
        zigbang_crawler.fetch(condition),
        return_exceptions=True,
    )

    if isinstance(naver_items, Exception):
        naver_items = []
    if isinstance(zigbang_items, Exception):
        zigbang_items = []

    all_items: List[PropertyItem] = list(naver_items) + list(zigbang_items)
    stats = analyze(all_items)

    search_result = SearchResponse(
        region=req.region,
        collected_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        total=len(all_items),
        naver_count=len(naver_items),
        zigbang_count=len(zigbang_items),
        items=[_to_schema(i) for i in all_items],
        stats=stats,
    )

    pdf_bytes = generate_pdf(search_result)

    # WeasyPrint 미설치 시 HTML fallback
    if pdf_bytes[:4] == b"<!DO" or pdf_bytes[:9] == b"<!DOCTYPE":
        return Response(
            content=pdf_bytes,
            media_type="text/html; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="PropScope_{req.region}.html"'},
        )

    safe_region = req.region.replace(" ", "_")
    date_str = datetime.now().strftime("%Y%m%d")
    filename = f"PropScope_{safe_region}_{date_str}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
