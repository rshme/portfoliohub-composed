import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

export const getRedisConfig = async (configService: ConfigService) => {
  const ttlSeconds = configService.get<number>('REDIS_TTL', 3600);
  const ttlMs = ttlSeconds * 1000;

  try {
    // Try to connect to Redis
    const store = await redisStore({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD'),
      db: configService.get<number>('REDIS_DB', 0),
      // cache-manager v7 / Keyv use TTL in milliseconds
      ttl: ttlMs,
    });

    console.log('✓ Redis cache connected successfully');
    return {
      store,
      isGlobal: true,
    };
  } catch (error) {
    // Fallback to in-memory cache if Redis is not available
    console.warn('⚠ Redis connection failed, falling back to in-memory cache');
    console.warn('Error:', error.message);
    
    return {
      ttl: ttlMs,
      max: 100, // Maximum number of items in cache
      isGlobal: true,
    };
  }
};
