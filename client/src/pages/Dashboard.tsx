import { useEffect } from "react";

import { FolderKanban, Users, CheckCircle, Clock } from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

// workspace

import { getWorkspacesApi } from "../features/workspace/workspaceApi";

import {
  setWorkspaces,
  setCurrentWorkspace,
} from "../features/workspace/workspaceSlice";

// project

import { getProjectsApi } from "../features/project/projectApi";

import { setProjects } from "../features/project/projectSlice";

// task

import { getTasksApi } from "../features/task/taskApi";

import { setTasks } from "../features/task/taskSlice";

import Card from "../components/ui/Card";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { currentWorkspace, workspaces } = useAppSelector(
    (state) => state.workspace,
  );

  const { projects } = useAppSelector((state) => state.project);

  const { tasks } = useAppSelector((state) => state.task);

  // LOAD WORKSPACES

  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const data = await getWorkspacesApi();

        dispatch(setWorkspaces(data));
      } catch (error) {
        console.log(error);
      }
    }

    loadWorkspaces();
  }, [dispatch]);

  // LOAD PROJECTS + TASKS

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
      } catch (error) {
        console.log(error);
      }
    }

    loadDashboard();
  }, [currentWorkspace, dispatch]);

  // SELECT WORKSPACE SCREEN

  if (!currentWorkspace) {
    return (
      <div>
        <h1
          className="
text-3xl
font-bold
mb-2
"
        >
          Select Workspace
        </h1>

        <div
          className="
grid
grid-cols-3
gap-6
mt-8
"
        >
          {workspaces.map((w: any) => (
            <Card
              key={w._id}
              onClick={() => dispatch(setCurrentWorkspace(w))}
              className="
hover:-translate-y-1
transition
"
            >
              <h2
                className="
font-bold
text-xl
"
              >
                {w.name}
              </h2>

              <p className="text-gray-500">{w.members?.length || 0} Members</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const completed = tasks.filter((t: any) => t.status === "done").length;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const statusData = [
    {
      name: "Todo",
      value: tasks.filter((t: any) => t.status === "todo").length,
    },

    {
      name: "Progress",
      value: tasks.filter((t: any) => t.status === "in-progress").length,
    },

    {
      name: "Review",
      value: tasks.filter((t: any) => t.status === "review").length,
    },

    {
      name: "Done",
      value: completed,
    },
  ];

  const priorityData = [
    {
      name: "Low",
      count: tasks.filter((t: any) => t.priority === "low").length,
    },

    {
      name: "Medium",
      count: tasks.filter((t: any) => t.priority === "medium").length,
    },

    {
      name: "High",
      count: tasks.filter((t: any) => t.priority === "high").length,
    },
  ];

  return (
    <div>
      {/* HEADER */}

      <div
        className="
flex
justify-between
items-center
mb-8
"
      >
        <div>
          <h1
            className="
text-3xl
font-bold
"
          >
            Dashboard
          </h1>

          <p
            className="
text-gray-500
"
          >
            Workspace Overview
          </p>
        </div>

        <select
          value={currentWorkspace._id}
          onChange={(e) => {
            const selected = workspaces.find(
              (w: any) => w._id === e.target.value,
            );

            dispatch(setCurrentWorkspace(selected));
          }}
          className="
border
rounded-xl
px-4
py-2
cursor-pointer
"
        >
          {workspaces.map((w: any) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {/* STATS */}

      <div
        className="
grid
grid-cols-4
gap-6
mb-10
"
      >
        <Card onClick={() => navigate("/projects")}>
          <FolderKanban />

          <p>Projects</p>

          <h2 className="text-3xl font-bold">{projects.length}</h2>
        </Card>

        <Card onClick={() => navigate("/kanban")}>
          <CheckCircle />

          <p>Tasks</p>

          <h2 className="text-3xl font-bold">{tasks.length}</h2>
        </Card>

        <Card onClick={() => navigate("/members")}>
          <Users />

          <p>Members</p>

          <h2 className="text-3xl font-bold">
            {currentWorkspace.members?.length || 0}
          </h2>
        </Card>

        <Card>
          <Clock />

          <p>Progress</p>

          <h2 className="text-3xl font-bold">{progress}%</h2>
        </Card>
      </div>

      <Card>
        <h2
          className="
font-bold
text-xl
mb-5
"
        >
          Project Progress
        </h2>

        <div
          className="
bg-gray-200
h-4
rounded-full
"
        >
          <div
            style={{
              width: `${progress}%`,
            }}
            className="
bg-indigo-600
h-4
rounded-full
"
          />
        </div>
      </Card>

      {/* CHARTS */}

      <div
        className="
grid
grid-cols-2
gap-8
mt-10
"
      >
        <Card>
          <h2 className="font-bold mb-5">Task Status</h2>

          <ResponsiveContainer height={300}>
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
                {statusData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#6366f1", "#f59e0b", "#3b82f6", "#22c55e"][i]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="font-bold mb-5">Priority</h2>

          <ResponsiveContainer height={300}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
