/**
 * FIXHUB 템플릿 설정 - 6종
 * 각 카테고리별 문제 등록 템플릿
 */

export const templateConfig = {
  bug: {
    id: 'bug',
    label: '버그 수정',
    icon: '🐛',
    color: 'bg-red-100 text-red-700',
    borderColor: 'border-red-200',
    description: '예상치 못한 오류, 크래시, 잘못된 동작을 수정합니다',
    budgetGuide: { min: 50000, max: 500000, unit: '원' },
    requiredFields: ['error_message', 'steps_to_reproduce', 'expected_behavior', 'actual_behavior', 'environment'],
    optionalFields: ['screenshots', 'logs', 'frequency'],
    fields: [
      { key: 'error_message', label: '오류 메시지', type: 'textarea', placeholder: '발생한 에러 메시지를 붙여넣어 주세요', required: true },
      { key: 'steps_to_reproduce', label: '재현 단계', type: 'textarea', placeholder: '1. 앱 실행\n2. 버튼 클릭\n3. 오류 발생', required: true },
      { key: 'expected_behavior', label: '기대 동작', type: 'textarea', placeholder: '정상적으로 어떻게 동작해야 하는지 설명해주세요', required: true },
      { key: 'actual_behavior', label: '실제 동작', type: 'textarea', placeholder: '실제로 어떻게 동작하는지 설명해주세요', required: true },
      { key: 'environment', label: '환경 정보', type: 'text', placeholder: 'OS, 브라우저, 버전 등 (예: macOS 14, Chrome 120)', required: true },
      { key: 'frequency', label: '발생 빈도', type: 'select', options: ['항상 발생', '가끔 발생', '특정 조건에서만'], required: false },
      { key: 'logs', label: '로그/스택 트레이스', type: 'textarea', placeholder: '관련 로그가 있으면 붙여넣어 주세요', required: false },
    ],
  },

  feature: {
    id: 'feature',
    label: '기능 개발',
    icon: '✨',
    color: 'bg-violet-100 text-violet-700',
    borderColor: 'border-violet-200',
    description: '새로운 기능 추가 또는 기존 기능을 확장합니다',
    budgetGuide: { min: 100000, max: 2000000, unit: '원' },
    requiredFields: ['feature_description', 'user_story', 'acceptance_criteria', 'tech_stack'],
    optionalFields: ['mockups', 'reference', 'priority'],
    fields: [
      { key: 'feature_description', label: '기능 설명', type: 'textarea', placeholder: '구현하고 싶은 기능을 상세히 설명해주세요', required: true },
      { key: 'user_story', label: '사용자 스토리', type: 'textarea', placeholder: '사용자로서, 나는 [목적]을 위해 [행동]을 하고 싶다', required: true },
      { key: 'acceptance_criteria', label: '완료 기준', type: 'textarea', placeholder: '이 기능이 완성되었다고 판단하는 기준을 나열해주세요', required: true },
      { key: 'tech_stack', label: '기술 스택', type: 'text', placeholder: 'React, Node.js, PostgreSQL 등', required: true },
      { key: 'priority', label: '우선순위', type: 'select', options: ['긴급', '높음', '보통', '낮음'], required: false },
      { key: 'reference', label: '참고 자료', type: 'textarea', placeholder: '참고할 서비스, 문서, URL 등', required: false },
    ],
  },

  performance: {
    id: 'performance',
    label: '성능 최적화',
    icon: '⚡',
    color: 'bg-amber-100 text-amber-700',
    borderColor: 'border-amber-200',
    description: '로딩 속도 개선, 메모리 최적화, 쿼리 튜닝 등을 수행합니다',
    budgetGuide: { min: 150000, max: 1500000, unit: '원' },
    requiredFields: ['current_metrics', 'target_metrics', 'bottleneck', 'tech_stack'],
    optionalFields: ['profiling_data', 'constraints'],
    fields: [
      { key: 'current_metrics', label: '현재 성능 지표', type: 'textarea', placeholder: 'LCP 4.5s, TTI 8s, 메모리 사용 500MB 등', required: true },
      { key: 'target_metrics', label: '목표 성능 지표', type: 'textarea', placeholder: 'LCP 2s 이하, 메모리 200MB 이하 등', required: true },
      { key: 'bottleneck', label: '병목 지점', type: 'textarea', placeholder: '어디서 느려지는지 파악하고 있다면 설명해주세요', required: true },
      { key: 'tech_stack', label: '기술 스택', type: 'text', placeholder: '사용 중인 기술 스택', required: true },
      { key: 'profiling_data', label: '프로파일링 데이터', type: 'textarea', placeholder: 'Lighthouse 결과, APM 데이터 등', required: false },
      { key: 'constraints', label: '제약 사항', type: 'textarea', placeholder: '변경 불가한 부분이 있으면 알려주세요', required: false },
    ],
  },

  security: {
    id: 'security',
    label: '보안 강화',
    icon: '🔒',
    color: 'bg-red-100 text-red-900',
    borderColor: 'border-red-300',
    description: '취약점 분석, 보안 감사, 보안 기능 구현을 지원합니다',
    budgetGuide: { min: 200000, max: 3000000, unit: '원' },
    requiredFields: ['vulnerability_type', 'affected_area', 'severity', 'tech_stack'],
    optionalFields: ['audit_report', 'compliance'],
    fields: [
      { key: 'vulnerability_type', label: '취약점 유형', type: 'select', options: ['SQL Injection', 'XSS', 'CSRF', 'Authentication', 'Authorization', '기타'], required: true },
      { key: 'affected_area', label: '영향 범위', type: 'textarea', placeholder: '어떤 기능/데이터가 영향을 받는지 설명해주세요', required: true },
      { key: 'severity', label: '심각도', type: 'select', options: ['Critical', 'High', 'Medium', 'Low'], required: true },
      { key: 'tech_stack', label: '기술 스택', type: 'text', placeholder: '사용 중인 기술 스택', required: true },
      { key: 'compliance', label: '준수 규정', type: 'text', placeholder: 'GDPR, PCI-DSS, OWASP Top 10 등', required: false },
      { key: 'audit_report', label: '감사 보고서', type: 'textarea', placeholder: '기존 보안 감사 결과가 있으면 공유해주세요', required: false },
    ],
  },

  design: {
    id: 'design',
    label: 'UI/UX 개선',
    icon: '🎨',
    color: 'bg-pink-100 text-pink-700',
    borderColor: 'border-pink-200',
    description: '사용자 인터페이스 개선, UX 리디자인, 접근성 향상을 합니다',
    budgetGuide: { min: 100000, max: 1000000, unit: '원' },
    requiredFields: ['design_scope', 'current_issues', 'target_users', 'brand_guidelines'],
    optionalFields: ['figma_link', 'inspiration'],
    fields: [
      { key: 'design_scope', label: '디자인 범위', type: 'textarea', placeholder: '개선이 필요한 화면/컴포넌트를 나열해주세요', required: true },
      { key: 'current_issues', label: '현재 문제점', type: 'textarea', placeholder: '어떤 UX 문제가 있는지 설명해주세요', required: true },
      { key: 'target_users', label: '타겟 사용자', type: 'text', placeholder: '주요 사용자층 (예: 30-40대 직장인)', required: true },
      { key: 'brand_guidelines', label: '브랜드 가이드라인', type: 'textarea', placeholder: '색상, 폰트, 톤앤매너 등 브랜드 가이드', required: true },
      { key: 'figma_link', label: 'Figma 링크', type: 'text', placeholder: '기존 디자인 파일 링크', required: false },
      { key: 'inspiration', label: '참고 디자인', type: 'textarea', placeholder: '참고하고 싶은 서비스나 사이트 URL', required: false },
    ],
  },

  data: {
    id: 'data',
    label: '데이터 처리',
    icon: '📊',
    color: 'bg-cyan-100 text-cyan-700',
    borderColor: 'border-cyan-200',
    description: '데이터 마이그레이션, ETL 파이프라인, 데이터 분석을 수행합니다',
    budgetGuide: { min: 100000, max: 2000000, unit: '원' },
    requiredFields: ['data_description', 'data_size', 'source_format', 'target_format'],
    optionalFields: ['sample_data', 'transformation_rules'],
    fields: [
      { key: 'data_description', label: '데이터 설명', type: 'textarea', placeholder: '처리할 데이터의 종류와 내용을 설명해주세요', required: true },
      { key: 'data_size', label: '데이터 규모', type: 'text', placeholder: '예: 100만 행, 50GB', required: true },
      { key: 'source_format', label: '소스 형식', type: 'text', placeholder: 'CSV, JSON, MySQL, MongoDB 등', required: true },
      { key: 'target_format', label: '목표 형식', type: 'text', placeholder: 'PostgreSQL, Parquet, Elasticsearch 등', required: true },
      { key: 'transformation_rules', label: '변환 규칙', type: 'textarea', placeholder: '데이터 변환 또는 정제 규칙이 있으면 설명해주세요', required: false },
      { key: 'sample_data', label: '샘플 데이터', type: 'textarea', placeholder: '샘플 데이터를 붙여넣거나 설명해주세요', required: false },
    ],
  },
}

export const categoryLabels = {
  bug: '버그 수정',
  feature: '기능 개발',
  performance: '성능 최적화',
  security: '보안 강화',
  design: 'UI/UX 개선',
  data: '데이터 처리',
}

export const statusLabels = {
  open: '모집 중',
  in_progress: '진행 중',
  completed: '완료',
  cancelled: '취소됨',
}

export const statusBadgeClass = {
  open: 'badge-open',
  in_progress: 'badge-in-progress',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
}

export const categoryBadgeClass = {
  bug: 'badge-bug',
  feature: 'badge-feature',
  performance: 'badge-performance',
  security: 'badge-security',
  design: 'badge-design',
  data: 'badge-data',
}
