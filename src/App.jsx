import React, { useState, useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import HomePage from './components/layout/HomePage'
import ProblemList from './components/problems/ProblemList'
import ProblemDetail from './components/problems/ProblemDetail'
import PostProblem from './components/problems/PostProblem'
import ProposalForm from './components/proposals/ProposalForm'
import MessageUI from './components/messages/MessageUI'
import BudgetStats from './components/problems/BudgetStats'
import ProfilePage from './components/profile/ProfilePage'
import { mockProblems, mockProfiles } from './data/mockData'

const currentUser = mockProfiles[1] // 이클라이언트 (데모용)

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [problems, setProblems] = useState(mockProblems)

  // 다크 모드 클래스 적용
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleNavigate = (page, data = null) => {
    if (page === 'detail' && data) {
      setSelectedProblem(data)
      setCurrentPage('detail')
    } else {
      setCurrentPage(page)
      if (page !== 'detail') setSelectedProblem(null)
    }
    window.scrollTo(0, 0)
  }

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem)
    setCurrentPage('detail')
    window.scrollTo(0, 0)
  }

  const handlePostProblem = (newProblem) => {
    const problemWithClient = {
      ...newProblem,
      client_id: currentUser.id,
      client: currentUser,
    }
    setProblems(prev => [problemWithClient, ...prev])
    setCurrentPage('problems')
    window.scrollTo(0, 0)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />

      case 'problems':
        return (
          <ProblemList
            problems={problems}
            onSelectProblem={handleSelectProblem}
            onPost={() => setCurrentPage('post')}
          />
        )

      case 'detail':
        return selectedProblem ? (
          <ProblemDetail
            problem={selectedProblem}
            onBack={() => setCurrentPage('problems')}
            onPropose={(problem) => {
              setSelectedProblem(problem)
              setCurrentPage('propose')
            }}
            onMessage={() => setCurrentPage('messages')}
          />
        ) : null

      case 'post':
        return (
          <PostProblem
            onBack={() => setCurrentPage('problems')}
            onSubmit={handlePostProblem}
          />
        )

      case 'propose':
        return (
          <ProposalForm
            problem={selectedProblem}
            onBack={() => {
              setCurrentPage(selectedProblem ? 'detail' : 'problems')
            }}
            onSubmit={() => {
              setCurrentPage('problems')
            }}
          />
        )

      case 'messages':
        return (
          <MessageUI
            currentUser={currentUser}
            onBack={() => setCurrentPage(selectedProblem ? 'detail' : 'home')}
          />
        )

      case 'budget':
        return <BudgetStats />

      case 'profile':
        return (
          <ProfilePage
            userId={currentUser.id}
            onSelectProblem={handleSelectProblem}
            onBack={() => setCurrentPage('home')}
          />
        )

      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <main>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-700 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-xl text-blue-600 mb-3">
            <span>🔧</span>
            <span>FIXHUB</span>
          </div>
          <p className="text-sm text-gray-400">소프트웨어 문제 해결 마켓플레이스</p>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-400">
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>고객센터</span>
          </div>
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-4">© 2024 FIXHUB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
