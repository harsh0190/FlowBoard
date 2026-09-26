import { useEffect } from "react";
import { socket } from "../api/socket";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addNotification } from "../features/notification/notificationSlice";

export default function SocketListener() {
  const dispatch = useAppDispatch();
  const workspaceId = useAppSelector((s) => s.workspace.currentWorkspace?._id);

  useEffect(() => {
    const onNotification = (data: { message: string }) =>
      dispatch(addNotification(data.message));
    socket.on("notification", onNotification);
    return () => {
      socket.off("notification", onNotification);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!workspaceId) return;
    const join = () => socket.emit("joinWorkspace", workspaceId);
    join();
    socket.on("connect", join); // rejoin after reconnects
    return () => {
      socket.off("connect", join);
    };
  }, [workspaceId]);

  return null;
}