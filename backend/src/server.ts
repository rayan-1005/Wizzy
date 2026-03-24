import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { validateEnv } from './config/env';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { initSocket } from './config/socket';
import { registerSocketHandlers } from './events/socketHandlers';
import { apiLimiter } from './middlewares/rateLimiter';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import routes from './routes/index';

// Validate env variables on startup
const config = validateEnv();

const app = express();
const httpServer = http.createServer(app);

// ── Security Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsing ───────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ──────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── Routes ─────────────────────────────────────────────────────────
app.use('/api', routes);

// ── 404 & Error Handlers ───────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Socket.IO ─────────────────────────────────────────────────────
const io = initSocket(httpServer);
registerSocketHandlers(io);

// ── Startup ───────────────────────────────────────────────────────
const bootstrap = async () => {
  await connectDatabase();
  await connectRedis();

  httpServer.listen(config.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${config.PORT}`);
    logger.info(`   Environment : ${config.NODE_ENV}`);
    logger.info(`   Socket.IO   : enabled`);
  });
};

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`${signal} received — shutting down gracefully`);
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

bootstrap();

export { app, httpServer };
