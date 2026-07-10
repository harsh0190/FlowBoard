import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;

  description: string;

  project: mongoose.Types.ObjectId;

  assignedTo: mongoose.Types.ObjectId;

  status: "todo" | "in-progress" | "review" | "done";

  priority: "low" | "medium" | "high";

  comments: {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
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

    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,

          ref: "User",
        },

        text: String,

        createdAt: {
          type: Date,

          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITask>("Task", taskSchema);
