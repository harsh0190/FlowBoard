import { Response } from "express";
import { io } from "../server";
import Task from "../models/Task";

// CREATE TASK

export const createTask = async (req: any, res: Response) => {
  const { title, description, assignedTo, priority } = req.body;

  const task = await Task.create({
    title,

    description,

    assignedTo,

    priority,

    project: req.params.projectId,
  });

  res.status(201).json(task);
};

// GET PROJECT TASKS

export const getTasks = async (req: any, res: Response) => {
  const tasks = await Task.find({
    project: req.params.projectId,
  })
    .populate(
      "assignedTo",

      "name email",
    )
    .populate(
      "comments.user",

      "name",
    );

  res.json(tasks);
};

// UPDATE TASK STATUS (KANBAN)

// UPDATE TASK STATUS (KANBAN)

export const updateTaskStatus = async (req: any, res: Response) => {
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,

    {
      status: req.body.status,
    },

    {
      new: true,
    },
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  io.emit(
    "notification",

    {
      message: `${task.title} moved to ${task.status}`,

      task,
    },
  );

  res.json(task);
};

// ADD COMMENT

export const addComment = async (req: any, res: Response) => {
  const task: any = await Task.findById(req.params.taskId);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  task.comments.push({
    user: req.user._id,

    text: req.body.text,
  });

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate(
      "assignedTo",

      "name email",
    )
    .populate(
      "comments.user",

      "name email",
    );

  res.json(updatedTask);
};
