from dataclasses import dataclass, field
from typing import Optional


@dataclass
class FilterCondition:
    """매매 전용 필터 조건 — 전세·월세 필드 없음"""
    region_name:    str
    region_code:    str
    lat:            float
    lng:            float
    property_types: list
    price_min:      Optional[int] = None
    price_max:      Optional[int] = None
    area_min:       Optional[float] = None
    area_max:       Optional[float] = None
    floor_min:      Optional[int] = None
    floor_max:      Optional[int] = None
    build_year_min: Optional[int] = None

    TRADE_TYPE: str = field(default="매매", init=False)
