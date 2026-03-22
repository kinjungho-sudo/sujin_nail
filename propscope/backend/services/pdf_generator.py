"""PDF 리포트 생성 서비스 — Jinja2 + WeasyPrint"""
import os
from pathlib import Path
from typing import List

from jinja2 import Environment, FileSystemLoader, select_autoescape

from ..models.property import PropertyItem
from ..models.response import SearchResponse
from ..utils.price_parser import parse_price_to_man

TEMPLATE_DIR = Path(__file__).resolve().parent.parent.parent / "templates"


def _get_jinja_env() -> Environment:
    return Environment(
        loader=FileSystemLoader(str(TEMPLATE_DIR)),
        autoescape=select_autoescape(["html"]),
    )


def _calc_bar_pct(naver_avg: str, zigbang_avg: str) -> tuple:
    """바 차트 너비 비율 계산 (최대 90%)"""
    n = parse_price_to_man(naver_avg)
    z = parse_price_to_man(zigbang_avg)
    max_val = max(n, z, 1)
    naver_pct = round(n / max_val * 90, 1)
    zigbang_pct = round(z / max_val * 90, 1)
    return naver_pct, zigbang_pct


def render_html(search_result: SearchResponse) -> str:
    """SearchResponse 데이터를 HTML 문자열로 렌더링"""
    env = _get_jinja_env()
    template = env.get_template("report.html")

    naver_pct, zigbang_pct = _calc_bar_pct(
        search_result.stats.naver_avg_str,
        search_result.stats.zigbang_avg_str,
    )

    return template.render(
        region=search_result.region,
        collected_at=search_result.collected_at,
        total=search_result.total,
        naver_count=search_result.naver_count,
        zigbang_count=search_result.zigbang_count,
        items=search_result.items,
        stats=search_result.stats,
        naver_pct=naver_pct,
        zigbang_pct=zigbang_pct,
    )


def generate_pdf(search_result: SearchResponse) -> bytes:
    """
    SearchResponse 데이터를 PDF bytes로 변환.

    WeasyPrint 미설치 시 HTML fallback 자동 적용.

    Returns:
        PDF bytes (또는 HTML bytes fallback)
    """
    html_str = render_html(search_result)

    try:
        from weasyprint import HTML
        pdf_bytes = HTML(string=html_str, base_url=str(TEMPLATE_DIR)).write_pdf()
        return pdf_bytes
    except ImportError:
        print("[pdf_generator] WeasyPrint 미설치 — HTML fallback 반환")
        return html_str.encode("utf-8")
    except Exception as e:
        print(f"[pdf_generator] PDF 생성 오류: {e} — HTML fallback 반환")
        return html_str.encode("utf-8")


if __name__ == "__main__":
    """단독 실행 테스트 — 샘플 데이터로 test_report.pdf 생성"""
    from datetime import datetime
    from ..models.response import (
        SearchResponse, PropertyItemSchema, StatsSchema, TypeStats
    )

    sample_items = [
        PropertyItemSchema(
            source="naver", property_type="빌라",
            name="공덕힐빌라", address="서울 마포구 공덕동 123",
            price="2억 8,000만원", area="59.89㎡", floor="3",
            build_year="2010", url="https://new.land.naver.com/",
        ),
        PropertyItemSchema(
            source="zigbang", property_type="오피스텔",
            name="공덕스퀘어오피스텔", address="서울 마포구 공덕동 456",
            price="3억 5,000만원", area="45.2㎡", floor="7",
            build_year="2018", url="https://www.zigbang.com/",
        ),
    ]

    sample_stats = StatsSchema(
        avg_price_str="3억 1,500만원",
        min_price_str="2억 8,000만원",
        max_price_str="3억 5,000만원",
        naver_avg_str="2억 8,000만원",
        zigbang_avg_str="3억 5,000만원",
        price_gap_str="7,000만원",
        gap_note="직방이 높음 (7,000만원 차이)",
        by_type={
            "빌라": TypeStats(count=1, avg_price_str="2억 8,000만원", 평당가_str="1,550만원"),
            "오피스텔": TypeStats(count=1, avg_price_str="3억 5,000만원", 평당가_str="2,560만원"),
        },
        top5_lowest=sample_items[:1],
        top5_highest=sample_items[1:],
    )

    sample_response = SearchResponse(
        region="서울 마포구 공덕동",
        collected_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        total=2,
        naver_count=1,
        zigbang_count=1,
        items=sample_items,
        stats=sample_stats,
    )

    pdf_bytes = generate_pdf(sample_response)
    out_path = Path("test_report.pdf")
    out_path.write_bytes(pdf_bytes)
    print(f"✅ 리포트 생성 완료: {out_path.resolve()} ({len(pdf_bytes):,} bytes)")
