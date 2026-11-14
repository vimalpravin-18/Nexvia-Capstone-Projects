const Redis = require('ioredis');

let redisClient = null;
const memoryStore = new Map();

try {
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
    connectTimeout: 2000
  });

  redisClient.connect().then(() => {
    console.log('Redis connected successfully for cart & session caching');
  }).catch((err) => {
    console.log(`Redis not running locally (${err.message}). Using in-memory cart cache adapter.`);
    redisClient = null;
  });

  redisClient.on('error', () => {
    redisClient = null;
  });
} catch (e) {
  redisClient = null;
}

const cacheService = {
  async get(key) {
    if (redisClient) {
      try {
        const val = await redisClient.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        // Fall back to memory cache on Redis read failure
      }
    }
    return memoryStore.get(key) || null;
  },

  async set(key, value, ttlSeconds = 86400) {
    if (redisClient) {
      try {
        await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch (err) {
        // Fall back to memory store on write failure
      }
    }
    memoryStore.set(key, value);
  },

  async del(key) {
    if (redisClient) {
      try {
        await redisClient.del(key);
      } catch (err) {
        // Continue to clear memory
      }
    }
    memoryStore.delete(key);
  }
};

module.exports = cacheService;

