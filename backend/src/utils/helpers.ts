import { LEVEL_THRESHOLDS, LEVEL_TITLES } from './constants';

// Calculate level from total XP
export function calculateLevel(totalXp: number): number {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
}

// Get XP needed to reach the next level
export function xpToNextLevel(totalXp: number): number {
  const currentLevel = calculateLevel(totalXp);
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel] ?? Infinity;
  return nextThreshold === Infinity ? 0 : nextThreshold - totalXp;
}

// Get level title
export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[level] ?? LEVEL_TITLES[10];
}

// Get the start/end of today in a specific timezone
export function getTodayRange(timezone: string): { start: Date; end: Date } {
  const now = new Date();
  const options = { timeZone: timezone };

  // Get today's date string in the user's timezone
  const today = new Intl.DateTimeFormat('en-CA', { ...options }).format(now); // YYYY-MM-DD

  const start = new Date(`${today}T00:00:00.000Z`);
  const end = new Date(`${today}T23:59:59.999Z`);

  return { start, end };
}

// Format amount from smallest unit to decimal (paise → rupees)
export function formatAmount(amountInSmallestUnit: number, decimals = 2): string {
  return (amountInSmallestUnit / 100).toFixed(decimals);
}

// Convert decimal amount to smallest unit
export function toSmallestUnit(amount: number): number {
  return Math.round(amount * 100);
}

// Calculate percentage change
export function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// Paginate results
export function paginate(page: number, limit: number): { skip: number; take: number } {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

// Get YYYY-MM string for a date
export function getMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7); // YYYY-MM
}
