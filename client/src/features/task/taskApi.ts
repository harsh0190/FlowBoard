import api from "../../api/axios";

/* ============================================================
   CREATE TASK
============================================================ */

export const createTaskApi = async (
  projectId: string,
  data: {
    title: string;
    description?: string;
    assignedTo?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: string;
  },
  idempotencyKey?: string,
) => {
  const response = await api.post(`/api/tasks/project/${projectId}`, data, {
    headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
  });
  return response.data;
};

/* ============================================================
   GET PROJECT TASKS
============================================================ */

export const getTasksApi = async (projectId: string) => {
  const response = await api.get(`/api/tasks/project/${projectId}`);

  return response.data;
};

/* ============================================================
   GET SINGLE TASK
============================================================ */

export const getTaskApi = async (taskId: string) => {
  const response = await api.get(`/api/tasks/${taskId}`);

  return response.data;
};

/* ============================================================
   UPDATE TASK
============================================================ */

export const updateTaskApi = async (
  taskId: string,
  data: {
    version: number; // required: the version you last read
    title?: string;
    description?: string;
    assignedTo?: string | null;
    priority?: "low" | "medium" | "high";
    dueDate?: string | null;
    status?: "todo" | "in-progress" | "review" | "done";
  },
) => {
  const response = await api.put(`/api/tasks/${taskId}`, data);
  return response.data;
};


export const getTaskActivityApi = async (taskId: string) => {
  const response = await api.get(`/api/tasks/${taskId}/activity`);
  return response.data as { _id: string; message: string; createdAt: string }[];
};

export const isConflict = (e: unknown): boolean => {
  if (typeof e !== "object" || e === null || !("response" in e)) {
    return false;
  }

  const response = e.response;
  return (
    typeof response === "object" &&
    response !== null &&
    "status" in response &&
    response.status === 409
  );
};

/* ============================================================
   DELETE TASK
============================================================ */

export const deleteTaskApi = async (taskId: string) => {
  const response = await api.delete(`/api/tasks/${taskId}`);

  return response.data;
};

/* ============================================================
   UPDATE TASK STATUS
============================================================ */

export const updateTaskStatusApi = async (
  taskId: string,
  status: "todo" | "in-progress" | "review" | "done",
) => {
  const response = await api.patch(`/api/tasks/${taskId}/status`, {
    status,
  });

  return response.data;
};

/* ============================================================
   ADD COMMENT
============================================================ */

export const addCommentApi = async (taskId: string, text: string) => {
  const response = await api.post(`/api/tasks/${taskId}/comment`, {
    text,
  });

  return response.data;
};

/* ============================================================
   SEARCH / FILTER / SORT TASKS
============================================================ */

export const filterTasksApi = async (
  projectId: string,
  params: {
    search?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    sort?: "newest" | "oldest" | "priority" | "deadline" | "title";
  },
) => {
  const response = await api.get(`/api/tasks/project/${projectId}/filter`, {
    params,
  });

  return response.data;
};


export type ProjectDigest = {
  project: string;
  generatedAt: string;
  cached: boolean;
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
    overdue: number;
    dueSoon: number;
    activityThisWeek: number;
  };
  headline: string;
  highlights: string[];
  atRisk: { task: string; reason: string }[];
  nextSteps: string[];
  aiUsed: boolean;
};

export const getProjectDigestApi = async (projectId: string) => {
  const response = await api.post(`/api/tasks/project/${projectId}/digest`);
  return response.data as ProjectDigest;
};