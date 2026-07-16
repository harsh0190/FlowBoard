import express from "express";

import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  removeMember,
} from "../controllers/workspaceController";

import { protect } from "../middleware/authMiddleware";

import {
  isWorkspaceAdmin,
  isWorkspaceMember,
} from "../middleware/workspaceMiddleware";

const router = express.Router();

/* ============================================================
   Workspace CRUD
============================================================ */

// Create Workspace
router.post(
  "/",
  protect,
  createWorkspace
);

// Get All Workspaces
router.get(
  "/",
  protect,
  getWorkspaces
);

// Get Single Workspace
router.get(
  "/:workspaceId",
  protect,
  isWorkspaceMember,
  getWorkspaceById
);

// Update Workspace
router.put(
  "/:workspaceId",
  protect,
  isWorkspaceAdmin,
  updateWorkspace
);

// Delete Workspace
router.delete(
  "/:workspaceId",
  protect,
  isWorkspaceAdmin,
  deleteWorkspace
);

/* ============================================================
   Members
============================================================ */

// Invite Member
router.post(
  "/:workspaceId/invite",
  protect,
  isWorkspaceAdmin,
  inviteMember
);

// Remove Member
router.delete(
  "/:workspaceId/member/:memberId",
  protect,
  isWorkspaceAdmin,
  removeMember
);


export default router;