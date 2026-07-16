import { NextFunction, Request, Response } from "express";

import Workspace from "../models/Workspace";
import Project from "../models/Project";
import Task from "../models/Task";

const getWorkspace = async (req: any) => {
  // Workspace Routes
  if (req.params.workspaceId) {
    return Workspace.findById(req.params.workspaceId);
  }

  // Project Routes
  if (req.params.projectId) {
    const project = await Project.findById(req.params.projectId);

    if (!project) return null;

    return Workspace.findById(project.workspace);
  }

  // Task Routes
  if (req.params.taskId) {
    const task = await Task.findById(req.params.taskId);

    if (!task) return null;

    const project = await Project.findById(task.project);

    if (!project) return null;

    return Workspace.findById(project.workspace);
  }

  return null;
};

/* ============================================================
   WORKSPACE MEMBER
============================================================ */

export const isWorkspaceMember = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspace = await getWorkspace(req);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found.",
      });
    }

    const isMember = workspace.members.some(
      (member: any) =>
        member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    req.workspace = workspace;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Authorization failed.",
      error,
    });
  }
};

/* ============================================================
   WORKSPACE ADMIN
============================================================ */

export const isWorkspaceAdmin = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspace = await getWorkspace(req);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found.",
      });
    }

    const isAdmin = workspace.members.some(
      (member: any) =>
        member.user.toString() === req.user._id.toString() &&
        member.role === "admin"
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "Only workspace admin can perform this action.",
      });
    }

    req.workspace = workspace;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Authorization failed.",
      error,
    });
  }
};