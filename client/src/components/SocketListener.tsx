import { useEffect } from "react";

import { socket } from "../api/socket";

import { useAppDispatch } from "../hooks/redux";

import { addNotification } from "../features/notification/notificationSlice";

export default function SocketListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleNotification = (data: any) => {
  dispatch(addNotification(data.message));
};

    socket.on(
      "notification",

      handleNotification,
    );

    return () => {
      socket.off(
        "notification",

        handleNotification,
      );
    };
  }, [dispatch]);

  return null;
}
