import React, { useState } from 'react'

const Navbar = ({ currentPage, setCurrentPage, currentUser, darkMode, setDarkMode }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navLinks = [
    { id: 'home', label: '홈' },
    { id: 'problems', label: '문제 찾기' },
    { id: 'budget', label: '예산 가이드' },
  ]

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 font-bold text-xl text-blue-600"
          >
            <span className="text-2xl">🔧</span>
            <span>FIXHUB</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === link.id
                    ? 'text-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? '라이트 모드' : '다크 모드'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Post Problem */}
            <button
              onClick={() => setCurrentPage('post')}
              className="hidden sm:inline-flex btn-primary text-sm"
            >
              + 문제 등록
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`}
                  alt="프로필"
                  className="w-8 h-8 rounded-full bg-gray-200"
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50">
                  <button
                    onClick={() => { setCurrentPage('profile'); setUserMenuOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    내 프로필
                  </button>
                  <button
                    onClick={() => { setCurrentPage('messages'); setUserMenuOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    메시지
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-slate-700" />
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-slate-700 py-3 space-y-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { setCurrentPage(link.id); setMobileOpen(false) }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === link.id
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setCurrentPage('post'); setMobileOpen(false) }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-blue-600"
            >
              + 문제 등록
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
