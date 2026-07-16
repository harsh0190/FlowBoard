import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  _id: string;

  title: string;

  description: string;

  workspace: string;

  owner: string;

  members: string[];

  color: string;

  status: "active" | "completed" | "archived";

  progress: number;

  deadline?: string;

  createdAt: string;

  updatedAt: string;
}

interface ProjectState {
  projects: Project[];

  currentProject: Project | null;
}

const initialState: ProjectState = {
  projects: [],

  currentProject: null,
};

const projectSlice = createSlice({
  name: "project",

  initialState,

  reducers: {
    setProjects: (
      state,
      action: PayloadAction<Project[]>
    ) => {
      state.projects = action.payload;
    },

    setCurrentProject: (
      state,
      action: PayloadAction<Project | null>
    ) => {
      state.currentProject = action.payload;
    },

    addProject: (
      state,
      action: PayloadAction<Project>
    ) => {
      state.projects.unshift(action.payload);
    },

    updateProject: (
      state,
      action: PayloadAction<Project>
    ) => {
      const index = state.projects.findIndex(
        (project) =>
          project._id === action.payload._id
      );

      if (index !== -1) {
        state.projects[index] = action.payload;
      }

      if (
        state.currentProject?._id ===
        action.payload._id
      ) {
        state.currentProject = action.payload;
      }
    },

    deleteProject: (
      state,
      action: PayloadAction<string>
    ) => {
      state.projects = state.projects.filter(
        (project) =>
          project._id !== action.payload
      );

      if (
        state.currentProject?._id ===
        action.payload
      ) {
        state.currentProject = null;
      }
    },

    clearProjects: (state) => {
      state.projects = [];

      state.currentProject = null;
    },
  },
});

export const {
  setProjects,
  setCurrentProject,
  addProject,
  updateProject,
  deleteProject,
  clearProjects,
} = projectSlice.actions;

export default projectSlice.reducer;