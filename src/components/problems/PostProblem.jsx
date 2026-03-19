import React, { useState } from 'react'
import { templateConfig } from '../../lib/templateConfig'

const PostProblem = ({ onBack, onSubmit }) => {
  const [step, setStep] = useState(1) // 1: 템플릿 선택, 2: 상세 입력
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget_min: '',
    budget_max: '',
    deadline: '',
    tags: '',
    template_data: {},
  })

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId)
    const tmpl = templateConfig[templateId]
    setFormData(prev => ({
      ...prev,
      budget_min: tmpl.budgetGuide.min,
      budget_max: tmpl.budgetGuide.max,
      template_data: {},
    }))
    setStep(2)
  }

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      template_data: { ...prev.template_data, [key]: value },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const tmpl = templateConfig[selectedTemplate]
    onSubmit({
      ...formData,
      category: selectedTemplate,
      template_type: selectedTemplate,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'open',
      proposal_count: 0,
      id: `prob-new-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  const tmpl = selectedTemplate ? templateConfig[selectedTemplate] : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={step === 1 ? onBack : () => setStep(1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        ← {step === 1 ? '돌아가기' : '템플릿 다시 선택'}
      </button>

      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${s <= step ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                s < step ? 'bg-blue-600 text-white' :
                s === step ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' :
                'bg-gray-100 text-gray-400 dark:bg-slate-700'
              }`}>
                {s < step ? '✓' : s}
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {s === 1 ? '카테고리 선택' : '상세 정보 입력'}
              </span>
            </div>
            {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Template Selection */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">문제 유형을 선택하세요</h2>
          <p className="text-sm text-gray-500 mb-6">선택한 유형에 맞는 템플릿으로 더 정확한 제안을 받을 수 있습니다</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(templateConfig).map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleTemplateSelect(tmpl.id)}
                className={`card p-5 text-left hover:border-blue-400 dark:hover:border-blue-600 transition-all border-2 ${tmpl.borderColor}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{tmpl.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{tmpl.label}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tmpl.color}`}>
                      예산: {(tmpl.budgetGuide.min / 10000).toFixed(0)}만 ~ {(tmpl.budgetGuide.max / 10000).toFixed(0)}만원
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tmpl.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  필수 항목 {tmpl.requiredFields.length}개 · 선택 항목 {tmpl.optionalFields.length}개
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Form */}
      {step === 2 && tmpl && (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">{tmpl.icon}</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{tmpl.label} 등록</h2>
          </div>

          <div className="space-y-5">
            {/* Basic Info */}
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">기본 정보</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  제목 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="문제를 한 줄로 요약해주세요"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  전체 설명 <span className="text-red-400">*</span>
                </label>
                <textarea
                  className="input resize-none"
                  rows={4}
                  placeholder="문제 상황과 필요한 작업을 자세히 설명해주세요"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    최소 예산 (원) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="input pr-8"
                      value={formData.budget_min}
                      onChange={e => setFormData(prev => ({ ...prev, budget_min: Number(e.target.value) }))}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">원</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">권장: {(tmpl.budgetGuide.min / 10000).toFixed(0)}만원~</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    최대 예산 (원) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="input pr-8"
                      value={formData.budget_max}
                      onChange={e => setFormData(prev => ({ ...prev, budget_max: Number(e.target.value) }))}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">원</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">~{(tmpl.budgetGuide.max / 10000).toFixed(0)}만원 권장</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  마감일 <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.deadline}
                  onChange={e => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">태그</label>
                <input
                  type="text"
                  className="input"
                  placeholder="React, TypeScript, Node.js (쉼표로 구분)"
                  value={formData.tags}
                  onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>

            {/* Template-specific fields */}
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {tmpl.icon} {tmpl.label} 상세 정보
              </h3>

              {tmpl.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                    {!field.required && <span className="text-gray-400 ml-1 text-xs">(선택)</span>}
                  </label>

                  {field.type === 'textarea' && (
                    <textarea
                      className="input resize-none"
                      rows={3}
                      placeholder={field.placeholder}
                      value={formData.template_data[field.key] || ''}
                      onChange={e => handleFieldChange(field.key, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === 'text' && (
                    <input
                      type="text"
                      className="input"
                      placeholder={field.placeholder}
                      value={formData.template_data[field.key] || ''}
                      onChange={e => handleFieldChange(field.key, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      className="input"
                      value={formData.template_data[field.key] || ''}
                      onChange={e => handleFieldChange(field.key, e.target.value)}
                      required={field.required}
                    >
                      <option value="">선택해주세요</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                이전 단계
              </button>
              <button type="submit" className="btn-primary flex-2 flex-[2]">
                문제 등록하기
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default PostProblem
