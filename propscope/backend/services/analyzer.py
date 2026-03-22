"""통계·갭 분석 서비스"""
from typing import List, Dict, Any

from ..models.property import PropertyItem
from ..models.response import PropertyItemSchema, StatsSchema, TypeStats
from ..utils.price_parser import (
    parse_price_to_man,
    parse_area_to_float,
    format_price_str,
    sqm_to_pyeong,
)


def analyze(items: List[PropertyItem]) -> StatsSchema:
    """
    매물 리스트에서 전체 통계 및 사이트/유형별 분석 결과를 반환.

    Args:
        items: 수집된 PropertyItem 리스트

    Returns:
        StatsSchema
    """
    if not items:
        empty = format_price_str(0)
        return StatsSchema(
            avg_price_str=empty,
            min_price_str=empty,
            max_price_str=empty,
            naver_avg_str=empty,
            zigbang_avg_str=empty,
            price_gap_str=empty,
            gap_note="매물 없음",
            by_type={},
            top5_lowest=[],
            top5_highest=[],
        )

    def to_man(item: PropertyItem) -> int:
        return parse_price_to_man(item.price)

    prices = [to_man(i) for i in items]
    prices_nonzero = [p for p in prices if p > 0]

    avg_price = int(sum(prices_nonzero) / len(prices_nonzero)) if prices_nonzero else 0
    min_price = min(prices_nonzero) if prices_nonzero else 0
    max_price = max(prices_nonzero) if prices_nonzero else 0

    # 사이트별 평균
    naver_prices = [to_man(i) for i in items if i.source == "naver" and to_man(i) > 0]
    zigbang_prices = [to_man(i) for i in items if i.source == "zigbang" and to_man(i) > 0]

    naver_avg = int(sum(naver_prices) / len(naver_prices)) if naver_prices else 0
    zigbang_avg = int(sum(zigbang_prices) / len(zigbang_prices)) if zigbang_prices else 0

    gap = abs(naver_avg - zigbang_avg)
    if naver_avg > zigbang_avg:
        gap_note = f"네이버가 높음 ({format_price_str(gap)} 차이)"
    elif zigbang_avg > naver_avg:
        gap_note = f"직방이 높음 ({format_price_str(gap)} 차이)"
    else:
        gap_note = "두 사이트 평균 동일"

    # 유형별 분석
    by_type: Dict[str, TypeStats] = {}
    all_types = set(i.property_type for i in items)
    for ptype in all_types:
        type_items = [i for i in items if i.property_type == ptype]
        type_prices = [to_man(i) for i in type_items if to_man(i) > 0]
        type_avg = int(sum(type_prices) / len(type_prices)) if type_prices else 0

        # 평당가 계산
        per_pyeong_list = []
        for i in type_items:
            p = to_man(i)
            a = parse_area_to_float(i.area)
            if p > 0 and a > 0:
                py = sqm_to_pyeong(a)
                if py > 0:
                    per_pyeong_list.append(int(p / py))

        avg_per_pyeong = int(sum(per_pyeong_list) / len(per_pyeong_list)) if per_pyeong_list else 0

        by_type[ptype] = TypeStats(
            count=len(type_items),
            avg_price_str=format_price_str(type_avg),
            평당가_str=format_price_str(avg_per_pyeong) if avg_per_pyeong else "-",
        )

    # TOP 5 최저가·최고가
    sorted_asc = sorted(items, key=lambda i: to_man(i) if to_man(i) > 0 else 999999999)
    sorted_desc = sorted(items, key=lambda i: to_man(i), reverse=True)

    def to_schema(item: PropertyItem) -> PropertyItemSchema:
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

    top5_lowest = [to_schema(i) for i in sorted_asc[:5]]
    top5_highest = [to_schema(i) for i in sorted_desc[:5]]

    return StatsSchema(
        avg_price_str=format_price_str(avg_price),
        min_price_str=format_price_str(min_price),
        max_price_str=format_price_str(max_price),
        naver_avg_str=format_price_str(naver_avg),
        zigbang_avg_str=format_price_str(zigbang_avg),
        price_gap_str=format_price_str(gap),
        gap_note=gap_note,
        by_type=by_type,
        top5_lowest=top5_lowest,
        top5_highest=top5_highest,
    )
