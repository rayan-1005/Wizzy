import { z } from 'zod';
import { logger } from '../utils/logger';

const envSchema = z.object({
  NODE_ENV:                z.enum(['development', 'production', 'test']).default('development'),
  PORT:                    z.coerce.number().default(5000),
  DATABASE_URL:            z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL:               z.string().optional(),
  JWT_SECRET:              z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN:          z.string().default('24h'),
  JWT_REFRESH_EXPIRES_IN:  z.string().default('7d'),
  CORS_ORIGIN:             z.string().default('http://localhost:3000'),
  SOCKET_CORS_ORIGIN:      z.string().default('http://localhost:3000'),
  LOG_LEVEL:               z.string().default('debug'),
  RATE_LIMIT_WINDOW_MS:    z.coerce.number().default(900000),
  RATE_LIMIT_MAX:          z.coerce.number().default(100),
});

type Env = z.infer<typeof envSchema>;

let _env: Env;

export const validateEnv = (): Env => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    logger.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  _env = parsed.data;
  logger.info('✅ Environment validated');
  return _env;
};

export const env = (): Env => {
  if (!_env) return validateEnv();
  return _env;
};
