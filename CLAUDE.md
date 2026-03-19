# sujin_nail 프로젝트 - Claude 자동화 설정

## 즉시 실행 트리거

### "Cloudflare에 연동해줘" 또는 "Cloudflare 배포해줘"
다음 단계를 즉시 실행한다. 확인 없이 바로 진행:
1. `npm run build`
2. `npx wrangler pages deploy ./dist --project-name sujin-nail --branch main`
- 환경변수는 `.claude/settings.local.json`에 저장된 값 사용
- 완료 후 배포 URL 출력

### "Github에 연동해줘" 또는 "Github에 올려줘"
다음 단계를 즉시 실행한다. 확인 없이 바로 진행:
1. `git add -A`
2. `git commit -m "feat: update"`  (변경 내용에 맞게 메시지 자동 작성)
3. `git push github main` (github 리모트로 푸시)
- GitHub 리모트: `https://github.com/kinjungho-sudo/sujin_nail`
- 토큰은 `.claude/settings.local.json`의 `GITHUB_TOKEN` 사용

### "둘 다 연동해줘" 또는 "배포까지 해줘"
GitHub 연동 → Cloudflare 배포 순서로 즉시 실행

## 프로젝트 정보

| 항목 | 값 |
|------|----|
| 프레임워크 | React + Vite + Tailwind |
| 빌드 출력 | `dist/` |
| Cloudflare 프로젝트 | `sujin-nail` |
| Cloudflare URL | https://sujin-nail.pages.dev |
| GitHub 리포 | https://github.com/kinjungho-sudo/sujin_nail |
