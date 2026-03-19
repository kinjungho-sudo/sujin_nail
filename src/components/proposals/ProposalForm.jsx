import React, { useState } from 'react'
import { templateConfig } from '../../lib/templateConfig'

const formatBudget = (n) => n >= 10000 ? `${Math.floor(n / 10000)}만원` : `${n.toLocaleString()}원`

const ProposalForm = ({ problem, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    budget: problem?.budget_min || 0,
    duration_days: 7,
    cover_letter: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const tmpl = templateConfig[problem?.category]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      onSubmit(formData)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">제안서 전송 완료!</h2>
        <p className="text-gray-500 mb-8">의뢰인이 검토 후 연락드릴 예정입니다</p>
        <button onClick={onBack} className="btn-primary">목록으로 돌아가기</button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
        ← 돌아가기
      </button>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">제안서 작성</h2>

      {/* Problem Summary */}
      {problem && (
        <div className={`border-l-4 ${tmpl?.borderColor || 'border-blue-200'} pl-4 mb-6 py-2`}>
          <p className="text-xs text-gray-400 mb-1">제안 대상 문제</p>
          <p className="font-medium text-gray-800 dark:text-white">{tmpl?.icon} {problem.title}</p>
          <p className="text-sm text-gray-500 mt-1">
            예산 {formatBudget(problem.budget_min)} ~ {formatBudget(problem.budget_max)} · 마감 {new Date(problem.deadline).toLocaleDateString('ko-KR')}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-5 space-y-4">
          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              제안 금액 <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                className="input pr-8"
                value={formData.budget}
                onChange={e => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                min={problem?.budget_min}
                max={problem?.budget_max}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">원</span>
            </div>
            {problem && (
              <p className="text-xs text-gray-400 mt-1">
                의뢰인 예산 범위: {formatBudget(problem.budget_min)} ~ {formatBudget(problem.budget_max)}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              예상 소요 기간 <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {[1, 3, 5, 7, 14, 30].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, duration_days: days }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    formData.duration_days === days
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600 hover:border-blue-300'
                  }`}
                >
                  {days}일
                </button>
              ))}
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              제안 내용 <span className="text-red-400">*</span>
            </label>
            <textarea
              className="input resize-none"
              rows={6}
              placeholder={`이 문제를 어떻게 해결할지 설명해주세요.\n\n예시:\n- 문제 분석 방법\n- 해결 접근법\n- 관련 경험 및 포트폴리오\n- 예상 산출물`}
              value={formData.cover_letter}
              onChange={e => setFormData(prev => ({ ...prev, cover_letter: e.target.value }))}
              required
              minLength={50}
            />
            <p className="text-xs text-gray-400 mt-1">{formData.cover_letter.length}/50자 이상 작성 권장</p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">💡 좋은 제안서 작성 팁</p>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
            <li>• 비슷한 문제를 해결한 경험을 구체적으로 언급하세요</li>
            <li>• 예상 해결 방법을 단계별로 설명하면 신뢰도가 높아집니다</li>
            <li>• 포트폴리오나 GitHub 링크를 포함하면 채택 확률이 높아집니다</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onBack} className="btn-secondary flex-1">취소</button>
          <button type="submit" className="btn-primary flex-[2]">제안서 보내기</button>
        </div>
      </form>
    </div>
  )
}

export default ProposalForm
