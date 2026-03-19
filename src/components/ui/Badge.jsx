import React from 'react'
import { categoryBadgeClass, statusBadgeClass, categoryLabels, statusLabels } from '../../lib/templateConfig'

export const CategoryBadge = ({ category }) => (
  <span className={categoryBadgeClass[category] || 'badge-bug'}>
    {categoryLabels[category] || category}
  </span>
)

export const StatusBadge = ({ status }) => (
  <span className={statusBadgeClass[status] || 'badge-open'}>
    {statusLabels[status] || status}
  </span>
)

export const SkillTag = ({ skill }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300">
    {skill}
  </span>
)
