/**
 * FIXHUB 타입 정의
 * TypeScript가 없으므로 JSDoc으로 타입 문서화
 */

/**
 * @typedef {'bug' | 'feature' | 'performance' | 'security' | 'design' | 'data'} Category
 * @typedef {'open' | 'in_progress' | 'completed' | 'cancelled'} ProblemStatus
 * @typedef {'pending' | 'accepted' | 'rejected'} ProposalStatus
 */

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} [avatar_url]
 * @property {string} [bio]
 * @property {'client' | 'developer' | 'both'} role
 * @property {number} rating
 * @property {number} review_count
 * @property {string[]} skills
 * @property {string} created_at
 */

/**
 * @typedef {Object} Problem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {Category} category
 * @property {ProblemStatus} status
 * @property {number} budget_min
 * @property {number} budget_max
 * @property {string} deadline
 * @property {string} client_id
 * @property {Profile} [client]
 * @property {string} template_type
 * @property {Object} template_data
 * @property {string[]} tags
 * @property {number} proposal_count
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Proposal
 * @property {string} id
 * @property {string} problem_id
 * @property {string} developer_id
 * @property {Profile} [developer]
 * @property {string} cover_letter
 * @property {number} budget
 * @property {number} duration_days
 * @property {ProposalStatus} status
 * @property {string} created_at
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} conversation_id
 * @property {string} sender_id
 * @property {Profile} [sender]
 * @property {string} content
 * @property {boolean} is_read
 * @property {string} created_at
 */

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} problem_id
 * @property {string} reviewer_id
 * @property {string} reviewee_id
 * @property {Profile} [reviewer]
 * @property {number} rating
 * @property {string} comment
 * @property {string} created_at
 */

/**
 * @typedef {Object} BudgetStat
 * @property {Category} category
 * @property {number} avg_budget
 * @property {number} min_budget
 * @property {number} max_budget
 * @property {number} total_problems
 * @property {number} completed_count
 */
