import { Response } from "express";

import User from "../models/User";

export const updateProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.json({
      message: "Password updated",

      _id: user._id,

      name: user.name,

      email: user.email,
    });
  } catch (error: any) {
    console.log("UPDATE ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};
