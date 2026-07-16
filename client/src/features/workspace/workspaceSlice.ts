import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WorkspaceMember {
  user: {
    _id: string;
    name: string;
    email: string;
  };

  role: "admin" | "member";

  joinedAt: string;
}

export interface Workspace {
  _id: string;

  name: string;

  description: string;

  owner: {
    _id: string;
    name: string;
    email: string;
  };

  members: WorkspaceMember[];

  createdAt: string;

  updatedAt: string;
}

interface WorkspaceState {
  workspaces: Workspace[];

  currentWorkspace: Workspace | null;
}

const initialState: WorkspaceState = {
  workspaces: [],

  currentWorkspace: null,
};

const workspaceSlice = createSlice({
  name: "workspace",

  initialState,

  reducers: {
    setWorkspaces: (
      state,
      action: PayloadAction<Workspace[]>
    ) => {
      state.workspaces = action.payload;
    },

    setCurrentWorkspace: (
      state,
      action: PayloadAction<Workspace | null>
    ) => {
      state.currentWorkspace = action.payload;
    },

    addWorkspace: (
      state,
      action: PayloadAction<Workspace>
    ) => {
      state.workspaces.unshift(action.payload);
    },

    updateWorkspace: (
      state,
      action: PayloadAction<Workspace>
    ) => {
      const index = state.workspaces.findIndex(
        (workspace) =>
          workspace._id === action.payload._id
      );

      if (index !== -1) {
        state.workspaces[index] = action.payload;
      }

      if (
        state.currentWorkspace?._id ===
        action.payload._id
      ) {
        state.currentWorkspace = action.payload;
      }
    },

    deleteWorkspace: (
      state,
      action: PayloadAction<string>
    ) => {
      state.workspaces = state.workspaces.filter(
        (workspace) =>
          workspace._id !== action.payload
      );

      if (
        state.currentWorkspace?._id ===
        action.payload
      ) {
        state.currentWorkspace = null;
      }
    },

    clearWorkspace: (state) => {
      state.workspaces = [];

      state.currentWorkspace = null;
    },
  },
});

export const {
  setWorkspaces,
  setCurrentWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  clearWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;