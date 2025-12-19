import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

//ruta de acceso de admin

export default function AdminRoute() {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isAuthed) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/no-encontrado" replace />;

  return <Outlet />;
}
