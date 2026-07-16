import api from "../../api/axios";

/* ============================================================
   CREATE WORKSPACE
============================================================ */

export const createWorkspaceApi = async (
  name: string,
  description: string = ""
) => {
  const response = await api.post("/api/workspaces", {
    name,
    description,
  });

  return response.data;
};

/* ============================================================
   GET ALL WORKSPACES
============================================================ */

export const getWorkspacesApi = async () => {
  const response = await api.get("/api/workspaces");

  return response.data;
};

/* ============================================================
   GET SINGLE WORKSPACE
============================================================ */

export const getWorkspaceApi = async (
  workspaceId: string
) => {
  const response = await api.get(
    `/api/workspaces/${workspaceId}`
  );

  return response.data;
};

/* ============================================================
   UPDATE WORKSPACE
============================================================ */

export const updateWorkspaceApi = async (
  workspaceId: string,
  data: {
    name?: string;
    description?: string;
  }
) => {
  const response = await api.put(
    `/api/workspaces/${workspaceId}`,
    data
  );

  return response.data;
};

/* ============================================================
   DELETE WORKSPACE
============================================================ */

export const deleteWorkspaceApi = async (
  workspaceId: string
) => {
  const response = await api.delete(
    `/api/workspaces/${workspaceId}`
  );

  return response.data;
};

/* ============================================================
   INVITE MEMBER
============================================================ */

export const inviteMemberApi = async (
  workspaceId: string,
  email: string,
) => {
  const response = await api.post(
    `/api/workspaces/${workspaceId}/invite`,
    {
      email,
    }
  );

  return response.data;
};

/* ============================================================
   REMOVE MEMBER
============================================================ */

export const removeMemberApi = async (
  workspaceId: string,
  memberId: string
) => {
  const response = await api.delete(
    `/api/workspaces/${workspaceId}/member/${memberId}`
  );

  return response.data;
};