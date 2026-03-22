from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class PropertyItemSchema(BaseModel):
    source:        str
    property_type: str
    name:          str
    address:       str
    price:         str
    area:          str
    floor:         str
    build_year:    str
    description:   str = ""
    url:           str = ""
    lat:           float = 0.0
    lng:           float = 0.0


class TypeStats(BaseModel):
    count:         int
    avg_price_str: str
    평당가_str:    str


class StatsSchema(BaseModel):
    avg_price_str:   str
    min_price_str:   str
    max_price_str:   str
    naver_avg_str:   str
    zigbang_avg_str: str
    price_gap_str:   str
    gap_note:        str
    by_type:         Dict[str, TypeStats]
    top5_lowest:     List[PropertyItemSchema]
    top5_highest:    List[PropertyItemSchema]


class SearchResponse(BaseModel):
    region:        str
    collected_at:  str
    total:         int
    naver_count:   int
    zigbang_count: int
    items:         List[PropertyItemSchema]
    stats:         StatsSchema


class RegionCodeResponse(BaseModel):
    region: str
    code:   str


class HealthResponse(BaseModel):
    status:    str
    timestamp: str
