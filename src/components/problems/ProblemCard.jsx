import React from 'react'
import { CategoryBadge, StatusBadge, SkillTag } from '../ui/Badge'
import { templateConfig } from '../../lib/templateConfig'

const formatBudget = (min, max) => {
  const fmt = (n) => n >= 10000 ? `${Math.floor(n / 10000)}만원` : `${n.toLocaleString()}원`
  return `${fmt(min)} ~ ${fmt(max)}`
}

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return '오늘'
  if (days === 1) return '어제'
  if (days < 7) return `${days}일 전`
  return `${Math.floor(days / 7)}주 전`
}

const ProblemCard = ({ problem, onClick }) => {
  const tmpl = templateConfig[problem.category]

  return (
    <div
      className="card p-5 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all"
      onClick={() => onClick(problem)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={problem.category} />
          <StatusBadge status={problem.status} />
        </div>
        <span className="text-xs text-gray-400 shrink-0">{timeAgo(problem.created_at)}</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug">
        {tmpl?.icon} {problem.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
        {problem.description}
      </p>

      {/* Tags */}
      {problem.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {problem.tags.slice(0, 4).map(tag => (
            <SkillTag key={tag} skill={tag} />
          ))}
          {problem.tags.length > 4 && (
            <span className="text-xs text-gray-400">+{problem.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">예산</p>
          <p className="text-sm font-semibold text-blue-600">{formatBudget(problem.budget_min, problem.budget_max)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-0.5">제안서</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{problem.proposal_count}개</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-0.5">마감일</p>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {new Date(problem.deadline).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Client info */}
      {problem.client && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
          <img
            src={problem.client.avatar_url}
            alt={problem.client.username}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-xs text-gray-500">{problem.client.username}</span>
          <span className="ml-auto text-xs text-amber-500">⭐ {problem.client.rating}</span>
        </div>
      )}
    </div>
  )
}

export default ProblemCard
