import { createSlice } from "@reduxjs/toolkit";

interface State {
  workspaces: any[];

  currentWorkspace: any | null;
}

const savedWorkspace = localStorage.getItem("workspace");

const initialState: State = {
  workspaces: [],

  currentWorkspace:
    savedWorkspace && savedWorkspace !== "undefined"
      ? JSON.parse(savedWorkspace)
      : null,
};

const workspaceSlice = createSlice({
  name: "workspace",

  initialState,

  reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },

    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;

      if (action.payload) {
        localStorage.setItem(
          "workspace",

          JSON.stringify(action.payload),
        );
      } else {
        localStorage.removeItem("workspace");
      }
    },
  },
});

export const {
  setWorkspaces,

  setCurrentWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
