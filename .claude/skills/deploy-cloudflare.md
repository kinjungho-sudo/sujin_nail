# deploy-cloudflare

Cloudflare Pages 배포 스킬 - GitHub 레포지토리와 Cloudflare Pages 연동 및 배포 경험을 기반으로 만든 자동화 스킬

## 사용 시나리오
- Vite/React 프로젝트를 Cloudflare Pages에 배포할 때
- API 토큰 권한 문제 해결이 필요할 때
- 새 Cloudflare Pages 프로젝트 생성 후 첫 배포 시

---

## 사전 준비: Cloudflare API 토큰 생성

### 필수 권한 (없으면 인증 오류 발생)

1. https://dash.cloudflare.com/profile/api-tokens 접속
2. **"Create Token"** → **"Custom token"** → **"Get started"**
3. Permissions 설정:

   | 범위 | 리소스 | 권한 |
   |------|--------|------|
   | `Account` | `Cloudflare Pages` | `Edit` |

4. Account Resources: `Include` → `All accounts`
5. **"Continue to summary"** → **"Create Token"** → 토큰 복사

### 토큰 검증 방법

```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/pages/projects" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
# "success": true 가 나와야 정상
```

> **주의**: 토큰이 active 상태여도 Pages 권한이 없으면 `Authentication error` 발생
> 이 경우 기존 토큰 Edit → "Add more" → `Account > Cloudflare Pages > Edit` 추가

---

## 배포 절차

### 1. 빌드

```bash
npm run build
# dist/ 폴더 생성 확인
```

### 2. Cloudflare Pages 프로젝트 확인/생성

```bash
# 기존 프로젝트 확인
CLOUDFLARE_API_TOKEN=<TOKEN> npx wrangler pages project list

# 없으면 새로 생성
CLOUDFLARE_API_TOKEN=<TOKEN> CLOUDFLARE_ACCOUNT_ID=<ACCOUNT_ID> \
  npx wrangler pages project create <project-name> --production-branch main
```

### 3. 배포

```bash
CLOUDFLARE_API_TOKEN=<TOKEN> CLOUDFLARE_ACCOUNT_ID=<ACCOUNT_ID> \
  npx wrangler pages deploy ./dist \
  --project-name <project-name> \
  --branch main
```

배포 완료 시 URL 출력:
```
✨ Deployment complete! Take a peek over at https://xxxx.project-name.pages.dev
```

---

## 이 프로젝트 배포 정보

| 항목 | 값 |
|------|----|
| 프로젝트명 | `sujin-nail` |
| Account ID | `226bae5d66d143e3efc645f95f302c73` |
| 프로덕션 URL | https://sujin-nail.pages.dev |
| 빌드 명령 | `npm run build` |
| 빌드 출력 | `dist/` |
| 배포 브랜치 | `main` |

### 재배포 명령 (토큰만 교체)

```bash
cd /home/user/sujin_nail
npm run build
CLOUDFLARE_API_TOKEN=<TOKEN> CLOUDFLARE_ACCOUNT_ID=226bae5d66d143e3efc645f95f302c73 \
  npx wrangler pages deploy ./dist --project-name sujin-nail --branch main
```

---

## 트러블슈팅

| 오류 | 원인 | 해결 |
|------|------|------|
| `Authentication error [code: 10000]` | 토큰에 Pages 권한 없음 | 토큰에 `Account > Cloudflare Pages > Edit` 추가 |
| `Unable to retrieve email` | 토큰에 User Details 권한 없음 | 배포에는 영향 없음 (무시 가능) |
| 프로젝트 이름 충돌 | 이미 동일 이름 존재 | 다른 이름 사용 또는 기존 프로젝트 활용 |
