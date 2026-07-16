import { Response } from "express";

import Task from "../models/Task";
import Project from "../models/Project";
import Workspace from "../models/Workspace";

/* ============================================================
   CREATE PROJECT
============================================================ */

export const createProject = async (req: any, res: Response) => {
  try {
    const { title, description, deadline, members, color } = req.body;

    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isAdmin = workspace.members.some(
      (member: any) =>
        member.user.toString() === req.user._id.toString() &&
        member.role === "admin",
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "Only workspace admin can create projects.",
      });
    }

    const project = await Project.create({
      title,
      description,
      deadline,
      color: color || "#2563EB",
      workspace: workspace._id,
      owner: req.user._id,
      members: members || [],
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    return res.status(201).json({
      message: "Project created successfully.",
      project: populatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create project.",
      error,
    });
  }
};

/* ============================================================
   GET PROJECTS
============================================================ */

export const getProjects = async (req: any, res: Response) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member: any) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const projects = await Project.find({
      workspace: req.params.workspaceId,
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    const projectsWithStats = await Promise.all(
      projects.map(async (project: any) => {
        const tasks = await Task.find({
          project: project._id,
        });

        const completed = tasks.filter(
          (task: any) => task.status === "done",
        ).length;

        return {
          ...project.toObject(),

          totalTasks: tasks.length,

          completedTasks: completed,

          progress:
            tasks.length === 0
              ? 0
              : Math.round((completed / tasks.length) * 100),
        };
      }),
    );

    return res.json(projectsWithStats);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch projects.",
      error,
    });
  }
};

/* ============================================================
   GET SINGLE PROJECT
============================================================ */

export const getProject = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.json(project);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch project",
      error,
    });
  }
};

/* ============================================================
   UPDATE PROJECT
============================================================ */

export const updateProject = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const workspace = await Workspace.findById(project.workspace);

    const isAdmin = workspace?.members.some(
      (member: any) =>
        member.user.toString() === req.user._id.toString() &&
        member.role === "admin",
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "Only workspace admin can update projects.",
      });
    }

    project.title = req.body.title ?? project.title;

    project.description = req.body.description ?? project.description;

    project.deadline = req.body.deadline ?? project.deadline;

    project.members = req.body.members ?? project.members;

    project.color = req.body.color ?? project.color;

    await project.save();

    return res.json({
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update project.",
      error,
    });
  }
};

/* ============================================================
   DELETE PROJECT
============================================================ */

export const deleteProject = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const workspace = await Workspace.findById(project.workspace);

    const isAdmin = workspace?.members.some(
      (member: any) =>
        member.user.toString() === req.user._id.toString() &&
        member.role === "admin",
    );

    if (!isAdmin) {
      return res.status(403).json({
        message: "Only workspace admin can delete projects.",
      });
    }

    await Task.deleteMany({
      project: project._id,
    });

    await project.deleteOne();

    return res.json({
      message: "Project deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete project.",
      error,
    });
  }
};
