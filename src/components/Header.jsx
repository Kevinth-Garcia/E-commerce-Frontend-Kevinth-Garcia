import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

export default function Header() {
  const navigate = useNavigate();

  const count = useCartStore((s) => s.count());
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const isAdmin = isAuthed && user?.isAdmin === true;

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-black text-white dark:bg-white dark:text-black"
        : "hover:bg-gray-100 dark:hover:bg-zinc-800"
    }`;

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-lg tracking-tight">
          Fkiki Mundo
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={linkClass}>
            Catálogo
          </NavLink>

          <NavLink to="/cart" className={linkClass}>
            Carrito <span className="opacity-70">({count})</span>
          </NavLink>

          {/* USUARIOS LOGUEADOS */}
          {isAuthed && (
            <NavLink to="/orders" className={linkClass}>
              Mis Órdenes
            </NavLink>
          )}

          {/* SOLO ADMIN */}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}

          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg text-sm border dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
            title="Cambiar tema"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {!isAuthed ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Registro
              </NavLink>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80 hidden sm:block">
                {user?.nombre || user?.email}
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-lg text-sm bg-black text-white dark:bg-white dark:text-black"
              >
                Salir
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
