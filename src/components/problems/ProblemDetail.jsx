import React, { useState } from 'react'
import { CategoryBadge, StatusBadge, SkillTag } from '../ui/Badge'
import { templateConfig } from '../../lib/templateConfig'
import { mockProposals } from '../../data/mockData'

const formatBudget = (n) => n >= 10000 ? `${Math.floor(n / 10000)}만원` : `${n.toLocaleString()}원`

const ProblemDetail = ({ problem, onBack, onPropose, onMessage }) => {
  const [activeTab, setActiveTab] = useState('detail')
  const tmpl = templateConfig[problem.category]
  const proposals = mockProposals.filter(p => p.problem_id === problem.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        ← 목록으로
      </button>

      {/* Header Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={problem.category} />
            <StatusBadge status={problem.status} />
          </div>
          <div className="flex gap-2">
            <button onClick={onMessage} className="btn-secondary text-sm">
              💬 메시지
            </button>
            {problem.status === 'open' && (
              <button onClick={() => onPropose(problem)} className="btn-primary text-sm">
                제안서 보내기
              </button>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {tmpl?.icon} {problem.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">{problem.description}</p>

        {/* Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-gray-100 dark:border-slate-700">
          <div>
            <p className="text-xs text-gray-400 mb-1">예산 범위</p>
            <p className="font-semibold text-blue-600">
              {formatBudget(problem.budget_min)} ~ {formatBudget(problem.budget_max)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">마감일</p>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {new Date(problem.deadline).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">제안서</p>
            <p className="font-medium text-gray-700 dark:text-gray-300">{problem.proposal_count}개</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">등록일</p>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {new Date(problem.created_at).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>

        {/* Tags */}
        {problem.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {problem.tags.map(tag => <SkillTag key={tag} skill={tag} />)}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-700 mb-6">
        {[
          { id: 'detail', label: '상세 정보' },
          { id: 'proposals', label: `제안서 (${proposals.length})` },
          { id: 'client', label: '의뢰인 정보' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'detail' && (
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            {tmpl?.icon} {tmpl?.label} 상세 정보
          </h3>
          {tmpl?.fields.map(field => {
            const value = problem.template_data?.[field.key]
            if (!value) return null
            return (
              <div key={field.key}>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </p>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {value}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {proposals.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              <p className="text-3xl mb-3">📝</p>
              <p>아직 제안서가 없습니다</p>
              {problem.status === 'open' && (
                <button onClick={() => onPropose(problem)} className="btn-primary mt-4">
                  첫 번째 제안하기
                </button>
              )}
            </div>
          ) : (
            proposals.map(proposal => (
              <div key={proposal.id} className="card p-5">
                <div className="flex items-start gap-4">
                  <img
                    src={proposal.developer?.avatar_url}
                    alt={proposal.developer?.username}
                    className="w-10 h-10 rounded-full shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {proposal.developer?.username}
                        </span>
                        <span className="ml-2 text-xs text-amber-500">
                          ⭐ {proposal.developer?.rating}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">{formatBudget(proposal.budget)}</p>
                        <p className="text-xs text-gray-400">{proposal.duration_days}일 소요</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-1 mb-2">
                      {proposal.developer?.skills?.slice(0, 3).map(s => (
                        <SkillTag key={s} skill={s} />
                      ))}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {proposal.cover_letter}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => onMessage()}
                        className="btn-secondary text-xs py-1 px-3"
                      >
                        메시지 보내기
                      </button>
                      <button className="btn-primary text-xs py-1 px-3">
                        제안 수락
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'client' && problem.client && (
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-5">
            <img
              src={problem.client.avatar_url}
              alt={problem.client.username}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{problem.client.username}</h3>
              <p className="text-sm text-gray-500">{problem.client.bio}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-amber-500 text-sm">⭐ {problem.client.rating}</span>
                <span className="text-gray-400 text-xs">리뷰 {problem.client.review_count}개</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100 dark:border-slate-700">
            <div>
              <p className="text-xs text-gray-400 mb-1">역할</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">의뢰인</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">가입일</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {new Date(problem.client.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
          <button
            onClick={onMessage}
            className="btn-primary w-full mt-4"
          >
            💬 메시지 보내기
          </button>
        </div>
      )}
    </div>
  )
}

export default ProblemDetail
