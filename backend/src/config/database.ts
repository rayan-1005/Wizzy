import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('query', (e: Prisma.QueryEvent) => {
  if (e.duration > 2000) {
    console.warn(`Slow query (${e.duration}ms): ${e.query}`);
  }
});

prisma.$on('error', (e: Prisma.LogEvent) => {
  console.error(`Prisma error: ${e.message} — ${e.target}`);
});

prisma.$on('warn', (e: Prisma.LogEvent) => {
  console.warn(`Prisma warning: ${e.message} — ${e.target}`);
});

export default prisma;