import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../hooks/redux";

import { setCurrentWorkspace } from "../features/workspace/workspaceSlice";

import { updatePasswordApi } from "../features/user/userApi";

import Card from "../components/ui/Card";

import Input from "../components/ui/Input";

import Button from "../components/ui/Button";

export default function Settings() {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const { currentWorkspace, workspaces } = useAppSelector(
    (state) => state.workspace,
  );

  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!currentWorkspace && workspaces.length > 0) {
      const saved = localStorage.getItem("workspaceId");

      const workspace =
        workspaces.find((w: any) => w._id === saved) || workspaces[0];

      dispatch(setCurrentWorkspace(workspace));
    }
  }, [workspaces]);

  const saveChanges = async () => {
    if (!password.trim()) {
      toast.error("Enter new password");

      return;
    }

    try {
      await updatePasswordApi(password);

      toast.success("Password changed");

      setPassword("");
    } catch (error: any) {
      console.log("PASSWORD ERROR:", error.response?.data);

      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  return (
    <div>
      <h1
        className="
text-3xl
font-bold
mb-10
"
      >
        Settings
      </h1>

      <Card>
        <h2
          className="
font-bold
text-xl
mb-8
"
        >
          Account
        </h2>

        <div
          className="
space-y-5
"
        >
          <Input
            value={user?.name || ""}
            disabled
            className="
bg-gray-100
cursor-not-allowed
"
          />

          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={saveChanges}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
