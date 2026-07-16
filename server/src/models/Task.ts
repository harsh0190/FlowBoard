import mongoose, { Schema, Document } from "mongoose";

export interface IComment {
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface ITask extends Document {
  title: string;

  description: string;

  workspace: mongoose.Types.ObjectId;

  project: mongoose.Types.ObjectId;

  assignedTo?: mongoose.Types.ObjectId;

  createdBy: mongoose.Types.ObjectId;

  status: "todo" | "in-progress" | "review" | "done";

  priority: "low" | "medium" | "high";

  dueDate?: Date;

  comments: IComment[];

  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const taskSchema = new Schema<ITask>(
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

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITask>(
  "Task",
  taskSchema
);