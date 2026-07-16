import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FolderKanban, Users, CheckCircle, Clock } from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

/* Workspace */

import { getWorkspacesApi } from "../features/workspace/workspaceApi";

import {
  setWorkspaces,
  setCurrentWorkspace,
} from "../features/workspace/workspaceSlice";

/* Project */

import { getProjectsApi } from "../features/project/projectApi";

import { setProjects } from "../features/project/projectSlice";

/* Task */

import { getTasksApi } from "../features/task/taskApi";

import { setTasks } from "../features/task/taskSlice";

/* UI */

import Card from "../components/ui/Card";


export default function Dashboard() {
  useEffect(() => {
  document.title = "Dashboard | FlowBoard";
}, []);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { workspaces, currentWorkspace } = useAppSelector(
    (state) => state.workspace,
  );

  const { projects } = useAppSelector((state) => state.project);

  const { tasks } = useAppSelector((state) => state.task);

  /* =====================================
          LOAD WORKSPACES
  ===================================== */

  useEffect(() => {
    async function loadWorkspaces() {
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

    loadWorkspaces();
  }, [dispatch]);

  /* =====================================
          LOAD PROJECTS + TASKS
  ===================================== */

  useEffect(() => {
    async function loadDashboard() {
      if (!currentWorkspace) return;

      try {
        const projectData = await getProjectsApi(currentWorkspace._id);

        dispatch(setProjects(projectData));

        let allTasks: any[] = [];

        for (const project of projectData) {
          const projectTasks = await getTasksApi(project._id);

          allTasks = [...allTasks, ...projectTasks];
        }

        dispatch(setTasks(allTasks));
      } catch {
        toast.error("Unable to load dashboard.");
      }
    }

    loadDashboard();
  }, [currentWorkspace, dispatch]);
  /* =====================================
          DASHBOARD STATS
  ===================================== */

  const completedTasks = tasks.filter(
    (task: any) => task.status === "done",
  ).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  /* =====================================
          PIE CHART
  ===================================== */

  const statusData = [
    {
      name: "Todo",
      value: tasks.filter((task: any) => task.status === "todo").length,
    },

    {
      name: "Progress",
      value: tasks.filter((task: any) => task.status === "in-progress").length,
    },

    {
      name: "Review",
      value: tasks.filter((task: any) => task.status === "review").length,
    },

    {
      name: "Done",
      value: completedTasks,
    },
  ];

  /* =====================================
          BAR CHART
  ===================================== */

  const priorityData = [
    {
      name: "Low",
      count: tasks.filter((task: any) => task.priority === "low").length,
    },

    {
      name: "Medium",
      count: tasks.filter((task: any) => task.priority === "medium").length,
    },

    {
      name: "High",
      count: tasks.filter((task: any) => task.priority === "high").length,
    },
  ];

  /* =====================================
          SELECT WORKSPACE
  ===================================== */

  if (!currentWorkspace) {
    return (
      <div className="space-y-8">
        <div
          className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-3
"
        >
          {workspaces.map((workspace: any) => (
            <Card
              key={workspace._id}
              onClick={() => dispatch(setCurrentWorkspace(workspace))}
              className="
cursor-pointer

transition

hover:-translate-y-1
"
            >
              <h2
                className="
text-xl
font-semibold
"
              >
                {workspace.name}
              </h2>

              <p
                className="
mt-2
text-gray-500
"
              >
                {workspace.members?.length || 0} Members
              </p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Workspace Selector */}

      <div className="flex justify-end">
        <select
          value={currentWorkspace._id}
          onChange={(e) => {
            const selected =
              workspaces.find((w: any) => w._id === e.target.value) ?? null;

            dispatch(setCurrentWorkspace(selected));
            if (selected) {
              localStorage.setItem("workspaceId", selected._id);
            }
          }}
          className="
w-64

border

rounded-xl

px-4
py-3

outline-none

cursor-pointer
"
        >
          {workspaces.map((workspace: any) => (
            <option key={workspace._id} value={workspace._id}>
              {workspace.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}

      <div
        className="
grid
gap-6

sm:grid-cols-2

xl:grid-cols-4
"
      >
        <Card
          onClick={() => navigate("/projects")}
          className="
cursor-pointer

transition

hover:-translate-y-1
"
        >
          <FolderKanban
            className="
mb-4
text-indigo-600
"
            size={28}
          />

          <p className="text-gray-500">Projects</p>

          <h2
            className="
mt-2

text-3xl

font-bold
"
          >
            {projects.length}
          </h2>
        </Card>

        <Card
          onClick={() => navigate("/kanban")}
          className="
cursor-pointer

transition

hover:-translate-y-1
"
        >
          <CheckCircle
            className="
mb-4
text-green-600
"
            size={28}
          />

          <p className="text-gray-500">Tasks</p>

          <h2
            className="
mt-2

text-3xl

font-bold
"
          >
            {totalTasks}
          </h2>
        </Card>

        <Card
          onClick={() => navigate("/members")}
          className="
cursor-pointer

transition

hover:-translate-y-1
"
        >
          <Users
            className="
mb-4
text-blue-600
"
            size={28}
          />

          <p className="text-gray-500">Members</p>

          <h2
            className="
mt-2

text-3xl

font-bold
"
          >
            {currentWorkspace.members?.length || 0}
          </h2>
        </Card>

        <Card>
          <Clock
            className="
mb-4
text-orange-500
"
            size={28}
          />

          <p className="text-gray-500">Progress</p>

          <h2
            className="
mt-2

text-3xl

font-bold
"
          >
            {progress}%
          </h2>
        </Card>
      </div>

      {/* Progress */}

      <Card>
        <div
          className="
flex
items-center
justify-between

mb-4
"
        >
          <h2
            className="
text-xl
font-semibold
"
          >
            Project Progress
          </h2>

          <span
            className="
font-semibold
text-indigo-600
"
          >
            {progress}%
          </span>
        </div>

        <div
          className="
h-4

rounded-full

bg-gray-200
"
        >
          <div
            className="
h-4

rounded-full

bg-indigo-600

transition-all
"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </Card>

      {/* Charts */}
      <div
        className="
grid
gap-8

xl:grid-cols-2
"
      >
        {/* Task Status */}

        <Card>
          <h2
            className="
text-xl
font-semibold
mb-6
"
          >
            Task Status
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {statusData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={["#6366F1", "#3B82F6", "#F59E0B", "#22C55E"][index]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Priority */}

        <Card>
          <h2
            className="
text-xl
font-semibold
mb-6
"
          >
            Task Priority
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
