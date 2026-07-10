import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import EmptyState from "../components/ui/EmptyState";

import {
  createWorkspaceApi,
  getWorkspacesApi,
} from "../features/workspace/workspaceApi";

import {
  setWorkspaces,
  setCurrentWorkspace,
} from "../features/workspace/workspaceSlice";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

import toast from "react-hot-toast";

export default function Workspace() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { workspaces } = useAppSelector((state) => state.workspace);

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const loadWorkspaces = async () => {
    const data = await getWorkspacesApi();

    dispatch(setWorkspaces(data));
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const create = async () => {
    if (!name.trim()) return;

    await createWorkspaceApi(name);

    toast.success("Workspace created");

    setName("");

    setOpen(false);

    loadWorkspaces();
  };

  return (
    <div>
      <div
        className="
flex
items-center
justify-between
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
            Workspaces
          </h1>

          <br />
          <p className="text-gray-500">Manage Your Teams</p>
        </div>

        <Button onClick={() => setOpen(true)}>+ Workspace</Button>
      </div>

      <div
        className="
grid
grid-cols-3
gap-5
"
      >
        {workspaces.length === 0 ? (
          <EmptyState
            title="No Workspaces"
            message="Create your first workspace"
          />
        ) : (
          workspaces.map((w) => (
            <div
              key={w._id}
              className="
cursor-pointer
hover:-translate-y-1
transition
"
              onClick={() => {
                dispatch(setCurrentWorkspace(w));

                localStorage.setItem("workspaceId", w._id);

                navigate("/projects");
              }}
            >
              <Card>
                <h2
                  className="
text-xl
font-semibold
"
                >
                  {w.name}
                </h2>

                <p
                  className="
text-gray-500
mt-2
"
                >
                  Members: {w.members.length}
                </p>
              </Card>
            </div>
          ))
        )}
      </div>

      <Modal open={open} close={() => setOpen(false)} title="Create Workspace">
        <div className="space-y-4">
          <Input
            placeholder="Workspace name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button onClick={create}>Create</Button>
        </div>
      </Modal>
    </div>
  );
}
