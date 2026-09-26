import express from "express";
import { idempotency } from "../middleware/idempotencyMiddleware";

import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addComment,
  filterTasks,
  getTaskActivity,
} from "../controllers/taskController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/* ============================================================
   TASK CRUD
============================================================ */

// Create Task
router.post("/project/:projectId", protect, idempotency(), createTask);

// Get All Tasks of Project
router.get("/project/:projectId", protect, getTasks);

// Filter Tasks
router.get("/project/:projectId/filter", protect, filterTasks);

// Get Single Task
router.get("/:taskId", protect, getTask);
router.get("/:taskId/activity", protect, getTaskActivity);

// Update Task
router.put("/:taskId", protect, updateTask);

// Delete Task
router.delete("/:taskId", protect, deleteTask);

/* ============================================================
   TASK STATUS
============================================================ */

// Drag & Drop
router.patch("/:taskId/status", protect, updateTaskStatus);

/* ============================================================
   COMMENTS
============================================================ */

// Add Comment
router.post("/:taskId/comment", protect, addComment);

export default router;
