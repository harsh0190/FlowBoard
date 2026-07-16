import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import AppLayout from "../components/layout/AppLayout";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { token, user } = useAppSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}