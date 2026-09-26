import ActivityLog from "../models/ActivityLog";

export async function logActivity(params: {
  taskId: string;
  workspaceId: string;
  userId: string;
  userName: string;
  action: string;
  detail: string;
}) {
  try {
    await ActivityLog.create({
      task: params.taskId,
      workspace: params.workspaceId,
      user: params.userId,
      action: params.action,
      message: `${params.userName} ${params.detail}`,
    });
  } catch (e) {
    console.error("[activity-log]", e);
  }
}