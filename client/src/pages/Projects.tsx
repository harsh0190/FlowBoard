import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmptyState from "../components/ui/EmptyState";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import {
  createProjectApi,
  getProjectsApi,
} from "../features/project/projectApi";

import {
  setProjects,
  setCurrentProject,
} from "../features/project/projectSlice";

import { setCurrentWorkspace } from "../features/workspace/workspaceSlice";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

import toast from "react-hot-toast";

export default function Projects() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const {
    currentWorkspace,

    workspaces,
  } = useAppSelector((s) => s.workspace);

  const { projects } = useAppSelector((s) => s.project);

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",

    description: "",

    deadline: "",
  });

  const loadProjects = async () => {
    if (!currentWorkspace) return;

    const data = await getProjectsApi(currentWorkspace._id);

    dispatch(setProjects(data));
  };

  useEffect(() => {
    loadProjects();
  }, [currentWorkspace]);

  const create = async () => {
    if (!currentWorkspace) return;

    await createProjectApi(
      currentWorkspace._id,

      form,
    );

    toast.success("Project created");

    setOpen(false);

    setForm({
      title: "",

      description: "",

      deadline: "",
    });

    loadProjects();
  };

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
        <h1
          className="

text-3xl

font-bold

"
        >
          Projects
        </h1>
        
        <div
          className="

flex

items-center

gap-5

"
        >
          <select
            value={currentWorkspace?._id || ""}
            onChange={(e) => {
              const selected = workspaces.find(
                (w: any) => w._id === e.target.value,
              );

              dispatch(setCurrentWorkspace(selected));

              dispatch(setCurrentProject(null));
            }}
            className="

border

rounded-xl

px-5

py-3

cursor-pointer

outline-none

"
          >
            <option value="">Select Workspace</option>

            {workspaces.map((w: any) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>

          <Button onClick={() => setOpen(true)}>+ Project</Button>
        </div>
      </div>

      <div
        className="

grid

grid-cols-3

gap-5

"
      >
        {projects.length === 0 ? (
          <EmptyState title="No Projects" message="Create your first project" />
        ) : (
          projects.map((project: any) => (
            <div
              key={project._id}
              className="

cursor-pointer

hover:-translate-y-1

transition

"
              onClick={() => {
                dispatch(setCurrentProject(project));

                localStorage.setItem(
                  "projectId",

                  project._id,
                );

                navigate("/kanban");
              }}
            >
              <Card>
                <h2
                  className="

font-bold

text-xl

"
                >
                  {project.title}
                </h2>

                <p
                  className="

text-gray-500

mt-2

"
                >
                  {project.description}
                </p>

                <div className="mt-5">
                  <div
                    className="

flex

justify-between

text-sm

mb-2

"
                  >
                    <span>Progress</span>

                    <span>{project.progress || 0}%</span>
                  </div>

                  <div
                    className="

h-2

bg-gray-200

rounded-full

"
                  >
                    <div
                      style={{
                        width: `${project.progress || 0}%`,
                      }}
                      className="

h-2

bg-indigo-600

rounded-full

"
                    />
                  </div>
                </div>

                <div
                  className="

flex

justify-between

mt-5

text-sm

text-gray-500

"
                >
                  <span>
                    {project.completedTasks || 0}/{project.totalTasks || 0}
                    tasks
                  </span>

                  <span>{project.deadline?.slice(0, 10)}</span>
                </div>
              </Card>
            </div>
          ))
        )}
      </div>

      <Modal open={open} close={() => setOpen(false)} title="Create Project">
        <div className="space-y-4">
          <Input
            placeholder="Title"
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

          <Input
            type="date"
            value={form.deadline}
            onChange={(e) =>
              setForm({
                ...form,

                deadline: e.target.value,
              })
            }
          />

          <Button onClick={create}>Create</Button>
        </div>
      </Modal>
    </div>
  );
}
