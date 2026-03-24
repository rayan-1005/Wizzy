import prisma from '../config/database';
import { IDashboardInsight, ICategoryBreakdown, ISpendingTrend, IAnomaly, ICoachingTip } from '../types';

export const insightService = {
  async getDashboard(userId: string): Promise<IDashboardInsight> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const monthlyIncome = user?.monthlyIncome ?? 0;

    const transactions = await prisma.transaction.findMany({
      where: { userId, date: { gte: startOfMonth } },
    });

    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    const freeCash = Math.max(0, monthlyIncome - totalExpenses);
    const savings = Math.max(0, monthlyIncome - totalExpenses);
    const savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0;

    const byCategory = transactions.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {});
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None';

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const expectedSpend = (totalExpenses / daysPassed) * daysInMonth;
    const monthlyBudgetUsed = monthlyIncome > 0 ? Math.min(100, (expectedSpend / monthlyIncome) * 100) : 0;

    return {
      totalIncome: monthlyIncome,
      totalExpenses,
      freeCash,
      savings,
      savingsRate: Math.round(savingsRate),
      topCategory,
      monthlyBudgetUsed: Math.round(monthlyBudgetUsed),
    };
  },

  async getCategoryBreakdown(userId: string): Promise<ICategoryBreakdown[]> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const transactions = await prisma.transaction.findMany({
      where: { userId, date: { gte: startOfMonth } },
    });

    const total = transactions.reduce((s, t) => s + t.amount, 0);
    const byCategory: Record<string, { total: number; count: number }> = {};

    for (const t of transactions) {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, count: 0 };
      byCategory[t.category].total += t.amount;
      byCategory[t.category].count += 1;
    }

    return Object.entries(byCategory)
      .map(([category, { total: catTotal, count }]) => ({
        category,
        total: catTotal,
        count,
        percentage: total > 0 ? Math.round((catTotal / total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  },

  async getTrends(userId: string): Promise<ISpendingTrend[]> {
    const weeks: ISpendingTrend[] = [];
    const now = new Date();

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7 - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const transactions = await prisma.transaction.findMany({
        where: { userId, date: { gte: weekStart, lte: weekEnd } },
      });
      const total = transactions.reduce((s, t) => s + t.amount, 0);
      const prevTotal = weeks[weeks.length - 1]?.total ?? total;
      const change = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : 0;

      weeks.push({
        week: `W${4 - i}: ${weekStart.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`,
        total,
        change,
      });
    }

    return weeks;
  },

  async getAnomalies(userId: string): Promise<IAnomaly[]> {
    const patterns = await prisma.spendingPattern.findMany({
      where: { userId, isAnomaly: true },
      orderBy: { analyzedAt: 'desc' },
      take: 10,
    });

    return patterns.map((p) => ({
      category: p.category,
      reason: p.anomalyReason ?? 'Unusual spending detected',
      amount: p.totalAmount,
      severity:
        (p.weekOverWeekChange ?? 0) > 100 ? 'high'
        : (p.weekOverWeekChange ?? 0) > 50 ? 'medium'
        : 'low',
    }));
  },

  async getCoachingTips(userId: string): Promise<ICoachingTip[]> {
    const tips: ICoachingTip[] = [];
    const dashboard = await this.getDashboard(userId);
    const progression = await prisma.progression.findUnique({ where: { userId } });

    if (dashboard.savingsRate < 20) {
      tips.push({ id: '1', type: 'saving', message: 'Try to save at least 20% of your income each month.', priority: 1 });
    }
    if (dashboard.monthlyBudgetUsed > 80) {
      tips.push({ id: '2', type: 'spending', message: `You've used ${dashboard.monthlyBudgetUsed}% of your budget — slow down spending!`, priority: 2 });
    }
    if ((progression?.streak ?? 0) === 0) {
      tips.push({ id: '3', type: 'streak', message: 'Complete a quest today to start your streak and earn bonus XP!', priority: 3 });
    }
    if (dashboard.topCategory === 'Entertainment') {
      tips.push({ id: '4', type: 'spending', message: 'Entertainment is your top category. Consider setting a weekly limit.', priority: 4 });
    }

    const goals = await prisma.goal.findMany({ where: { userId, completedAt: null } });
    if (goals.length === 0) {
      tips.push({ id: '5', type: 'goal', message: 'Set a savings goal to stay motivated and earn XP!', priority: 5 });
    }

    return tips.sort((a, b) => a.priority - b.priority);
  },
};
