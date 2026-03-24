// ============================================================
// APP-WIDE CONSTANTS
// ============================================================

// XP rewards per action
export const XP_REWARDS = {
  LOG_EXPENSE: 10,
  TRANSFER_SAVINGS: 25,
  REVIEW_CATEGORY: 15,
  STAY_UNDER_BUDGET: 50,
  ADD_GOAL: 20,
  BOSS_DEFEATED: 100,
  STREAK_BONUS: 5, // per streak day
} as const;

// Level thresholds (totalXp needed to reach level N)
export const LEVEL_THRESHOLDS = [
  0,    // Level 1
  100,  // Level 2
  250,  // Level 3
  500,  // Level 4
  900,  // Level 5
  1400, // Level 6
  2000, // Level 7
  2700, // Level 8
  3500, // Level 9
  4500, // Level 10
] as const;

// Level titles
export const LEVEL_TITLES: Record<number, string> = {
  1:  'Budget Apprentice',
  2:  'Penny Watcher',
  3:  'Savings Scout',
  4:  'Finance Explorer',
  5:  'Budget Warrior',
  6:  'Savings Champion',
  7:  'Finance Knight',
  8:  'Wealth Guardian',
  9:  'Finance Master',
  10: 'Legendary Saver',
};

// Boss names by category
export const BOSS_NAMES: Record<string, string> = {
  Food:          'The Snack Phantom',
  Transport:     'The Commute Goblin',
  Utilities:     'The Billing Beast',
  Entertainment: 'The Impulse Overlord',
  Other:         'The Spending Specter',
};

// Quest types and their descriptions
export const QUEST_DESCRIPTIONS: Record<string, string> = {
  LOG_EXPENSE:       'Log at least one expense today',
  TRANSFER_SAVINGS:  'Transfer money to a savings goal',
  REVIEW_CATEGORY:   'Review your spending in one category',
  STAY_UNDER_BUDGET: 'Keep today\'s spending under ₹500',
  ADD_GOAL:          'Create a new savings goal',
};

// Error messages
export const ERRORS = {
  UNAUTHORIZED:        'Unauthorized. Please log in.',
  FORBIDDEN:           'You do not have permission to perform this action.',
  NOT_FOUND:           'Resource not found.',
  VALIDATION:          'Validation failed.',
  INTERNAL:            'Internal server error.',
  DUPLICATE_EMAIL:     'An account with this email already exists.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED:       'Your session has expired. Please log in again.',
  TOKEN_INVALID:       'Invalid authentication token.',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT:     100,
} as const;
