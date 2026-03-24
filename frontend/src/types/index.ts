export interface User {
  id: string; email: string; name: string;
  currency: string; timezone: string; monthlyIncome: number;
}
export interface Transaction {
  id: string; userId: string; amount: number; category: string;
  description?: string; date: string; isRecurring: boolean; createdAt: string;
}
export interface Goal {
  id: string; title: string; category: string;
  targetAmount: number; currentAmount: number; targetDate: string;
  progressPercent: number; daysRemaining: number; completedAt?: string;
}
export interface Quest {
  id: string; type: string; description?: string; xpReward: number;
  completed: boolean; completedAt?: string; expiresAt: string;
}
export interface BossBattle {
  id: string; name: string; description?: string; category?: string;
  anomalyAmount: number; healthPercent: number; status: string;
  detectedAt: string; expiresAt: string;
}
export interface Progression {
  level: number; totalXp: number; streak: number; longestStreak: number;
  totalQuestsCompleted: number; bossesDefeated: number;
  title: string; xpInCurrentLevel: number; xpNeededForNext: number | null;
  progressPercent: number;
}
export interface DashboardData {
  totalIncome: number; totalExpenses: number; freeCash: number;
  savings: number; savingsRate: number; topCategory: string; monthlyBudgetUsed: number;
}
export interface CategoryBreakdown {
  category: string; total: number; percentage: number; count: number;
}
export interface CoachingTip {
  id: string; type: string; message: string; priority: number;
}
