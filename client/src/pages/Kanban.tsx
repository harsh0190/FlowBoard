import { useEffect, useState } from "react";

import { DndContext } from "@dnd-kit/core";

import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import { getWorkspacesApi } from "../features/workspace/workspaceApi";

import {
  setWorkspaces,
  setCurrentWorkspace,
} from "../features/workspace/workspaceSlice";

import { getProjectsApi } from "../features/project/projectApi";

import {
  setProjects,
  setCurrentProject,
} from "../features/project/projectSlice";

import {
  createTaskApi,
  getTasksApi,
  updateTaskStatusApi,
} from "../features/task/taskApi";

import { setTasks, updateTaskLocal } from "../features/task/taskSlice";

import KanbanColumn from "../components/KanbanColumn";

import Input from "../components/ui/Input";

import Modal from "../components/ui/Modal";

import Button from "../components/ui/Button";

const columns = [
  {
    id: "todo",
    title: "Todo",
  },

  {
    id: "in-progress",
    title: "In Progress",
  },

  {
    id: "review",
    title: "Review",
  },

  {
    id: "done",
    title: "Completed",
  },
];

export default function Kanban() {
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const { workspaces, currentWorkspace } = useAppSelector(
    (state) => state.workspace,
  );

  const { projects, currentProject } = useAppSelector((state) => state.project);

  const { tasks } = useAppSelector((state) => state.task);

  const [form, setForm] = useState({
    title: "",

    description: "",

    priority: "medium",
  });

  // LOAD WORKSPACES

  useEffect(() => {
    async function load() {
      try {
        const data = await getWorkspacesApi();

        dispatch(setWorkspaces(data));
      } catch (error) {
        console.log(error);
      }
    }

    load();
  }, [dispatch]);

  // LOAD PROJECTS

  useEffect(() => {
    async function load() {
      if (!currentWorkspace) return;

      const data = await getProjectsApi(currentWorkspace._id);

      dispatch(setProjects(data));

      dispatch(setTasks([]));
    }

    load();
  }, [currentWorkspace, dispatch]);

  // LOAD TASKS

  useEffect(() => {
    async function load() {
      if (!currentProject) return;

      const data = await getTasksApi(currentProject._id);

      dispatch(setTasks(data));
    }

    load();
  }, [currentProject, dispatch]);

  async function createTask() {
    if (!currentProject) {
      toast.error("Choose project first");

      return;
    }

    await createTaskApi(currentProject._id, form);

    toast.success("Task created");

    setOpen(false);

    setForm({
      title: "",

      description: "",

      priority: "medium",
    });

    const data = await getTasksApi(currentProject._id);

    dispatch(setTasks(data));
  }

  const handleDragEnd = async (event: any) => {
    const taskId = event.active.id;

    const newStatus = event.over?.id;

    if (!newStatus) return;

    const currentTask = tasks.find((task) => task._id === taskId);

    if (currentTask?.status === newStatus) return;

    dispatch(
      updateTaskLocal({
        id: taskId,

        status: newStatus,
      }),
    );

    await updateTaskStatusApi(
      taskId,

      newStatus,
    );
  };

  // SEARCH FIX

  const filteredTasks = tasks.filter((task: any) => {
    const value = search.toLowerCase();

    return (
      task.title?.toLowerCase().includes(value) ||
      task.description?.toLowerCase().includes(value)
    );
  });

  return (
    <div>
      {/* HEADER */}

      <div className="mb-10">
        <div
          className="
flex
justify-between
items-start
gap-6
"
        >
          <div
            className="
space-y-6
flex-1
"
          >
            <div>
              <h1
                className="
text-3xl
font-bold
"
              >
                Kanban Board
              </h1>

              <p
                className="
text-gray-500
mt-2
"
              >
                Manage Project Workflow
              </p>
            </div>

            <div
              className="
flex
gap-4
items-center
"
            >
              <select
                value={currentWorkspace?._id || ""}
                onChange={(e) => {
                  const workspace = workspaces.find(
                    (w: any) => w._id === e.target.value,
                  );

                  dispatch(setCurrentWorkspace(workspace));

                  dispatch(setCurrentProject(null));
                }}
                className="
border
rounded-xl
px-5
py-3
h-14
cursor-pointer
min-w-60
"
              >
                <option value="">Choose Workspace</option>

                {workspaces.map((w: any) => (
                  <option key={w._id} value={w._id}>
                    {w.name}
                  </option>
                ))}
              </select>

              <select
                value={currentProject?._id || ""}
                onChange={(e) => {
                  const project = projects.find(
                    (p: any) => p._id === e.target.value,
                  );

                  dispatch(setCurrentProject(project));
                }}
                className="
border
rounded-xl
px-5
py-3
h-14
cursor-pointer
min-w-60
"
              >
                <option value="">Choose Project</option>

                {projects.map((p: any) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>

              <Input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
h-14
w-72
"
              />
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="
bg-indigo-600
text-white

h-12

px-6

rounded-xl

font-semibold

cursor-pointer

hover:bg-indigo-700

transition

shrink-0
"
          >
            + Add Task
          </button>
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="
grid
grid-cols-1
md:grid-cols-4
gap-6
"
        >
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={filteredTasks.filter((task) => task.status === column.id)}
            />
          ))}
        </div>
      </DndContext>

      <Modal open={open} close={() => setOpen(false)} title="Create Task">
        <div className="space-y-4">
          <Input
            placeholder="Task title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,

                title: e.target.value,
              })
            }
          />

          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,

                description: e.target.value,
              })
            }
          />

          <select
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,

                priority: e.target.value,
              })
            }
            className="
border
rounded-xl
p-3
w-full
cursor-pointer
"
          >
            <option value="low">Low</option>

            <option value="medium">Medium</option>

            <option value="high">High</option>
          </select>

          <Button onClick={createTask}>Create</Button>
        </div>
      </Modal>
    </div>
  );
}
