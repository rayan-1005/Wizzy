import { prisma } from '../config/database';

beforeAll(async () => {
  // Use test database (set TEST_DATABASE_URL in .env.test)
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-chars';
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Clean test data between tests
afterEach(async () => {
  if (process.env.NODE_ENV === 'test') {
    // Order matters — delete children before parents
    await prisma.session.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.spendingPattern.deleteMany();
    await prisma.notificationQueue.deleteMany();
    await prisma.bossBattle.deleteMany();
    await prisma.quest.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.leaderboard.deleteMany();
    await prisma.progression.deleteMany();
    await prisma.user.deleteMany();
  }
});
