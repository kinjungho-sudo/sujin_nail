"""위도/경도 → Geohash 변환 유틸"""

_BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz"


def encode(lat: float, lng: float, precision: int = 7) -> str:
    """
    위도·경도를 Geohash 문자열로 인코딩.

    Args:
        lat:       위도 (-90 ~ 90)
        lng:       경도 (-180 ~ 180)
        precision: 해시 길이 (기본값 7 → 약 150m 정밀도)

    Returns:
        geohash 문자열
    """
    lat_range = [-90.0, 90.0]
    lng_range = [-180.0, 180.0]

    bits = [16, 8, 4, 2, 1]
    bit_idx = 0
    char_idx = 0
    even = True
    geohash = []

    while len(geohash) < precision:
        if even:
            mid = (lng_range[0] + lng_range[1]) / 2
            if lng > mid:
                char_idx |= bits[bit_idx]
                lng_range[0] = mid
            else:
                lng_range[1] = mid
        else:
            mid = (lat_range[0] + lat_range[1]) / 2
            if lat > mid:
                char_idx |= bits[bit_idx]
                lat_range[0] = mid
            else:
                lat_range[1] = mid

        even = not even
        if bit_idx < 4:
            bit_idx += 1
        else:
            geohash.append(_BASE32[char_idx])
            bit_idx = 0
            char_idx = 0

    return "".join(geohash)


def decode(geohash: str) -> tuple:
    """
    Geohash 문자열을 (위도, 경도) 튜플로 디코딩.

    Returns:
        (lat, lng) 중심 좌표
    """
    lat_range = [-90.0, 90.0]
    lng_range = [-180.0, 180.0]
    even = True

    for char in geohash:
        char_val = _BASE32.index(char)
        for bits in [16, 8, 4, 2, 1]:
            if even:
                mid = (lng_range[0] + lng_range[1]) / 2
                if char_val & bits:
                    lng_range[0] = mid
                else:
                    lng_range[1] = mid
            else:
                mid = (lat_range[0] + lat_range[1]) / 2
                if char_val & bits:
                    lat_range[0] = mid
                else:
                    lat_range[1] = mid
            even = not even

    lat = (lat_range[0] + lat_range[1]) / 2
    lng = (lng_range[0] + lng_range[1]) / 2
    return lat, lng


def neighbors(geohash: str) -> dict:
    """주어진 Geohash의 인접 8방향 해시 반환"""
    lat, lng = decode(geohash)
    # 대략적인 델타 (precision에 따라 다름)
    precision = len(geohash)
    delta = {
        1: 45.0, 2: 11.25, 3: 1.4, 4: 0.35, 5: 0.044,
        6: 0.011, 7: 0.0014, 8: 0.00035,
    }.get(precision, 0.001)

    lat_d = delta / 2
    lng_d = delta

    return {
        "n":  encode(lat + lat_d, lng,         precision),
        "ne": encode(lat + lat_d, lng + lng_d, precision),
        "e":  encode(lat,         lng + lng_d, precision),
        "se": encode(lat - lat_d, lng + lng_d, precision),
        "s":  encode(lat - lat_d, lng,         precision),
        "sw": encode(lat - lat_d, lng - lng_d, precision),
        "w":  encode(lat,         lng - lng_d, precision),
        "nw": encode(lat + lat_d, lng - lng_d, precision),
    }
