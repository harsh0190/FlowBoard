import express from "express";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

/* ============================================================
   Project CRUD
============================================================ */

// Create Project
router.post(
  "/workspace/:workspaceId",
  protect,
  createProject
);

// Get All Projects of Workspace
router.get(
  "/workspace/:workspaceId",
  protect,
  getProjects
);

// Get Single Project
router.get(
  "/:projectId",
  protect,
  getProject
);

// Update Project
router.put(
  "/:projectId",
  protect,
  updateProject
);

// Delete Project
router.delete(
  "/:projectId",
  protect,
  deleteProject
);

export default router;