import { Request, Response } from "express";

import User from "../models/User";

import Workspace from "../models/Workspace";

// INVITE MEMBER

// INVITE MEMBER

export const inviteMember = async (req: any, res: Response) => {
  try {
    const { email, role } = req.body;

    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const exists = workspace.members.some(
      (member: any) => member.user.toString() === user._id.toString(),
    );

    if (exists) {
      return res.status(400).json({
        message: "Already member",
      });
    }

    workspace.members.push({
      user: user._id,

      role: role || "member",
    });

    await workspace.save();

    // return populated data

    const updatedWorkspace = await Workspace.findById(workspace._id).populate(
      "members.user",
      "name email",
    );

    res.json({
      message: "Member added",

      workspace: updatedWorkspace,
    });
  } catch (error) {
    res.status(500).json({
      message: "Invite failed",

      error,
    });
  }
};

// CREATE WORKSPACE

export const createWorkspace = async (req: any, res: Response) => {
  const { name } = req.body;

  const workspace = await Workspace.create({
    name,

    owner: req.user._id,

    members: [
      {
        user: req.user._id,

        role: "admin",
      },
    ],
  });

  res.status(201).json(workspace);
};

// GET MY WORKSPACES

export const getWorkspaces = async (req: any, res: Response) => {
  const workspaces = await Workspace.find({
    "members.user": req.user._id,
  }).populate(
    "members.user",

    "name email",
  );

  // remove deleted users

  workspaces.forEach((workspace: any) => {
    workspace.members = workspace.members.filter(
      (member: any) => member.user !== null,
    );
  });

  res.json(workspaces);
};
