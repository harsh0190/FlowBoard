import { Queue, Worker } from "bullmq";
import type { Server } from "socket.io";
import Task from "../models/Task";
import { bullConnection } from "../config/redis";

export async function startOverdueJob(io: Server) {
  const queue = new Queue("overdue-check", { connection: bullConnection });

  // Stored in Redis, so restarts don't create duplicate schedules
  await queue.upsertJobScheduler(
    "overdue-check-recurring",
    { every: 15 * 60 * 1000 },
    { name: "check" },
  );

  const worker = new Worker(
    "overdue-check",
    async () => {
      const candidates = await Task.find({
        dueDate: { $lt: new Date() },
        status: { $ne: "done" },
        overdueNotified: { $ne: true },
      }).select("_id title workspace");

      let notified = 0;
      for (const task of candidates) {
        // Atomic claim: only the worker that flips the flag emits the notification
        const claimed = await Task.updateOne(
          { _id: task._id, overdueNotified: { $ne: true } },
          { $set: { overdueNotified: true } },
        );
        if (claimed.modifiedCount === 1) {
          io.to(String(task.workspace)).emit("notification", {
            message: `Task "${task.title}" is overdue.`,
          });
          notified++;
        }
      }
      console.log(`[overdue-check] ${notified} newly overdue task(s)`);
    },
    { connection: bullConnection },
  );

  worker.on("failed", (job, err) =>
    console.error("[overdue-check] failed", job?.id, err.message),
  );
  worker.on("error", () => {});
  queue.on("error", () => {});
  return { queue, worker };
}