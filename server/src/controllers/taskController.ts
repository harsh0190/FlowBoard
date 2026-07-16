import { Response } from "express";
import { io } from "../server";

import Task from "../models/Task";
import Project from "../models/Project";
import Workspace from "../models/Workspace";

/* ============================================================
   Helper
============================================================ */

const updateProjectProgress = async (projectId: string) => {
  const tasks = await Task.find({
    project: projectId,
  });

  const completed = tasks.filter(
    (task: any) => task.status === "done"
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completed / tasks.length) * 100
        );

  await Project.findByIdAndUpdate(projectId, {
    progress,
  });
};

/* ============================================================
   CREATE TASK
============================================================ */

export const createTask = async (
  req: any,
  res: Response
) => {
  try {
    const {
      title,
      description,
      assignedTo,
      priority,
      dueDate,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const project = await Project.findById(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const workspace = await Workspace.findById(
      project.workspace
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found.",
      });
    }

    const isMember = workspace.members.some(
      (member: any) =>
        member.user.toString() ===
        req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message:
          "Only workspace members can create tasks.",
      });
    }

    const task = await Task.create({
      title,
      description: description || "",

      project: project._id,

      workspace: workspace._id,

      assignedTo,

      createdBy: req.user._id,

      priority: priority || "medium",

      dueDate,
    });

   await updateProjectProgress(String(project._id));

    const populatedTask =
      await Task.findById(task._id)
        .populate(
          "assignedTo",
          "name email"
        )
        .populate(
          "createdBy",
          "name email"
        );

    

    return res.status(201).json({
      message: "Task created successfully.",
      task: populatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create task.",
      error,
    });
  }
};

/* ============================================================
   GET PROJECT TASKS
============================================================ */

export const getTasks = async (
  req: any,
  res: Response
) => {
  try {
    const project = await Project.findById(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const workspace = await Workspace.findById(
      project.workspace
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found.",
      });
    }

    const isMember = workspace.members.some(
      (member: any) =>
        member.user.toString() ===
        req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    const tasks = await Task.find({
      project: project._id,
    })
      .populate(
        "assignedTo",
        "name email"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "comments.user",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch tasks.",
      error,
    });
  }
};

/* ============================================================
   GET SINGLE TASK
============================================================ */

export const getTask = async (
  req: any,
  res: Response
) => {
  try {
    const task = await Task.findById(
      req.params.taskId
    )
      .populate(
        "assignedTo",
        "name email"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .populate(
        "comments.user",
        "name email"
      );

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    return res.json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch task.",
      error,
    });
  }
};
/* ============================================================
   UPDATE TASK
============================================================ */

export const updateTask = async (
  req: any,
  res: Response
) => {
  try {
    const task: any = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const workspace = await Workspace.findById(
      project.workspace
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found.",
      });
    }

    const isMember = workspace.members.some(
      (member: any) =>
        member.user.toString() ===
        req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    task.title =
      req.body.title ?? task.title;

    task.description =
      req.body.description ??
      task.description;

    task.priority =
      req.body.priority ??
      task.priority;

    task.status =
      req.body.status ??
      task.status;

    task.assignedTo =
      req.body.assignedTo ??
      task.assignedTo;

    task.dueDate =
      req.body.dueDate ??
      task.dueDate;

    await task.save();

    await updateProjectProgress(String(project._id));

    const updatedTask =
      await Task.findById(task._id)
        .populate(
          "assignedTo",
          "name email"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "comments.user",
          "name email"
        );

    

    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update task.",
      error,
    });
  }
};

/* ============================================================
   UPDATE TASK STATUS
============================================================ */

export const updateTaskStatus = async (
  req: any,
  res: Response
) => {
  try {
    const task: any = await Task.findById(
      req.params.taskId
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    task.status = req.body.status;

    await task.save();

    await updateProjectProgress(
      task.project.toString()
    );


    return res.json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update status.",
      error,
    });
  }
};


/* ============================================================
   DELETE TASK
============================================================ */

export const deleteTask = async (
  req: any,
  res: Response
) => {
  try {
    const task: any = await Task.findById(
      req.params.taskId
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    const projectId = task.project.toString();

    await task.deleteOne();

    await updateProjectProgress(projectId);

    

    return res.json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete task.",
      error,
    });
  }
};

/* ============================================================
   ADD COMMENT
============================================================ */

export const addComment = async (
  req: any,
  res: Response
) => {
  try {
    const task: any = await Task.findById(
      req.params.taskId
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    if (!req.body.text?.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty.",
      });
    }

    task.comments.push({
      user: req.user._id,
      text: req.body.text.trim(),
      createdAt: new Date(),
    });

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("comments.user", "name email");

    

    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to add comment.",
      error,
    });
  }
};


/* ============================================================
   FILTER TASKS
============================================================ */
export const filterTasks = async (
  req: any,
  res: Response
) => {
  try {
    const query: any = {
      project: req.params.projectId,
    };

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    if (req.query.search) {
      query.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    let sort: any = {
      createdAt: -1,
    };

    switch (req.query.sort) {
      case "oldest":
        sort = {
          createdAt: 1,
        };
        break;

      case "priority":
        sort = {
          priority: -1,
        };
        break;

      case "deadline":
        sort = {
          dueDate: 1,
        };
        break;

      case "title":
        sort = {
          title: 1,
        };
        break;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("comments.user", "name email")
      .sort(sort);

    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to filter tasks.",
      error,
    });
  }
};