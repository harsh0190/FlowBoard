import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { redis } from "./config/redis";
import { connectDB } from "./config/database";
import { Server } from "socket.io";
import { startOverdueJob } from "./jobs/overdueCheckJob";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.CLIENT_URL as string],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("joinWorkspace", (workspaceId) => socket.join(workspaceId));
});

(async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

  try {
    await Promise.race([
      redis.ping(),
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error("timeout")), 3000),
      ),
    ]);
    await startOverdueJob(io);
    console.log("[overdue-check] scheduled");
  } catch {
    console.warn(
      "[redis] not reachable: overdue job disabled, idempotency fails open",
    );
  }
})();
