import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Comment {
  user: {
    _id: string;
    name: string;
    email: string;
  };

  text: string;

  createdAt: string;
}

export interface Task {
  _id: string;

  title: string;

  description: string;

  workspace: string;

  project: string;

  createdBy: {
    _id: string;
    name: string;
    email: string;
  };

  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };

  status:
    | "todo"
    | "in-progress"
    | "review"
    | "done";

  priority:
    | "low"
    | "medium"
    | "high";

  dueDate?: string;

  comments: Comment[];

  createdAt: string;

  updatedAt: string;
}

interface TaskState {
  tasks: Task[];

  currentTask: Task | null;
}

const initialState: TaskState = {
  tasks: [],

  currentTask: null,
};

const taskSlice = createSlice({
  name: "task",

  initialState,

  reducers: {
    setTasks: (
      state,
      action: PayloadAction<Task[]>
    ) => {
      state.tasks = action.payload;
    },

    setCurrentTask: (
      state,
      action: PayloadAction<Task | null>
    ) => {
      state.currentTask = action.payload;
    },

    addTask: (
      state,
      action: PayloadAction<Task>
    ) => {
      state.tasks.unshift(action.payload);
    },

    updateTask: (
      state,
      action: PayloadAction<Task>
    ) => {
      const index = state.tasks.findIndex(
        task => task._id === action.payload._id
      );

      if (index !== -1) {
        state.tasks[index] = action.payload;
      }

      if (
        state.currentTask?._id ===
        action.payload._id
      ) {
        state.currentTask = action.payload;
      }
    },

    updateTaskStatus: (
      state,
      action: PayloadAction<{
        taskId: string;
        status:
          | "todo"
          | "in-progress"
          | "review"
          | "done";
      }>
    ) => {
      const task = state.tasks.find(
        task => task._id === action.payload.taskId
      );

      if (task) {
        task.status = action.payload.status;
      }

      if (
        state.currentTask?._id ===
        action.payload.taskId
      ) {
        state.currentTask.status =
          action.payload.status;
      }
    },

    deleteTask: (
      state,
      action: PayloadAction<string>
    ) => {
      state.tasks = state.tasks.filter(
        task => task._id !== action.payload
      );

      if (
        state.currentTask?._id === action.payload
      ) {
        state.currentTask = null;
      }
    },

    clearTasks: state => {
      state.tasks = [];

      state.currentTask = null;
    },
  },
});

export const {
  setTasks,
  setCurrentTask,
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;