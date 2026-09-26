import IORedis from "ioredis";

const url = process.env.REDIS_URL || "redis://localhost:6379";

// App client: fail fast so requests never hang when Redis is down
export const redis = new IORedis(url, {
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  connectTimeout: 5000,
  retryStrategy: (times) => Math.min(times * 500, 5000),
});

// BullMQ needs a connection that retries forever
export const bullConnection = new IORedis(url, { maxRetriesPerRequest: null });

let lastLog = 0;
const onError = (e: any) => {
  if (Date.now() - lastLog > 10_000) {
    console.error("[redis] unavailable:", e.code || e.message);
    lastLog = Date.now();
  }
};
redis.on("error", onError);
bullConnection.on("error", onError);