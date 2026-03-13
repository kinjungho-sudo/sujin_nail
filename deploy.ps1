# 민지케이크 Cloudflare 배포 스크립트
Write-Host "🍰 민지케이크 배포를 시작합니다! (영자 드림)" -ForegroundColor Magenta

# Cloudflare 로그인 여부 확인 및 배포
npx wrangler pages deploy dist --project-name minji-cake

Write-Host "✨ 배포가 완료되었습니다! 위의 링크를 클릭해서 홈페이지를 확인해 보세요!" -ForegroundColor Cyan
