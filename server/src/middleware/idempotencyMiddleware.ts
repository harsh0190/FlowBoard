import { Response, NextFunction } from "express";
import { redis } from "../config/redis";

const TTL_SECONDS = 60;

export function idempotency() {
  return async (req: any, res: Response, next: NextFunction) => {
    const key = req.header("idempotency-key");
    if (!key) return next();

    const redisKey = `idem:${req.user._id}:${req.method}:${req.originalUrl}:${key}`;

    try {
      const reserved = await redis.set(
        redisKey,
        JSON.stringify({ state: "processing" }),
        "EX",
        TTL_SECONDS,
        "NX",
      );

      if (!reserved) {
        const raw = await redis.get(redisKey);
        const saved = raw ? JSON.parse(raw) : null;
        if (saved?.state === "done") {
          res.setHeader("Idempotent-Replay", "true");
          return res.status(saved.status).json(saved.body);
        }
        return res.status(409).json({ message: "Duplicate request in progress." });
      }
    } catch {
      return next(); // Redis down: fail open rather than block task creation
    }

    const originalJson = res.json.bind(res);
    res.json = ((body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redis
          .set(redisKey, JSON.stringify({ state: "done", status: res.statusCode, body }), "EX", TTL_SECONDS)
          .catch(() => {});
      } else {
        redis.del(redisKey).catch(() => {}); // failed request: allow a retry
      }
      return originalJson(body);
    }) as typeof res.json;

    res.on("close", () => {
      if (!res.writableFinished) redis.del(redisKey).catch(() => {});
    });

    next();
  };
}