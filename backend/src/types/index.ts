// ============================================================
// SHARED TYPESCRIPT INTERFACES & TYPES
// ============================================================

// --- User ---
export interface IUser {
  id: string;
  email: string;
  name: string;
  currency: string;
  timezone: string;
  monthlyIncome: number;
  createdAt: Date;
  updatedAt: Date;
}

// --- Auth ---
export interface IAuthPayload {
  userId: string;
  email: string;
}

export interface IRegisterInput {
  email: string;
  password: string;
  name: string;
  monthlyIncome: number;
  currency?: string;
  timezone?: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: Omit<IUser, 'createdAt' | 'updatedAt'>;
  token: string;
  refreshToken: string;
}

// --- Transaction ---
export type TransactionCategory =
  | 'Food'
  | 'Transport'
  | 'Utilities'
  | 'Entertainment'
  | 'Other';

export interface ITransaction {
  id: string;
  userId: string;
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: Date;
  isRecurring: boolean;
  recurringFrequency?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTransactionInput {
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string;
  isRecurring?: boolean;
  recurringFrequency?: string;
}

export interface ITransactionFilters {
  page?: number;
  limit?: number;
  category?: TransactionCategory;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// --- Goal ---
export interface IGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateGoalInput {
  title: string;
  description?: string;
  category: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate: string;
}

// --- Quest ---
export type QuestType =
  | 'LOG_EXPENSE'
  | 'TRANSFER_SAVINGS'
  | 'REVIEW_CATEGORY'
  | 'STAY_UNDER_BUDGET'
  | 'ADD_GOAL';

export interface IQuest {
  id: string;
  userId: string;
  type: QuestType;
  description?: string;
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
  assignedAt: Date;
  expiresAt: Date;
}

// --- Boss Battle ---
export type BossStatus = 'ACTIVE' | 'WEAKENING' | 'DEFEATED';

export interface IBossBattle {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category?: string;
  anomalyAmount: number;
  healthPercent: number;
  status: BossStatus;
  defeatedAt?: Date;
  detectedAt: Date;
  expiresAt: Date;
}

// --- Progression ---
export interface IProgression {
  id: string;
  userId: string;
  level: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastQuestDate?: Date;
  totalQuestsCompleted: number;
  totalXpEarned: number;
  bossesDefeated: number;
}

// --- Insights ---
export interface IDashboardInsight {
  totalIncome: number;
  totalExpenses: number;
  freeCash: number;
  savings: number;
  savingsRate: number;
  topCategory: string;
  monthlyBudgetUsed: number;
}

export interface ICategoryBreakdown {
  category: string;
  total: number;
  percentage: number;
  count: number;
}

export interface ISpendingTrend {
  week: string;
  total: number;
  change: number;
}

export interface IAnomaly {
  category: string;
  reason: string;
  amount: number;
  severity: 'low' | 'medium' | 'high';
}

export interface ICoachingTip {
  id: string;
  type: 'saving' | 'spending' | 'goal' | 'streak';
  message: string;
  priority: number;
}

// --- Pagination ---
export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// --- API Response ---
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// --- Socket Events ---
export interface ISocketEvents {
  'expense-created': ITransaction;
  'expense-updated': ITransaction;
  'expense-deleted': { id: string };
  'quest-completed': { questId: string; xpEarned: number; newLevel?: number };
  'level-up': { oldLevel: number; newLevel: number; totalXp: number };
  'boss-defeated': { bossId: string; bossName: string; xpEarned: number };
  'boss-detected': IBossBattle;
  'goal-milestone': { goalId: string; title: string; percent: number };
  'streak-updated': { streak: number; longestStreak: number };
  'notification': { type: string; title: string; message: string };
}
