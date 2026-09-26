import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  task: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  action: string; // e.g. "status_changed", "priority_changed", "created", "commented"
  message: string; // human-readable, e.g. "moved this task to Done"
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true, index: true },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);