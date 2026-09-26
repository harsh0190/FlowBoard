import { useEffect, useMemo, useRef, useState } from "react";
import DigestModal from "../components/DigestModal";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import { getWorkspacesApi } from "../features/workspace/workspaceApi";
import {
  setCurrentWorkspace,
  setWorkspaces,
  type Workspace,
} from "../features/workspace/workspaceSlice";

import { getProjectsApi } from "../features/project/projectApi";
import {
  setCurrentProject,
  setProjects,
  type Project,
} from "../features/project/projectSlice";

import {
  createTaskApi,
  getTasksApi,
  updateTaskStatusApi,
} from "../features/task/taskApi";
import {
  setTasks,
  updateTask,
  type Task,
  type TaskStatus,
} from "../features/task/taskSlice";

import KanbanColumn from "../components/KanbanColumn";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

const columns = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Completed" },
];

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  columns.map((c) => [c.id, c.title]),
);

const emptyForm = {
  title: "",
  description: "",
  priority: "medium" as "low" | "medium" | "high",
};

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
  const [digestOpen, setDigestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy] = useState("newest");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [dueDate, setDueDate] = useState<string | undefined>();

  // One key per create attempt: a double-click or retry reuses it,
  // a successful create rotates it.
  const idemKey = useRef(crypto.randomUUID());

  /* ===================== LOAD WORKSPACES ===================== */

  useEffect(() => {
    async function load() {
      try {
        const data = await getWorkspacesApi();
        dispatch(setWorkspaces(data));

        const savedId = localStorage.getItem("workspaceId");
        const saved = data.find((w: Workspace) => w._id === savedId) || null;

        dispatch(setCurrentWorkspace(saved || data[0] || null));
      } catch {
        toast.error("Unable to load workspaces.");
      }
    }

    load();
  }, [dispatch]);

  /* ===================== LOAD PROJECTS ===================== */

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

  /* ===================== LOAD TASKS ===================== */

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

  /* ===================== CREATE TASK ===================== */

  async function createTask() {
    if (!currentProject) {
      toast.error("Please select a project.");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Task title is required.");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      await createTaskApi(
        currentProject._id,
        { ...form, dueDate },
        idemKey.current,
      );
      idemKey.current = crypto.randomUUID();

      toast.success("Task created.");

      setOpen(false);
      setForm(emptyForm);
      setDueDate(undefined);

      dispatch(setTasks(await getTasksApi(currentProject._id)));
    } catch {
      toast.error("Unable to create task.");
    } finally {
      setLoading(false);
    }
  }

  /* ===================== CHANGE STATUS ===================== */

  const changeStatus = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;

    dispatch(updateTask({ ...task, status: newStatus })); // optimistic

    try {
      const saved = await updateTaskStatusApi(task._id, newStatus);

      dispatch(
        updateTask({ ...task, status: newStatus, version: saved.version }),
      );

      toast.success(`Moved to ${STATUS_LABEL[newStatus]}`);
    } catch {
      dispatch(updateTask(task)); // roll back
      toast.error("Unable to update status.");
    }
  };

  /* ===================== FILTER ===================== */

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (search.trim()) {
      result = result.filter((task: Task) =>
        task.title?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (priorityFilter !== "all") {
      result = result.filter((task: Task) => task.priority === priorityFilter);
    }

    result.sort((a: Task, b: Task) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        case "priority": {
          const order = { high: 3, medium: 2, low: 1 };
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

  const selectClass = "border rounded-xl px-4 py-3 outline-none cursor-pointer";

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <select
              value={currentWorkspace?._id || ""}
              onChange={(e) => {
                const workspace =
                  workspaces.find((w: Workspace) => w._id === e.target.value) ??
                  null;

                dispatch(setCurrentWorkspace(workspace));

                if (workspace) {
                  localStorage.setItem("workspaceId", workspace._id);
                }
              }}
              className={`w-56 ${selectClass}`}
            >
              <option value="">Workspace</option>

              {workspaces.map((w: Workspace) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>

            <select
              value={currentProject?._id || ""}
              onChange={(e) => {
                const project =
                  projects.find((p: Project) => p._id === e.target.value) ??
                  null;

                dispatch(setCurrentProject(project));
              }}
              className={`w-56 ${selectClass}`}
            >
              <option value="">Project</option>

              {projects.map((project: Project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
              disabled={!currentProject}
              onClick={() => setDigestOpen(true)}
            >
              Weekly Digest
            </Button>

            <Button onClick={() => setOpen(true)}>+ Add Task</Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={`w-48 ${selectClass}`}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Board */}
      {!currentProject ? (
        <div className="rounded-2xl border bg-white py-20 text-center">
          <h2 className="text-2xl font-semibold">Select a Project</h2>
          <p className="mt-2 text-gray-500">
            Choose a project to manage tasks.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              tasks={filteredTasks.filter(
                (task: Task) => task.status === column.id,
              )}
              onStatusChange={changeStatus}
            />
          ))}
        </div>
      )}

      {currentProject && (
        <DigestModal
          open={digestOpen}
          close={() => setDigestOpen(false)}
          projectId={currentProject._id}
          cached={false}
          aiUsed={false}
        />
      )}

      {/* Create Task Modal */}
      <Modal open={open} close={() => setOpen(false)} title="Create Task">
        <div className="space-y-4">
          <Input
            placeholder="Task Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value as "low" | "medium" | "high",
              })
            }
            className={`w-full ${selectClass}`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="flex justify-end gap-3">
            <Button
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
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
