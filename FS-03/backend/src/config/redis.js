/**
 * Redis & BullMQ Connection Manager
 */
const IORedis = require('ioredis');

let redisClient = null;
let isRedisConnected = false;

const initRedis = () => {
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

  try {
    redisClient = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy: () => null,
      connectTimeout: 2000
    });

    redisClient.connect()
      .then(() => {
        isRedisConnected = true;
        console.log('[Redis] Connected successfully for BullMQ background jobs & caching.');
      })
      .catch((err) => {
        isRedisConnected = false;
        console.log(`[Redis] Redis not reachable (${err.message}). Using resilient in-process background worker.`);
      });

    redisClient.on('error', () => {
      isRedisConnected = false;
    });
  } catch (err) {
    isRedisConnected = false;
  }

  return redisClient;
};

const getRedisClient = () => redisClient;
const getRedisStatus = () => isRedisConnected;

module.exports = {
  initRedis,
  getRedisClient,
  getRedisStatus
};
