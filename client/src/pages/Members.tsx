import { useEffect, useState } from "react";

import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import {
  setWorkspaces,
  setCurrentWorkspace,
} from "../features/workspace/workspaceSlice";

import {
  getWorkspacesApi,
  inviteMemberApi,
} from "../features/workspace/workspaceApi";

import toast from "react-hot-toast";

export default function Members() {
  const dispatch = useAppDispatch();

  const {
    workspaces,

    currentWorkspace,
  } = useAppSelector((state) => state.workspace);

  const { user } = useAppSelector((state) => state.auth);

  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");

  // CHECK ADMIN

  const loggedMember = currentWorkspace?.members?.find(
    (member: any) => member.user?._id === user?._id,
  );

  const isAdmin = loggedMember?.role === "admin";

  // LOAD WORKSPACES

  const loadWorkspaces = async () => {
    try {
      const data = await getWorkspacesApi();

      dispatch(setWorkspaces(data));

      const saved = localStorage.getItem("workspaceId");

      const workspace = data.find((w: any) => w._id === saved) || data[0];

      if (workspace) {
        dispatch(setCurrentWorkspace(workspace));

        localStorage.setItem(
          "workspaceId",

          workspace._id,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  // CHANGE WORKSPACE

  const changeWorkspace = (id: string) => {
    const workspace = workspaces.find((w: any) => w._id === id);

    if (!workspace) return;

    dispatch(setCurrentWorkspace(workspace));

    localStorage.setItem(
      "workspaceId",

      workspace._id,
    );
  };

  // INVITE MEMBER

  const inviteMember = async () => {
    if (!currentWorkspace) {
      toast.error("Select workspace first");

      return;
    }

    if (!email.trim()) {
      toast.error("Enter email");

      return;
    }

    try {
      await inviteMemberApi(
        currentWorkspace._id,

        email,
      );

      // reload updated data

      const data = await getWorkspacesApi();

      dispatch(setWorkspaces(data));

      const updated = data.find((w: any) => w._id === currentWorkspace._id);

      if (updated) {
        dispatch(setCurrentWorkspace(updated));
      }

      toast.success("Member added");

      setEmail("");

      setOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invite failed");
    }
  };

  return (
    <div>
      {/* HEADER */}

      <div
        className="
flex
justify-between
items-center
mb-10
"
      >
        <div>
          <h1
            className="
text-3xl
font-bold
"
          >
            Members
          </h1>

          <p
            className="
text-gray-500
"
          >
            Manage Workspace Users
          </p>
        </div>

        <div
          className="
flex
gap-5
items-center
"
        >
          <select
            value={currentWorkspace?._id || ""}
            onChange={(e) => changeWorkspace(e.target.value)}
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

            {workspaces.map((workspace: any) => (
              <option key={workspace._id} value={workspace._id}>
                {workspace.name}
              </option>
            ))}
          </select>

          {isAdmin && (
            <Button disabled={!currentWorkspace} onClick={() => setOpen(true)}>
              Invite Member
            </Button>
          )}
        </div>
      </div>

      {/* MEMBERS */}

      <div
        className="
space-y-5
"
      >
        {currentWorkspace?.members?.map((member: any) => {
          const memberUser = member.user;

          return (
            <div
              key={member._id}
              className="
bg-white
rounded-2xl
shadow
p-6

flex
justify-between
items-center
"
            >
              <div
                className="
flex
items-center
gap-5
"
              >
                <div
                  className="
w-14
h-14
rounded-full

bg-indigo-600

text-white

flex
items-center
justify-center

font-bold
text-xl
"
                >
                  {memberUser?.name?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <h2
                    className="
font-bold
text-lg
"
                  >
                    {memberUser?.name || "Unknown User"}
                  </h2>

                  <p
                    className="
text-gray-500
"
                  >
                    {memberUser?.email || "No email"}
                  </p>
                </div>
              </div>

              <span
                className={`

px-5
py-2
rounded-full
text-sm
font-medium


${
  member.role === "admin"
    ? "bg-red-100 text-red-600"
    : "bg-blue-100 text-blue-600"
}

`}
              >
                {member.role}
              </span>
            </div>
          );
        })}

        {!currentWorkspace && <p className="text-gray-500">Select workspace</p>}
      </div>

      {/* INVITE MODAL */}

      <Modal open={open} close={() => setOpen(false)} title="Invite Member">
        <div
          className="
space-y-5
"
        >
          <Input
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button onClick={inviteMember}>Send Invite</Button>
        </div>
      </Modal>
    </div>
  );
}
