/**
 * PropScope 환경 설정
 *
 * [배포 순서]
 * 1. Render에서 백엔드 배포 후 발급된 URL을 아래에 입력
 * 2. 이 파일을 커밋·푸시하면 Cloudflare Pages에 자동 반영
 *
 * 예: 'https://propscope-api.onrender.com'
 *
 * 로컬 개발 시에는 수정 불필요 (자동으로 localhost:8000 사용)
 */
const PROPSCOPE_CONFIG = {
  RENDER_API_URL: 'https://your-app-name.onrender.com',
};
