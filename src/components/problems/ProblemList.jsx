import React, { useState, useMemo } from 'react'
import ProblemCard from './ProblemCard'
import { templateConfig, statusLabels } from '../../lib/templateConfig'

const categories = ['전체', ...Object.keys(templateConfig)]
const statuses = ['전체', 'open', 'in_progress', 'completed']

const ProblemList = ({ problems, onSelectProblem, onPost }) => {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedStatus, setSelectedStatus] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')

  const filtered = useMemo(() => {
    let list = [...problems]

    if (selectedCategory !== '전체') {
      list = list.filter(p => p.category === selectedCategory)
    }
    if (selectedStatus !== '전체') {
      list = list.filter(p => p.status === selectedStatus)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      )
    }

    if (sortBy === 'latest') {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === 'budget_high') {
      list.sort((a, b) => b.budget_max - a.budget_max)
    } else if (sortBy === 'proposals') {
      list.sort((a, b) => b.proposal_count - a.proposal_count)
    }

    return list
  }, [problems, selectedCategory, selectedStatus, searchQuery, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">문제 찾기</h1>
          <p className="text-sm text-gray-500 mt-1">총 {filtered.length}개의 문제</p>
        </div>
        <button onClick={onPost} className="btn-primary">
          + 문제 등록
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="제목, 설명, 태그로 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => {
            const tmpl = templateConfig[cat]
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
                }`}
              >
                {tmpl ? `${tmpl.icon} ${tmpl.label}` : '전체'}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 dark:bg-slate-700 hidden sm:block" />

        {/* Status Filter */}
        <div className="flex flex-wrap gap-1.5">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedStatus === s
                  ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300'
              }`}
            >
              {s === '전체' ? '전체 상태' : statusLabels[s]}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="ml-auto">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 dark:text-gray-300"
          >
            <option value="latest">최신순</option>
            <option value="budget_high">예산 높은순</option>
            <option value="proposals">제안서 많은순</option>
          </select>
        </div>
      </div>

      {/* Problem Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-medium mb-2">검색 결과가 없습니다</p>
          <p className="text-sm">다른 키워드나 필터를 시도해보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(problem => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onClick={onSelectProblem}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProblemList
