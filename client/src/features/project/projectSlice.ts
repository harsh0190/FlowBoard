import { createSlice } from "@reduxjs/toolkit";

interface Project {
  _id: string;

  title: string;

  description: string;

  deadline: string;

  status: string;

  members: any[];

  totalTasks: number;

  completedTasks: number;

  progress: number;
}

interface State {
  projects: Project[];

  currentProject: Project | null;
}

const initialState: State = {
  projects: [],

  currentProject: null,
};

const projectSlice = createSlice({
  name: "project",

  initialState,

  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },

    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
  },
});

export const { setProjects, setCurrentProject } = projectSlice.actions;

export default projectSlice.reducer;
