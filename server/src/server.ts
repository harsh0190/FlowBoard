import dotenv from "dotenv";
dotenv.config();

import http from "http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Server } from "socket.io";

import app from "./app";
import Task from "./models/Task";
import Workspace from "./models/Workspace";
import { redis, bullConnection } from "./config/redis";
import { connectDB } from "./config/database";
import { startOverdueJob } from "./jobs/overdueCheckJob";

const PORT = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.CLIENT_URL as string],
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const decoded: any = jwt.verify(
      socket.handshake.auth?.token,
      process.env.JWT_SECRET as string,
    );
    socket.data.userId = decoded.id;
    next();
  } catch {
    next(new Error("unauthorized"));
  }
});

io.on("connection", (socket) => {
  socket.on("joinWorkspace", async (workspaceId: string) => {
    try {
      const ws = await Workspace.findOne({
        _id: workspaceId,
        "members.user": socket.data.userId,
      }).select("_id");

      if (ws) socket.join(String(ws._id));
    } catch {
      // invalid workspace id: ignore
    }
  });
});

let overdue: Awaited<ReturnType<typeof startOverdueJob>> | null = null;

server.on("error", (err: NodeJS.ErrnoException) => {
  console.error(
    err.code === "EADDRINUSE"
      ? `Port ${PORT} is already in use.`
      : `Server error: ${err.message}`,
  );
  process.exit(1);
});

(async () => {
  await connectDB();

  // Tasks created before the version field existed would otherwise always return 409
  await Task.updateMany(
    { version: { $exists: false } },
    { $set: { version: 0 } },
  );

  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );

  try {
    await Promise.race([
      bullConnection.ping(),
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error("timeout")), 5000),
      ),
    ]);
    overdue = await startOverdueJob(io);
    console.log("[overdue-check] scheduled");
  } catch {
    console.warn(
      "[redis] not reachable: overdue job disabled, idempotency fails open",
    );
  }
})();

let shuttingDown = false;

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received, shutting down...`);

  setTimeout(() => process.exit(1), 10_000).unref();

  try {
    await new Promise<void>((resolve) => io.close(() => resolve()));
    await overdue?.worker.close();
    await overdue?.queue.close();
    await redis.quit().catch(() => {});
    await bullConnection.quit().catch(() => {});
    await mongoose.disconnect();
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));