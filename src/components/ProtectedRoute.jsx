import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

//ruta protegida por verificacion

export default function ProtectedRoute() {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthed) return <Navigate to="/login" replace />;
  return <Outlet />;
}
