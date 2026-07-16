import { Navigate } from "react-router-dom";

import { useAppSelector } from "../hooks/redux";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAppSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
