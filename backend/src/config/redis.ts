import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  if (!process.env.REDIS_URL) {
    logger.warn('REDIS_URL not set — caching disabled');
    return null;
  }

  if (redisClient) return redisClient;

  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retryStrategy: (times) => {
      if (times > 5) {
        logger.error('Redis max retries reached, giving up');
        return null;
      }
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => logger.info('✅ Redis connected'));
  redisClient.on('error', (err) => logger.error('Redis error', { error: err.message }));
  redisClient.on('close', () => logger.warn('Redis connection closed'));

  return redisClient;
};

// Helper: Get cached value
export const cacheGet = async (key: string): Promise<string | null> => {
  const client = getRedisClient();
  if (!client) return null;
  try {
    return await client.get(key);
  } catch {
    return null;
  }
};

// Helper: Set cached value with optional TTL (seconds)
export const cacheSet = async (
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<void> => {
  const client = getRedisClient();
  if (!client) return;
  try {
    if (ttlSeconds) {
      await client.set(key, value, 'EX', ttlSeconds);
    } else {
      await client.set(key, value);
    }
  } catch (err) {
    logger.warn('Cache set failed', { key, error: err });
  }
};

// Helper: Delete cached value
export const cacheDel = async (key: string): Promise<void> => {
  const client = getRedisClient();
  if (!client) return;
  try {
    await client.del(key);
  } catch (err) {
    logger.warn('Cache delete failed', { key, error: err });
  }
};

export const connectRedis = async (): Promise<void> => {
  const client = getRedisClient();
  if (!client) return;
  try {
    await client.connect();
  } catch (err) {
    logger.warn('Redis connection failed — continuing without cache', { error: err });
  }
};
