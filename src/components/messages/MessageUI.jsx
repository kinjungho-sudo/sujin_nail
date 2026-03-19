import React, { useState, useRef, useEffect } from 'react'
import { mockMessages, mockProfiles } from '../../data/mockData'

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

const MessageUI = ({ currentUser, onBack }) => {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  const currentUserId = currentUser?.id || 'user-2'
  const otherUser = mockProfiles.find(p => p.id !== currentUserId) || mockProfiles[0]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      conversation_id: 'conv-1',
      sender_id: currentUserId,
      sender: currentUser || mockProfiles[1],
      content: newMessage.trim(),
      is_read: false,
      created_at: new Date().toISOString(),
    }])
    setNewMessage('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
        ← 돌아가기
      </button>

      <div className="card overflow-hidden" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-slate-700">
          <img src={otherUser.avatar_url} alt={otherUser.username} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{otherUser.username}</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
              온라인
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 text-sm">
              📞
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 text-sm">
              ⋮
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50 dark:bg-slate-800/50">
          {/* Date separator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
            <span className="text-xs text-gray-400 px-2">오늘</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
          </div>

          {messages.map(msg => {
            const isMine = msg.sender_id === currentUserId
            return (
              <div key={msg.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMine && (
                  <img
                    src={msg.sender?.avatar_url}
                    alt={msg.sender?.username}
                    className="w-8 h-8 rounded-full shrink-0 mt-1"
                  />
                )}
                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 px-1">
                    {formatTime(msg.created_at)}
                    {isMine && (
                      <span className="ml-1">{msg.is_read ? ' ✓✓' : ' ✓'}</span>
                    )}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <form onSubmit={sendMessage} className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                className="input resize-none pr-10 py-3"
                rows={1}
                placeholder="메시지를 입력하세요..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(e)
                  }
                }}
                style={{ maxHeight: '120px' }}
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600"
              >
                📎
              </button>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="btn-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↑
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MessageUI
