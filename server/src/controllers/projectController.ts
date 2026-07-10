import { Response } from "express";

import Task from "../models/Task";

import Project from "../models/Project";

import Workspace from "../models/Workspace";

// CREATE PROJECT

export const createProject = async (req: any, res: Response) => {
  const { title, description, deadline, members } = req.body;

  const workspace = await Workspace.findById(req.params.workspaceId);

  if (!workspace) {
    return res.status(404).json({
      message: "Workspace not found",
    });
  }

  const project = await Project.create({
    title,

    description,

    deadline,

    workspace: workspace._id,

    members: members || [],
  });

  res.status(201).json(project);
};

// GET PROJECTS

export const getProjects = async (req: any, res: Response) => {
  const projects = await Project.find({
    workspace: req.params.workspaceId,
  }).populate(
    "members",

    "name email",
  );

  const projectsWithStats = await Promise.all(
    projects.map(async (project: any) => {
      const tasks = await Task.find({
        project: project._id,
      });

      const completed = tasks.filter((t) => t.status === "done").length;

      return {
        ...project.toObject(),

        totalTasks: tasks.length,

        completedTasks: completed,

        progress:
          tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100),
      };
    }),
  );

  res.json(projectsWithStats);
};
