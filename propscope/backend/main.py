"""PropScope FastAPI 서버 — 진입점"""
from datetime import datetime

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .routers.search import router as search_router
from .routers.report import router as report_router

app = FastAPI(
    title="PropScope API",
    description="네이버 부동산 + 직방 매매 매물 비교 시스템",
    version="1.0.0",
)

# CORS 설정 — 프론트엔드 연동용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(search_router, prefix="/api")
app.include_router(report_router, prefix="/api")


@app.get("/health", tags=["system"])
async def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
    }


# ── 지역코드 조회 ──────────────────────────────────────────
# 법정동 코드 매핑 (자주 사용되는 지역 예시)
REGION_CODE_MAP = {
    "마포구 공덕동": "1144010200",
    "마포구 아현동": "1144010400",
    "마포구 용강동": "1144010500",
    "서대문구 신촌동": "1141010700",
    "강남구 역삼동": "1168010600",
    "강남구 삼성동": "1168010700",
    "서초구 서초동": "1165010100",
    "송파구 잠실동": "1171051500",
    "용산구 이태원동": "1117068000",
    "은평구 불광동": "1138060100",
}


@app.get("/api/region-code", tags=["utility"])
async def get_region_code(region: str = Query(..., description="지역명 (예: 마포구 공덕동)")):
    """법정동 코드 조회"""
    # 입력 문자열 정규화
    normalized = region.strip()
    for key, code in REGION_CODE_MAP.items():
        if key in normalized or normalized in key:
            return {"region": normalized, "code": code}

    return JSONResponse(
        status_code=404,
        content={"detail": f"지역 코드를 찾을 수 없습니다: {region}"},
    )
