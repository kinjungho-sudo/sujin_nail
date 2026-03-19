import React, { useState } from 'react'
import { mockReviews } from '../../data/mockData'

const StarRating = ({ rating, size = 'sm', interactive = false, onChange }) => {
  const [hovered, setHovered] = useState(0)
  const stars = [1, 2, 3, 4, 5]
  const sizeClass = size === 'lg' ? 'text-2xl' : 'text-sm'

  return (
    <div className={`flex gap-0.5 ${sizeClass}`}>
      {stars.map(star => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
        >
          {star <= (hovered || rating) ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  )
}

const ReviewCard = ({ review }) => (
  <div className="card p-5">
    <div className="flex items-start gap-3 mb-3">
      <img
        src={review.reviewer?.avatar_url}
        alt={review.reviewer?.username}
        className="w-10 h-10 rounded-full shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900 dark:text-white">{review.reviewer?.username}</p>
          <p className="text-xs text-gray-400">
            {new Date(review.created_at).toLocaleDateString('ko-KR')}
          </p>
        </div>
        <StarRating rating={review.rating} />
      </div>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
  </div>
)

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ rating, comment })
  }

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">리뷰 작성</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">별점</label>
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          <p className="text-xs text-gray-400 mt-1">
            {['', '매우 불만족', '불만족', '보통', '만족', '매우 만족'][rating]}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            후기 작성 <span className="text-red-400">*</span>
          </label>
          <textarea
            className="input resize-none"
            rows={4}
            placeholder="작업 경험에 대해 솔직한 후기를 남겨주세요..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
            minLength={10}
          />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">취소</button>
          <button type="submit" className="btn-primary flex-[2]">리뷰 등록</button>
        </div>
      </form>
    </div>
  )
}

const ReviewList = ({ reviews = mockReviews, showForm = false }) => {
  const [writingReview, setWritingReview] = useState(showForm)
  const [allReviews, setAllReviews] = useState(reviews)

  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((a, b) => a + b.rating, 0) / allReviews.length).toFixed(1)
    : 0

  const handleSubmitReview = (reviewData) => {
    setAllReviews(prev => [{
      id: `rev-new-${Date.now()}`,
      ...reviewData,
      reviewer: { username: '나', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' },
      created_at: new Date().toISOString(),
    }, ...prev])
    setWritingReview(false)
  }

  return (
    <div>
      {/* Rating Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{avgRating}</p>
            <StarRating rating={Math.round(Number(avgRating))} />
            <p className="text-xs text-gray-400 mt-1">{allReviews.length}개 리뷰</p>
          </div>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map(star => {
              const count = allReviews.filter(r => r.rating === star).length
              const pct = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-gray-500">{star}</span>
                  <span>⭐</span>
                  <div className="w-24 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-gray-400 w-4">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {!writingReview && (
          <button
            onClick={() => setWritingReview(true)}
            className="btn-secondary text-sm"
          >
            + 리뷰 작성
          </button>
        )}
      </div>

      {writingReview && (
        <div className="mb-6">
          <ReviewForm onSubmit={handleSubmitReview} onCancel={() => setWritingReview(false)} />
        </div>
      )}

      <div className="space-y-4">
        {allReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {allReviews.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-3xl mb-2">💬</p>
            <p>아직 리뷰가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}

export { StarRating, ReviewCard, ReviewForm }
export default ReviewList
