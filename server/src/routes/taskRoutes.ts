import express from "express";

import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addComment,
  filterTasks,
} from "../controllers/taskController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/* ============================================================
   TASK CRUD
============================================================ */

// Create Task
router.post(
  "/project/:projectId",
  protect,
  createTask
);

// Get All Tasks of Project
router.get(
  "/project/:projectId",
  protect,
  getTasks
);

// Filter Tasks
router.get(
  "/project/:projectId/filter",
  protect,
  filterTasks
);

// Get Single Task
router.get(
  "/:taskId",
  protect,
  getTask
);

// Update Task
router.put(
  "/:taskId",
  protect,
  updateTask
);

// Delete Task
router.delete(
  "/:taskId",
  protect,
  deleteTask
);

/* ============================================================
   TASK STATUS
============================================================ */

// Drag & Drop
router.patch(
  "/:taskId/status",
  protect,
  updateTaskStatus
);


/* ============================================================
   COMMENTS
============================================================ */

// Add Comment
router.post(
  "/:taskId/comment",
  protect,
  addComment
);

export default router;