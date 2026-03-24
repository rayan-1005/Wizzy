import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const password = await bcrypt.hash('Demo1234', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@gamifiedfinance.com' },
    update: {},
    create: {
      email: 'demo@gamifiedfinance.com',
      password,
      name: 'Demo User',
      monthlyIncome: 80000,
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    },
  });

  // Seed progression
  await prisma.progression.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, level: 3, totalXp: 450, streak: 2 },
  });

  // Seed sample transactions (last 30 days)
  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];
  const txData = Array.from({ length: 20 }, (_, i) => ({
    userId: user.id,
    amount: Math.floor(Math.random() * 2000) + 100,
    category: categories[i % categories.length],
    description: `Sample expense ${i + 1}`,
    date: new Date(Date.now() - i * 86400000),
  }));

  await prisma.transaction.createMany({ data: txData, skipDuplicates: true });

  // Seed a goal
  await prisma.goal.upsert({
    where: { id: 'seed-goal-1' },
    update: {},
    create: {
      id: 'seed-goal-1',
      userId: user.id,
      title: 'Emergency Fund',
      category: 'emergency_fund',
      targetAmount: 100000,
      currentAmount: 25000,
      targetDate: new Date(Date.now() + 90 * 86400000),
    },
  });

  // Seed category mappings
  const mappings = [
    { keyword: 'swiggy',     category: 'Food' },
    { keyword: 'zomato',     category: 'Food' },
    { keyword: 'uber',       category: 'Transport' },
    { keyword: 'ola',        category: 'Transport' },
    { keyword: 'netflix',    category: 'Entertainment' },
    { keyword: 'spotify',    category: 'Entertainment' },
    { keyword: 'electricity',category: 'Utilities' },
    { keyword: 'airtel',     category: 'Utilities' },
  ];

  for (const m of mappings) {
    await prisma.categoryMapping.upsert({
      where: { keyword: m.keyword },
      update: {},
      create: m,
    });
  }

  console.log('✅ Seed complete');
  console.log('   Demo login → demo@gamifiedfinance.com / Demo1234');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
