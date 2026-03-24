import { z } from 'zod';

// --- Auth Schemas ---
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  monthlyIncome: z.number().positive('Monthly income must be positive'),
  currency: z.string().default('INR'),
  timezone: z.string().default('UTC'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

// --- Transaction Schemas ---
export const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'] as const;

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  category: z.enum(CATEGORIES, { errorMap: () => ({ message: 'Invalid category' }) }),
  description: z.string().min(1).max(200).optional(),
  date: z.string().datetime('Invalid date format'),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  category: z.enum(CATEGORIES).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
});

// --- Goal Schemas ---
export const createGoalSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1),
  targetAmount: z.number().positive('Target amount must be positive'),
  currentAmount: z.number().min(0).default(0),
  targetDate: z.string().datetime('Invalid date format'),
});

export const updateGoalSchema = createGoalSchema.partial();

// --- User Schemas ---
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  currency: z.string().length(3, 'Currency must be 3 chars (e.g. INR)').optional(),
  timezone: z.string().optional(),
  monthlyIncome: z.number().positive().optional(),
});

// --- Boss Schemas ---
export const updateBossHealthSchema = z.object({
  reduction: z.number().min(1).max(100, 'Reduction must be between 1-100'),
});
