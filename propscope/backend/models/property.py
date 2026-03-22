from dataclasses import dataclass, field


@dataclass
class PropertyItem:
    """매매 매물 — 보증금·월세 필드 없음"""
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
