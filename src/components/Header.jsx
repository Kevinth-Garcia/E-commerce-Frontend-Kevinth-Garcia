import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

//Header de stictky para front con cambio a menu hamburguesa cuando pasa a pantalla de mobiles

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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

  const closeMenu = () => setOpen(false);

  const onLogout = () => {
    logout();
    closeMenu();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="font-extrabold text-lg tracking-tight"
            onClick={closeMenu}
          >
            Fkiki Mundo
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-2">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={linkClass}>
              Catálogo
            </NavLink>

            <NavLink to="/cart" className={linkClass}>
              Carrito <span className="opacity-70">({count})</span>
            </NavLink>

            {isAuthed && (
              <NavLink to="/orders" className={linkClass}>
                Mis Órdenes
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
            )}

            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg text-sm border dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
              title="Cambiar tema"
              type="button"
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
                <span className="text-sm opacity-80 hidden md:block">
                  {user?.nombre || user?.email}
                </span>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-lg text-sm bg-black text-white dark:bg-white dark:text-black"
                  type="button"
                >
                  Salir
                </button>
              </div>
            )}
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg text-sm border dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
              title="Cambiar tema"
              type="button"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              className="px-3 py-2 rounded-lg text-sm border dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
              aria-label="Abrir menú"
              type="button"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="sm:hidden mt-3 grid gap-2 rounded-2xl border dark:border-zinc-800 p-3 bg-white dark:bg-zinc-950">
            <NavLink to="/" className={linkClass} onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink to="/products" className={linkClass} onClick={closeMenu}>
              Catálogo
            </NavLink>

            <NavLink to="/cart" className={linkClass} onClick={closeMenu}>
              Carrito <span className="opacity-70">({count})</span>
            </NavLink>

            {isAuthed && (
              <NavLink to="/orders" className={linkClass} onClick={closeMenu}>
                Mis Órdenes
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/admin" className={linkClass} onClick={closeMenu}>
                Admin
              </NavLink>
            )}

            {!isAuthed ? (
              <>
                <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  Registro
                </NavLink>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-lg text-sm bg-black text-white dark:bg-white dark:text-black"
                type="button"
              >
                Salir
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
