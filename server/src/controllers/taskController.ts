import { Response } from "express";
import { io } from "../server";

import Task from "../models/Task";
import Project from "../models/Project";
import Workspace from "../models/Workspace";
import { logActivity } from "../services/activityLogService";
import ActivityLog from "../models/ActivityLog";

const STATUS_LABEL: Record<string, string> = {
  todo: "Todo",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

const populateTask = (q: any) =>
  q
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("comments.user", "name email");

export const getTaskActivity = async (req: any, res: Response) => {
  try {
    const logs = await ActivityLog.find({ task: req.params.taskId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json(logs);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch activity.", error });
  }
};

/* ============================================================
   Helper
============================================================ */

const updateProjectProgress = async (projectId: string) => {
  const tasks = await Task.find({
    project: projectId,
  });

  const completed = tasks.filter((task: any) => task.status === "done").length;

  const progress =
    tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  await Project.findByIdAndUpdate(projectId, {
    progress,
  });
};

/* ============================================================
   CREATE TASK
============================================================ */

export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const workspace = await Workspace.findById(project.workspace);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found.",
      });
    }

    const isMember = workspace.members.some(
      (member: any) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Only workspace members can create tasks.",
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

    await logActivity({
      taskId: String(task._id),
      workspaceId: String(workspace._id),
      userId: req.user._id,
      userName: req.user.name,
      action: "created",
      detail: `created this task`,
    });

    await updateProjectProgress(String(project._id));
    io.emit("notification", {
      message: `Task "${task.title}" created.`,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

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

export const getTasks = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const workspace = await Workspace.findById(project.workspace);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found.",
      });
    }

    const isMember = workspace.members.some(
      (member: any) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    const tasks = await Task.find({
      project: project._id,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("comments.user", "name email")
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

export const getTask = async (req: any, res: Response) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("comments.user", "name email");

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
export const updateTask = async (req: any, res: Response) => {
  try {
    const task: any = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const project = await Project.findById(task.project);
    if (!project)
      return res.status(404).json({ message: "Project not found." });

    const workspace = await Workspace.findById(project.workspace);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found." });

    const isMember = workspace.members.some(
      (m: any) => m.user.toString() === req.user._id.toString(),
    );
    if (!isMember) return res.status(403).json({ message: "Access denied." });

    const {
      version,
      title,
      description,
      priority,
      status,
      assignedTo,
      dueDate,
    } = req.body;
    if (!Number.isInteger(version)) {
      return res.status(400).json({ message: "Missing version for update." });
    }

    const set: any = {};
    if (title !== undefined) set.title = title;
    if (description !== undefined) set.description = description;
    if (priority !== undefined) set.priority = priority;
    if (status !== undefined) set.status = status;
    if (assignedTo !== undefined) set.assignedTo = assignedTo || null;
    if (dueDate !== undefined) {
      set.dueDate = dueDate || null;
      set.overdueNotified = false; // new deadline, so allow a fresh notification
    }
    if (status !== undefined && task.status === "done" && status !== "done") {
      set.overdueNotified = false; // reopened
    }

    // Atomic compare-and-set: matches only if nobody bumped the version since the client read it
    const updated: any = await populateTask(
      Task.findOneAndUpdate(
        { _id: task._id, version },
        { $set: set, $inc: { version: 1 } },
        { new: true, runValidators: true },
      ),
    );

    if (!updated) {
      const current = await populateTask(Task.findById(task._id));
      return res.status(409).json({
        message:
          "This task was modified by someone else. Refresh and try again.",
        currentTask: current,
      });
    }

    const log = (action: string, detail: string) =>
      logActivity({
        taskId: String(task._id),
        workspaceId: String(task.workspace),
        userId: req.user._id,
        userName: req.user.name,
        action,
        detail,
      });

    if (status !== undefined && status !== task.status)
      await log(
        "status_changed",
        `moved this task to ${STATUS_LABEL[status] ?? status}`,
      );
    if (priority !== undefined && priority !== task.priority)
      await log("priority_changed", `changed priority to ${priority}`);
    if (title !== undefined && title !== task.title)
      await log("title_changed", `renamed this task to "${title}"`);
    if (description !== undefined && description !== task.description)
      await log("description_changed", `updated the description`);
    if (
      assignedTo !== undefined &&
      String(assignedTo || "") !== String(task.assignedTo || "")
    )
      await log(
        "assignee_changed",
        assignedTo ? `changed the assignee` : `unassigned this task`,
      );
    if (dueDate !== undefined)
      await log(
        "due_date_changed",
        dueDate
          ? `set the due date to ${new Date(dueDate).toDateString()}`
          : `cleared the due date`,
      );

    io.emit("notification", { message: `Task "${updated.title}" updated.` });
    await updateProjectProgress(String(project._id));

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update task.", error });
  }
};

/* ============================================================
   UPDATE TASK STATUS
============================================================ */

export const updateTaskStatus = async (req: any, res: Response) => {
  try {
    const { status } = req.body;
    const before: any = await Task.findById(req.params.taskId);
    if (!before) return res.status(404).json({ message: "Task not found." });

    const set: any = { status };
    if (before.status === "done" && status !== "done") set.overdueNotified = false;

    const task: any = await Task.findByIdAndUpdate(
      before._id,
      { $set: set, $inc: { version: 1 } },
      { new: true, runValidators: true },
    );

    if (before.status !== status) {
      await logActivity({
        taskId: String(task._id),
        workspaceId: String(task.workspace),
        userId: req.user._id,
        userName: req.user.name,
        action: "status_changed",
        detail: `moved this task to ${STATUS_LABEL[status] ?? status}`,
      });
    }

    await updateProjectProgress(String(task.project));
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update status.", error });
  }
};

/* ============================================================
   DELETE TASK
============================================================ */

export const deleteTask = async (req: any, res: Response) => {
  try {
    const task: any = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    const projectId = task.project.toString();

    await task.deleteOne();

    await updateProjectProgress(projectId);

    io.emit("notification", {
      message: `Task "${task.title}" deleted.`,
    });

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

export const addComment = async (req: any, res: Response) => {
  try {
    const task: any = await Task.findById(req.params.taskId);

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

    await logActivity({
      taskId: String(task._id),
      workspaceId: task.workspace.toString(),
      userId: req.user._id,
      userName: req.user.name,
      action: "commented",
      detail: `commented on this task`,
    });
    io.emit("notification", {
      message: `New comment added to "${task.title}".`,
    });

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
export const filterTasks = async (req: any, res: Response) => {
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
