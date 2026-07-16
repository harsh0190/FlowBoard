import { useEffect, useMemo, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import { getWorkspacesApi } from "../features/workspace/workspaceApi";

import {
  setCurrentWorkspace,
  setWorkspaces,
} from "../features/workspace/workspaceSlice";

import { getProjectsApi } from "../features/project/projectApi";

import {
  setCurrentProject,
  setProjects,
} from "../features/project/projectSlice";

import {
  createTaskApi,
  getTasksApi,
  updateTaskStatusApi,
} from "../features/task/taskApi";

import { setTasks, updateTask } from "../features/task/taskSlice";

import KanbanColumn from "../components/KanbanColumn";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

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
  useEffect(() => {
  document.title = "Kanban | FlowBoard";
}, []);
  const dispatch = useAppDispatch();

  const { workspaces, currentWorkspace } = useAppSelector(
    (state) => state.workspace,
  );

  const { projects, currentProject } = useAppSelector((state) => state.project);

  const { tasks } = useAppSelector((state) => state.task);

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("newest");

  const [priorityFilter, setPriorityFilter] = useState("all");

  const [form, setForm] = useState<{
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }>({
    title: "",
    description: "",
    priority: "medium",
  });

  /* =====================================
        LOAD WORKSPACES
  ===================================== */

  useEffect(() => {
    async function load() {
      try {
        const data = await getWorkspacesApi();

dispatch(setWorkspaces(data));

const savedWorkspaceId = localStorage.getItem("workspaceId");

const savedWorkspace =
  data.find((w: any) => w._id === savedWorkspaceId) || null;

dispatch(
  setCurrentWorkspace(
    savedWorkspace || data[0] || null
  )
);
      } catch {
        toast.error("Unable to load workspaces.");
      }
    }

    load();
  }, [dispatch]);

  /* =====================================
        LOAD PROJECTS
  ===================================== */

  useEffect(() => {
    async function load() {
      if (!currentWorkspace) return;

      try {
        const data = await getProjectsApi(currentWorkspace._id);

        dispatch(setProjects(data));

        dispatch(setTasks([]));

        dispatch(setCurrentProject(null));
      } catch {
        toast.error("Unable to load projects.");
      }
    }

    load();
  }, [currentWorkspace, dispatch]);

  /* =====================================
        LOAD TASKS
  ===================================== */

  useEffect(() => {
    async function load() {
      if (!currentProject) return;

      try {
        const data = await getTasksApi(currentProject._id);

        dispatch(setTasks(data));
      } catch {
        toast.error("Unable to load tasks.");
      }
    }

    load();
  }, [currentProject, dispatch]);

  /* =====================================
        CREATE TASK
  ===================================== */

  async function createTask() {
    if (!currentProject) {
      toast.error("Please select a project.");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Task title is required.");
      return;
    }

    try {
      setLoading(true);

      await createTaskApi(currentProject._id, form);

      toast.success("Task created.");

      setOpen(false);

      setForm({
        title: "",
        description: "",
        priority: "medium",
      });

      const data = await getTasksApi(currentProject._id);

      dispatch(setTasks(data));
    } catch {
      toast.error("Unable to create task.");
    } finally {
      setLoading(false);
    }
  }

  /* =====================================
        DRAG & DROP
  ===================================== */

  const handleDragEnd = async (event: any) => {
    const taskId = event.active.id;

    const newStatus = event.over?.id;

    if (!newStatus) return;

    const currentTask = tasks.find((task) => task._id === taskId);

    if (!currentTask) return;

    dispatch(
      updateTask({
        ...currentTask,
        status: newStatus,
      }),
    );

    try {
      await updateTaskStatusApi(taskId, newStatus);
    } catch {
      toast.error("Unable to update task.");
    }
  };

  /* =====================================
        FILTER
  ===================================== */

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    /* Search by Title */

    if (search.trim()) {
      result = result.filter((task: any) =>
        task.title?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    /* Priority */

    if (priorityFilter !== "all") {
      result = result.filter((task: any) => task.priority === priorityFilter);
    }

    /* Sorting */

    result.sort((a: any, b: any) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        case "priority": {
          const order = {
            high: 3,
            medium: 2,
            low: 1,
          };

          return (
            order[b.priority as keyof typeof order] -
            order[a.priority as keyof typeof order]
          );
        }

        case "title":
          return a.title.localeCompare(b.title);

        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return result;
  }, [tasks, search, priorityFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}

      <div className="space-y-4">

  {/* Row 1 */}

  <div
    className="
flex
items-center
justify-between
gap-4
"
  >
    <div
      className="
flex
items-center
gap-4
"
    >
      {/* Workspace */}

      <select
        value={currentWorkspace?._id || ""}
        onChange={(e) => {
          const workspace =
            workspaces.find((w: any) => w._id === e.target.value) ?? null;

          dispatch(setCurrentWorkspace(workspace));
          if (workspace) {
  localStorage.setItem("workspaceId", workspace._id);
}
        }}
        className="
w-56
border
rounded-xl
px-4
py-3
outline-none
cursor-pointer
"
      >
        <option value="">Workspace</option>

        {workspaces.map((w: any) => (
          <option key={w._id} value={w._id}>
            {w.name}
          </option>
        ))}
      </select>

      {/* Project */}

      <select
        value={currentProject?._id || ""}
        onChange={(e) => {
          const project =
            projects.find((p: any) => p._id === e.target.value) ?? null;

          dispatch(setCurrentProject(project));
        }}
        className="
w-56
border
rounded-xl
px-4
py-3
outline-none
cursor-pointer
"
      >
        <option value="">Project</option>

        {projects.map((project: any) => (
          <option
            key={project._id}
            value={project._id}
          >
            {project.title}
          </option>
        ))}
      </select>
    </div>

    <div
      className="
flex
items-center
gap-3
"
    >

      <Button
        onClick={() => setOpen(true)}
      >
        + Add Task
      </Button>
    </div>
  </div>

  {/* Row 2 */}

  <div
    className="
flex
items-center
gap-4
"
  >
    <Input
      placeholder="Search tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1"
    />

    <select
      value={priorityFilter}
      onChange={(e) => setPriorityFilter(e.target.value)}
      className="
w-48
border
rounded-xl
px-4
py-3
outline-none
cursor-pointer
"
    >
      <option value="all">All Priority</option>

      <option value="high">High</option>

      <option value="medium">Medium</option>

      <option value="low">Low</option>
    </select>
  </div>

</div>
            
      {/* Empty State */}

      {!currentProject ? (
        <div
          className="
rounded-2xl
border
bg-white
py-20
text-center
"
        >
          <h2
            className="
text-2xl
font-semibold
"
          >
            Select a Project
          </h2>

          <p
            className="
mt-2
text-gray-500
"
          >
            Choose a project to manage tasks.
          </p>
        </div>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div
            className="
grid
gap-6
xl:grid-cols-4
"
          >
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={filteredTasks.filter(
                  (task: any) => task.status === column.id,
                )}
              />
            ))}
          </div>
        </DndContext>
      )}

      {/* Modal */}
      <Modal open={open} close={() => setOpen(false)} title="Create Task">
        <div className="space-y-4">
          <Input
            placeholder="Task Title"
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
                priority: e.target.value as "low" | "medium" | "high",
              })
            }
            className="
w-full

border

rounded-xl

px-4
py-3

outline-none

cursor-pointer
"
          >
            <option value="low">Low</option>

            <option value="medium">Medium</option>

            <option value="high">High</option>
          </select>

          <div
            className="
flex
justify-end
gap-3
"
          >
            <Button
              className="
bg-gray-200
text-gray-700
hover:bg-gray-300
"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button disabled={loading} onClick={createTask}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
