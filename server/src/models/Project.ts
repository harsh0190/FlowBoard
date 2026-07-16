import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;

  description: string;

  workspace: mongoose.Types.ObjectId;

  owner: mongoose.Types.ObjectId;

  members: mongoose.Types.ObjectId[];

  color: string;

  status: "active" | "completed" | "archived";

  progress: number;

  deadline?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },

    color: {
      type: String,
      default: "#2563EB",
    },

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IProject>("Project", projectSchema);
