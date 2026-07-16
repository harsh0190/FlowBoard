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
    dueDate?: Date;
  },
) => {
  const response = await api.post(`/api/tasks/project/${projectId}`, data);

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
    title?: string;
    description?: string;
    assignedTo?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: Date;
    status?: "todo" | "in-progress" | "review" | "done";
  },
) => {
  const response = await api.put(`/api/tasks/${taskId}`, data);

  return response.data;
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
