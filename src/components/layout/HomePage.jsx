import React from 'react'
import { templateConfig } from '../../lib/templateConfig'
import { mockProblems, mockBudgetStats } from '../../data/mockData'

const formatBudget = (n) => n >= 10000 ? `${Math.floor(n / 10000)}만원` : `${n.toLocaleString()}원`

const HomePage = ({ onNavigate }) => {
  const recentProblems = mockProblems.slice(0, 3)
  const openCount = mockProblems.filter(p => p.status === 'open').length

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {openCount}개 문제가 해결을 기다리고 있습니다
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            소프트웨어 문제를<br/>
            <span className="text-blue-200">전문가와 함께</span> 해결하세요
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            버그, 성능, 보안, 기능 개발까지 — 검증된 개발자에게 맡기고
            명확한 예산과 일정으로 진행하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('post')}
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              🚀 문제 등록하기
            </button>
            <button
              onClick={() => onNavigate('problems')}
              className="bg-white/20 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
            >
              🔍 문제 찾아보기
            </button>
          </div>
        </div>
      </section>

      {/* Category Quick Pick */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 text-center">카테고리별 빠른 검색</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.values(templateConfig).map(tmpl => {
              const stat = mockBudgetStats.find(s => s.category === tmpl.id)
              return (
                <button
                  key={tmpl.id}
                  onClick={() => onNavigate('problems')}
                  className={`card p-4 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-all border-2 ${tmpl.borderColor}`}
                >
                  <div className="text-2xl mb-2">{tmpl.icon}</div>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{tmpl.label}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    평균 {stat ? formatBudget(stat.avg_budget) : '-'}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Problems */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">최근 등록된 문제</h2>
            <button
              onClick={() => onNavigate('problems')}
              className="text-sm text-blue-600 hover:underline"
            >
              전체 보기 →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProblems.map(problem => {
              const tmpl = templateConfig[problem.category]
              return (
                <div
                  key={problem.id}
                  onClick={() => onNavigate('detail', problem)}
                  className="card p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tmpl?.color}`}>
                      {tmpl?.icon} {tmpl?.label}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">{problem.title}</p>
                  <p className="text-xs text-blue-600 font-semibold">
                    {formatBudget(problem.budget_min)} ~ {formatBudget(problem.budget_max)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-8 text-center">어떻게 작동하나요?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', icon: '📝', title: '문제 등록', desc: '6가지 템플릿으로 문제를 구체적으로 작성하세요. 더 명확할수록 더 좋은 제안을 받습니다.' },
              { step: '02', icon: '💬', title: '제안서 검토', desc: '검증된 개발자들이 제안서를 보냅니다. 포트폴리오와 경험을 비교하고 선택하세요.' },
              { step: '03', icon: '✅', title: '문제 해결', desc: '선택된 개발자와 함께 작업하고, 완료 후 안전하게 대금을 지불하세요.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-2xl mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-blue-600 mb-1">STEP {item.step}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">지금 바로 시작하세요</h2>
          <p className="text-gray-500 mb-6">무료로 문제를 등록하고 전문가의 제안을 받아보세요</p>
          <button
            onClick={() => onNavigate('post')}
            className="btn-primary px-8 py-3 text-base"
          >
            + 첫 문제 등록하기
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage
