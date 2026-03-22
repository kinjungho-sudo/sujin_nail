"""가격 문자열 파싱 유틸"""
import re


def parse_price_to_man(price_str: str) -> int:
    """
    다양한 형태의 가격 문자열을 만원 단위 정수로 변환.

    Examples:
        "3억 2,000만원" → 32000
        "5억"           → 50000
        "2,500만원"     → 2500
        "12500"         → 12500  (이미 숫자)
    """
    if not price_str:
        return 0

    price_str = str(price_str).strip().replace(",", "")

    # 숫자만 있는 경우 (이미 만원 단위)
    if re.fullmatch(r"\d+", price_str):
        return int(price_str)

    total = 0

    # 억 단위 추출
    eok_match = re.search(r"(\d+)\s*억", price_str)
    if eok_match:
        total += int(eok_match.group(1)) * 10000

    # 만원 단위 추출
    man_match = re.search(r"(\d+)\s*만", price_str)
    if man_match:
        total += int(man_match.group(1))

    return total


def format_price_str(man_price: int) -> str:
    """
    만원 단위 정수를 읽기 좋은 문자열로 변환.

    Examples:
        32000 → "3억 2,000만원"
        50000 → "5억"
        2500  → "2,500만원"
        0     → "0만원"
    """
    if man_price <= 0:
        return "0만원"

    eok = man_price // 10000
    man = man_price % 10000

    if eok > 0 and man > 0:
        return f"{eok}억 {man:,}만원"
    elif eok > 0:
        return f"{eok}억"
    else:
        return f"{man:,}만원"


def parse_area_to_float(area_str: str) -> float:
    """
    면적 문자열에서 숫자(㎡) 추출.

    Examples:
        "59.89㎡" → 59.89
        "84"      → 84.0
    """
    if not area_str:
        return 0.0
    match = re.search(r"[\d.]+", str(area_str))
    return float(match.group()) if match else 0.0


def sqm_to_pyeong(sqm: float) -> float:
    """㎡ → 평 변환 (1평 ≈ 3.3058㎡)"""
    return sqm / 3.3058 if sqm > 0 else 0.0


def calc_price_per_pyeong_str(price_man: int, area_sqm: float) -> str:
    """평당가 계산 후 포맷 문자열 반환"""
    if area_sqm <= 0 or price_man <= 0:
        return "-"
    pyeong = sqm_to_pyeong(area_sqm)
    if pyeong <= 0:
        return "-"
    per_pyeong = int(price_man / pyeong)
    return format_price_str(per_pyeong)
