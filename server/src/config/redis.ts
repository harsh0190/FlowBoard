import IORedis from "ioredis";

export const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null, // required by BullMQ workers
});

let lastLog = 0;
redis.on("error", (e: any) => {
  if (Date.now() - lastLog > 10_000) {
    console.error("[redis] unavailable:", e.code || e.message);
    lastLog = Date.now();
  }
});