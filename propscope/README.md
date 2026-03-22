# PropScope — 부동산 매매 시세 비교 시스템

네이버 부동산 + 직방의 **매매 매물** 데이터를 수집·비교하여 PDF 리포트를 생성하는 개인용 분석 도구입니다.

## 기능

- 카카오맵 기반 지역 선택 + 조건 필터
- 네이버 부동산 / 직방 매매 매물 동시 수집 (빌라, 오피스텔)
- 지도 위 커스텀 마커 (네이버=초록, 직방=주황)
- 사이트별 평균가 갭 분석 + 유형별 통계
- A4 PDF 비교 분석 리포트 다운로드

## 설치 및 실행

```bash
# 1. 의존성 설치
cd propscope
pip install -r requirements.txt
playwright install chromium

# 2. 백엔드 서버 실행
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 3. API 문서 확인
# http://localhost:8000/docs

# 4. 프론트엔드 실행
# frontend/index.html 을 브라우저에서 열기 (또는 VS Code Live Server)
```

## 카카오맵 API 키 설정

`frontend/index.html` 상단의 `YOUR_KAKAO_API_KEY` 를 발급받은 키로 교체하세요.

발급: https://developers.kakao.com

## 디렉터리 구조

```
propscope/
├── backend/
│   ├── main.py              # FastAPI 서버
│   ├── routers/             # API 라우터
│   ├── crawlers/            # 네이버/직방 크롤러
│   ├── models/              # 데이터 모델
│   ├── services/            # 분석/PDF 생성
│   └── utils/               # 유틸 함수
├── frontend/
│   ├── index.html           # 메인 UI
│   └── assets/              # CSS, JS
├── templates/
│   └── report.html          # PDF 리포트 템플릿
└── requirements.txt
```

## API 명세

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/search` | 매물 검색 |
| POST | `/api/report/pdf` | PDF 리포트 생성 |
| GET | `/api/region-code` | 지역코드 조회 |
| GET | `/health` | 서버 상태 확인 |

## 주의사항

- 네이버 부동산은 공식 API 미제공 → 내부 API 역공학 방식 (개인 용도 한정)
- 과도한 수집 요청 자제 (사이트당 500건 이내 권장)
- WeasyPrint 미설치 시 PDF 대신 HTML 파일로 다운로드됩니다

---
*PropScope v1.0 — 개인 매매 분석 도구 | 2026.03*
