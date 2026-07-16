import { Response } from "express";
import User from "../models/User";
import Workspace from "../models/Workspace";
import Project from "../models/Project";
import Task from "../models/Task";

/* ============================================================
   CREATE WORKSPACE
============================================================ */

export const createWorkspace = async (req: any, res: Response) => {
  
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Workspace name is required.",
      });
    }

    const workspace = await Workspace.create({
      name: name.trim(),
      description: description || "",

      owner: req.user._id,

      members: [
        {
          user: req.user._id,
          role: "admin",
          joinedAt: new Date(),
        },
      ],
    });

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    return res.status(201).json({
      message: "Workspace created successfully.",
      workspace: populatedWorkspace,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to create workspace.",
      error,
    });
  }
};

/* ============================================================
   GET ALL MY WORKSPACES
============================================================ */

export const getWorkspaces = async (req: any, res: Response) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    })
      .populate("owner", "name email")
      .populate("members.user", "name email");

    workspaces.forEach((workspace: any) => {
      workspace.members = workspace.members.filter(
        (member: any) => member.user !== null,
      );
    });

    return res.status(200).json(workspaces);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch workspaces.",
      error,
    });
  }
};

/* ============================================================
   GET SINGLE WORKSPACE
============================================================ */

export const getWorkspaceById = async (req: any, res: Response) => {
  try {
    const workspace = req.workspace;

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found.",
      });
    }

    workspace.members = workspace.members.filter(
      (member: any) => member.user !== null,
    );

    return res.status(200).json(workspace);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch workspace.",
      error,
    });
  }
};

/* ============================================================
   UPDATE WORKSPACE
============================================================ */

export const updateWorkspace = async (req: any, res: Response) => {
  try {
    const { name, description } = req.body;

    const workspace = req.workspace;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Workspace name cannot be empty.",
        });
      }

      workspace.name = name.trim();
    }

    if (description !== undefined) {
      workspace.description = description;
    }

    await workspace.save();

    await workspace.populate([
      {
        path: "owner",
        select: "name email",
      },
      {
        path: "members.user",
        select: "name email",
      },
    ]);

    return res.status(200).json({
      message: "Workspace updated successfully.",
      workspace,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update workspace.",
      error,
    });
  }
};
/* ============================================================
   DELETE WORKSPACE
============================================================ */

export const deleteWorkspace = async (req: any, res: Response) => {
  try {
    const workspace = req.workspace;

    await Task.deleteMany({
      workspace: workspace._id,
    });

    await Project.deleteMany({
      workspace: workspace._id,
    });

    await workspace.deleteOne();

    return res.status(200).json({
      message: "Workspace deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete workspace.",
      error,
    });
  }
};

/* ============================================================
   INVITE MEMBER
============================================================ */

export const inviteMember = async (req: any, res: Response) => {
  try {
    const { email, role = "member" } = req.body;

    const workspace = req.workspace;

    if (!email?.trim()) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You are already a member of this workspace.",
      });
    }

    const alreadyMember = workspace.members.some(
      (member: any) => member.user.toString() === user._id.toString(),
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User is already a member.",
      });
    }

    workspace.members.push({
      user: user._id,
      role,
      joinedAt: new Date(),
    });

    await workspace.save();

    const updatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    return res.status(200).json({
      message: "Member invited successfully.",
      workspace: updatedWorkspace,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to invite member.",
      error,
    });
  }
};

/* ============================================================
   REMOVE MEMBER
============================================================ */

export const removeMember = async (req: any, res: Response) => {
  try {
    const { memberId } = req.params;
    const workspace = req.workspace;

    if (memberId === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot remove yourself from the workspace.",
      });
    }

    workspace.members = workspace.members.filter(
      (member: any) => member.user.toString() !== memberId,
    );

    await workspace.save();

    const updatedWorkspace = await Workspace.findById(workspace._id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    return res.status(200).json({
      message: "Member removed successfully.",
      workspace: updatedWorkspace,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to remove member.",
      error,
    });
  }
};
