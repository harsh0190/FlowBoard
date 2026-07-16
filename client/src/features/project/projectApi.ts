import api from "../../api/axios";

/* ============================================================
   CREATE PROJECT
============================================================ */

export const createProjectApi = async (
  workspaceId: string,
  data: {
    title: string;
    description?: string;
    deadline?: Date;
    color?: string;
    members?: string[];
  }
) => {
  const response = await api.post(
    `/api/projects/workspace/${workspaceId}`,
    data
  );

  return response.data;
};

/* ============================================================
   GET ALL PROJECTS
============================================================ */

export const getProjectsApi = async (
  workspaceId: string
) => {
  const response = await api.get(
    `/api/projects/workspace/${workspaceId}`
  );

  return response.data;
};

/* ============================================================
   GET SINGLE PROJECT
============================================================ */

export const getProjectApi = async (
  projectId: string
) => {
  const response = await api.get(
    `/api/projects/${projectId}`
  );

  return response.data;
};

/* ============================================================
   UPDATE PROJECT
============================================================ */

export const updateProjectApi = async (
  projectId: string,
  data: {
    title?: string;
    description?: string;
    deadline?: Date;
    color?: string;
    status?: "active" | "completed" | "archived";
    members?: string[];
  }
) => {
  const response = await api.put(
    `/api/projects/${projectId}`,
    data
  );

  return response.data;
};

/* ============================================================
   DELETE PROJECT
============================================================ */

export const deleteProjectApi = async (
  projectId: string
) => {
  const response = await api.delete(
    `/api/projects/${projectId}`
  );

  return response.data;
};