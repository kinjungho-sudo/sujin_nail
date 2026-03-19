import React, { useState } from 'react'
import { mockProfiles, mockProblems, mockReviews } from '../../data/mockData'
import { SkillTag, CategoryBadge, StatusBadge } from '../ui/Badge'
import ReviewList from '../reviews/ReviewList'

const ProfilePage = ({ userId, onSelectProblem, onBack }) => {
  const [activeTab, setActiveTab] = useState('problems')
  const profile = mockProfiles.find(p => p.id === userId) || mockProfiles[0]
  const userProblems = mockProblems.filter(p => p.client_id === profile.id)
  const userReviews = mockReviews.filter(r => r.reviewee_id === profile.id)

  const completedCount = userProblems.filter(p => p.status === 'completed').length
  const totalSpent = userProblems.reduce((sum, p) => sum + p.budget_max, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
          ← 돌아가기
        </button>
      )}

      {/* Profile Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-5">
          <img
            src={profile.avatar_url}
            alt={profile.username}
            className="w-20 h-20 rounded-2xl"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{profile.username}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                profile.role === 'developer' ? 'bg-blue-100 text-blue-700' :
                profile.role === 'client' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {profile.role === 'developer' ? '개발자' : profile.role === 'client' ? '의뢰인' : '멀티롤'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3">{profile.bio}</p>
            <div className="flex items-center gap-4">
              <span className="text-amber-500 font-medium">⭐ {profile.rating}</span>
              <span className="text-gray-400 text-sm">리뷰 {profile.review_count}개</span>
              <span className="text-gray-400 text-sm">
                가입 {new Date(profile.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
          <button className="btn-secondary text-sm shrink-0">메시지</button>
        </div>

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <p className="text-xs text-gray-400 mb-2">기술 스택</p>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map(skill => <SkillTag key={skill} skill={skill} />)}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProblems.length}</p>
          <p className="text-xs text-gray-400">등록 문제</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          <p className="text-xs text-gray-400">완료</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {totalSpent >= 10000 ? `${Math.floor(totalSpent / 10000)}만` : totalSpent.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">총 예산 (원)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-700 mb-6">
        {[
          { id: 'problems', label: `문제 (${userProblems.length})` },
          { id: 'reviews', label: `리뷰 (${userReviews.length})` },
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

      {activeTab === 'problems' && (
        <div className="space-y-3">
          {userProblems.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              <p className="text-3xl mb-2">📋</p>
              <p>등록된 문제가 없습니다</p>
            </div>
          ) : (
            userProblems.map(problem => (
              <div
                key={problem.id}
                className="card p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                onClick={() => onSelectProblem?.(problem)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CategoryBadge category={problem.category} />
                  <StatusBadge status={problem.status} />
                </div>
                <p className="font-medium text-gray-900 dark:text-white mb-1">{problem.title}</p>
                <p className="text-xs text-gray-400">
                  {new Date(problem.created_at).toLocaleDateString('ko-KR')} · 제안서 {problem.proposal_count}개
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <ReviewList reviews={userReviews} />
      )}
    </div>
  )
}

export default ProfilePage
