import React from 'react'
import { mockBudgetStats } from '../../data/mockData'
import { templateConfig } from '../../lib/templateConfig'

const formatBudget = (n) => n >= 10000 ? `${Math.floor(n / 10000)}만원` : `${n.toLocaleString()}원`

const BudgetBar = ({ value, max, color }) => (
  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full ${color}`}
      style={{ width: `${Math.min((value / max) * 100, 100)}%`, transition: 'width 0.5s ease' }}
    />
  </div>
)

const barColors = {
  bug: 'bg-red-400',
  feature: 'bg-violet-400',
  performance: 'bg-amber-400',
  security: 'bg-red-600',
  design: 'bg-pink-400',
  data: 'bg-cyan-400',
}

const BudgetStats = () => {
  const maxAvg = Math.max(...mockBudgetStats.map(s => s.avg_budget))

  const totalCompleted = mockBudgetStats.reduce((a, b) => a + b.completed_count, 0)
  const totalProblems = mockBudgetStats.reduce((a, b) => a + b.total_problems, 0)
  const overallAvg = Math.floor(mockBudgetStats.reduce((a, b) => a + b.avg_budget, 0) / mockBudgetStats.length)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">예산 가이드</h1>
        <p className="text-gray-500 text-sm">카테고리별 평균 예산과 완료 통계를 확인하세요</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-blue-600 mb-1">{totalProblems}</p>
          <p className="text-sm text-gray-500">전체 문제 수</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-green-600 mb-1">{totalCompleted}</p>
          <p className="text-sm text-gray-500">완료된 문제</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-purple-600 mb-1">{formatBudget(overallAvg)}</p>
          <p className="text-sm text-gray-500">전체 평균 예산</p>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {mockBudgetStats.map(stat => {
          const tmpl = templateConfig[stat.category]
          const completionRate = Math.floor((stat.completed_count / stat.total_problems) * 100)

          return (
            <div key={stat.category} className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${tmpl?.color}`}>
                  {tmpl?.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tmpl?.label}</h3>
                  <p className="text-xs text-gray-400">{stat.total_problems}개 · 완료율 {completionRate}%</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{formatBudget(stat.avg_budget)}</p>
                  <p className="text-xs text-gray-400">평균 예산</p>
                </div>
              </div>

              {/* Budget Range Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>{formatBudget(stat.min_budget)}</span>
                  <span className="text-gray-600 dark:text-gray-300 font-medium">평균 {formatBudget(stat.avg_budget)}</span>
                  <span>{formatBudget(stat.max_budget)}</span>
                </div>
                <BudgetBar value={stat.avg_budget} max={maxAvg} color={barColors[stat.category]} />
              </div>

              {/* Completion */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">완료율</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <span className="font-medium text-green-600">{completionRate}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Budget Guide Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">카테고리별 예산 범위 상세</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">카테고리</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">최소</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">평균</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">최대</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">완료 수</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {mockBudgetStats.map(stat => {
                const tmpl = templateConfig[stat.category]
                return (
                  <tr key={stat.category} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2">
                        <span>{tmpl?.icon}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{tmpl?.label}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{formatBudget(stat.min_budget)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-blue-600">{formatBudget(stat.avg_budget)}</td>
                    <td className="px-5 py-3 text-right text-gray-600 dark:text-gray-400">{formatBudget(stat.max_budget)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-green-600 font-medium">{stat.completed_count}</span>
                      <span className="text-gray-400">/{stat.total_problems}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BudgetStats
