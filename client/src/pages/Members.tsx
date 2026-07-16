import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import {
  getWorkspacesApi,
  inviteMemberApi,
  removeMemberApi,
} from "../features/workspace/workspaceApi";

import {
  setWorkspaces,
  setCurrentWorkspace,
} from "../features/workspace/workspaceSlice";

import { Trash2 } from "lucide-react";

import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";


export default function Members() {
  useEffect(() => {
  document.title = "Members | FlowBoard";
}, []);
  const dispatch = useAppDispatch();

  const { workspaces, currentWorkspace } = useAppSelector(
    (state) => state.workspace,
  );

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");


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

  if (!currentWorkspace) {
    return (
      <EmptyState
        title="No Workspace"
        message="Create or select a workspace first."
      />
    );
  }
  /* =====================================
          INVITE MEMBER
  ===================================== */

  async function inviteMember() {
    if (loading) return;
    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }

    try {
      setLoading(true);

      const data = await inviteMemberApi(currentWorkspace?._id || "", email);

      dispatch(setCurrentWorkspace(data.workspace));
      localStorage.setItem(
  "workspaceId",
  data.workspace._id
);
      

      dispatch(
        setWorkspaces(
          workspaces.map((workspace: any) =>
            workspace._id === data.workspace._id ? data.workspace : workspace,
          ),
        ),
      );

      toast.success("Member invited successfully.");

      setEmail("");
      setOpen(false);
      setTimeout(() => {
  window.location.reload();
}, 300);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to invite member.");
    } finally {
      setLoading(false);
    }
  }

  /* =====================================
          REMOVE MEMBER
  ===================================== */

  async function confirmRemoveMember() {
  if (!selectedMember) return;

  try {
    const data = await removeMemberApi(
      currentWorkspace?._id || "",
      selectedMember,
    );

    dispatch(setCurrentWorkspace(data.workspace));
    localStorage.setItem(
  "workspaceId",
  data.workspace._id
);
    
    

    dispatch(
      setWorkspaces(
        workspaces.map((workspace: any) =>
          workspace._id === data.workspace._id
            ? data.workspace
            : workspace,
        ),
      ),
    );

    toast.success("Member removed.");

    setDeleteOpen(false);

    setSelectedMember(null);
    setTimeout(() => {
  window.location.reload();
}, 300);
  } catch (error: any) {
    toast.error(
      error.response?.data?.message ||
        "Unable to remove member.",
    );
  }
}

  return (
    <div className="space-y-6">
      {/* Toolbar */}

      <div
        className="
flex
items-center
justify-between
gap-4
flex-wrap
"
      >
        <select
          value={currentWorkspace._id}
          onChange={(e) => {
            const workspace =
              workspaces.find((w: any) => w._id === e.target.value) ?? null;

            dispatch(setCurrentWorkspace(workspace));
            if (workspace) {
  localStorage.setItem("workspaceId", workspace._id);
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

        <Button onClick={() => setOpen(true)}>+ Invite Member</Button>
      </div>

      {/* Members Table */}

      <div className="space-y-5">
  {currentWorkspace.members.length === 0 ? (
    <EmptyState
      title="No Members"
      message="Invite members to your workspace."
    />
  ) : (
    currentWorkspace.members.map((member: any) => (
      <div
        key={member.user._id}
        className="
bg-white

rounded-2xl

shadow-sm

border

p-6

flex
items-center
justify-between

hover:shadow-md

transition
"
      >
        {/* LEFT */}

        <div className="flex items-center gap-5">
          <div
            className="
w-16
h-16

rounded-full

bg-indigo-600

text-white

flex
items-center
justify-center

text-2xl
font-bold
"
          >
            {member.user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {member.user.name}
            </h2>

            <p className="text-gray-500">
              {member.user.email}
            </p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">
          <span
            className={`
px-5
py-2

rounded-full

font-medium

capitalize

${
  member.role === "admin"
    ? "bg-red-100 text-red-600"
    : "bg-blue-100 text-blue-600"
}
`}
          >
            {member.role}
          </span>

          {member.role !== "admin" && (
  <button
    onClick={() => {
      setSelectedMember(member.user._id);

      setDeleteOpen(true);
    }}
    className="
p-2

rounded-lg

text-red-600

hover:bg-red-50

transition

cursor-pointer
"
  >
    <Trash2 size={20} />
  </button>
)}
        </div>
      </div>
    ))
  )}
</div>

      {/* Invite Member Modal */}
      <Modal open={open} close={() => setOpen(false)} title="Invite Member">
        <div className="space-y-4">
          <Input
            placeholder="Member Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div
            className="
flex
justify-end
gap-3
"
          >
            

            <Button disabled={loading} onClick={inviteMember}>
              {loading ? "Inviting..." : "Invite Member"}
            </Button>
          </div>
        </div>
      </Modal>
      <ConfirmModal
  open={deleteOpen}
  close={() => {
    setDeleteOpen(false);

    setSelectedMember(null);
  }}
  title="Remove Member"
  message="Are you sure you want to remove this member from the workspace?"
  onConfirm={confirmRemoveMember}
/>
    </div>
  );
}
