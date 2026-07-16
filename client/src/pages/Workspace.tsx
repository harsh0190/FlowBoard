import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import {
  createWorkspaceApi,
  getWorkspacesApi,
  updateWorkspaceApi,
  deleteWorkspaceApi,
} from "../features/workspace/workspaceApi";

import {
  setWorkspaces,
  setCurrentWorkspace,
} from "../features/workspace/workspaceSlice";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function Workspace() {
  useEffect(() => {
  document.title = "Workspaces | FlowBoard";
}, []);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { workspaces } = useAppSelector(
    (state) => state.workspace
  );

  const { user } = useAppSelector(
    (state) => state.auth
  );

  const [open, setOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

const [selectedWorkspace, setSelectedWorkspace] =
  useState<string | null>(null);

  const [editing, setEditing] = useState(false);

  const [selectedId, setSelectedId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  const loadWorkspaces = async () => {
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
      toast.error(
        "Unable to load workspaces."
      );
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedId("");
    setEditing(false);
  };

  const openCreateModal = () => {
    resetForm();
    setOpen(true);
  };

  const openEditModal = (workspace: any) => {
    setEditing(true);

    setSelectedId(workspace._id);

    setName(workspace.name);

    setDescription(
      workspace.description || ""
    );

    setOpen(true);
  };

  const saveWorkspace = async () => {
    if (!name.trim()) {
      toast.error(
        "Workspace name is required."
      );
      return;
    }

    try {
      setLoading(true);

      if (editing) {
        await updateWorkspaceApi(
          selectedId,
          {
            name,
            description,
          }
        );

        toast.success(
          "Workspace updated."
        );
      } else {
        await createWorkspaceApi(
          name,
          description
        );

        toast.success(
          "Workspace created."
        );
      }

      setOpen(false);

      resetForm();

      loadWorkspaces();
    } catch {
      toast.error(
        editing
          ? "Unable to update workspace."
          : "Unable to create workspace."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeWorkspace = async (
    workspaceId: string
  ) => {
    
    try {
      await deleteWorkspaceApi(
        workspaceId
      );

      toast.success(
        "Workspace deleted."
      );

      loadWorkspaces();
    } catch {
      toast.error(
        "Unable to delete workspace."
      );
    }
  };
  const confirmDeleteWorkspace = async () => {
  if (!selectedWorkspace) return;

  await removeWorkspace(selectedWorkspace);

  setDeleteOpen(false);

  setSelectedWorkspace(null);
};


  return (
        <div>

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <Button onClick={openCreateModal}>
          + New Workspace
        </Button>

      </div>

      {/* Workspaces */}

      {workspaces.length === 0 ? (

        <EmptyState
          title="No Workspaces Yet"
          message="Create your first workspace to start managing projects."
        />

      ) : (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {workspaces.map((workspace: any) => {

            const role =
              workspace.members.find(
                (member: any) =>
                  member.user._id === user?._id
              )?.role || "member";

            return (

              <Card
                key={workspace._id}
                className="transition-all hover:-translate-y-1"
                onClick={() => {
    dispatch(setCurrentWorkspace(workspace));

    if (workspace) {
  localStorage.setItem("workspaceId", workspace._id);
}

    navigate("/projects");
  }}
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h2 className="text-xl font-semibold">
                      {workspace.name}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {workspace.description ||
                        "No description provided."}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {role}
                  </span>

                </div>

                <div className="mt-6 flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    👥 {workspace.members.length} Members
                  </span>

                </div>

                <div className="mt-6 flex gap-3">

                  

                  {role === "admin" && (

                    <>

                      <Button
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                        onClick={(e) =>{
                          e.stopPropagation();
                          openEditModal(workspace)
                        }
                           
                        }
                      >
                        Edit
                      </Button>

                      <Button
  className="bg-red-600 hover:bg-red-700 text-white"
  onClick={(e) => {
    e.stopPropagation();
    setSelectedWorkspace(workspace._id);
    setDeleteOpen(true);
  }}
>
  Delete
</Button>

                    </>

                  )}

                </div>

              </Card>

            );

          })}

        </div>

      )}

      {/* Modal */}
            <Modal
        open={open}
        close={() => {
          setOpen(false);
          resetForm();
        }}
        title={
          editing
            ? "Edit Workspace"
            : "Create Workspace"
        }
      >
        <div className="space-y-4">

          <Input
            placeholder="Workspace Name"
            value={name}
            disabled={loading}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <Input
            placeholder="Description (Optional)"
            value={description}
            disabled={loading}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <div className="flex justify-end gap-3">

            <Button
              disabled={loading}
              onClick={saveWorkspace}
            >
              {loading
                ? editing
                  ? "Updating..."
                  : "Creating..."
                : editing
                ? "Update Workspace"
                : "Create Workspace"}
            </Button>

          </div>

        </div>

      </Modal>
      <ConfirmModal
  open={deleteOpen}
  close={() => {
    setDeleteOpen(false);
    setSelectedWorkspace(null);
  }}
  title="Delete Workspace"
  message="This workspace will be permanently deleted."
  onConfirm={confirmDeleteWorkspace}
/>

    </div>
  );
}