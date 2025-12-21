import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

//FUNCION DEL LOGIN

export default function Login() {
  const nav = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await login({ email: email.trim().toLowerCase(), password });
      toast.success("Bienvenido ✅");
      nav("/", { replace: true });
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;

      // verificacion de email para poder entrar
      if (status === 403 && data?.emailNotVerified) {
        const msg =
          data?.message ||
          "Verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.";
        setErr(msg);
        toast.warning(msg);
      } else {
        const msg = data?.message || e?.message || "Error";
        setErr(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-2xl border p-6 sm:p-8 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      <p className="mt-1 text-sm opacity-80">
        Accede para comprar y ver tus órdenes.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            className="w-full px-3 py-2 rounded-xl border dark:border-zinc-700 bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tuemail@gmail.com"
            autoComplete="email"
            inputMode="email"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Contraseña</label>
          <div className="flex gap-2">
            <input
              className="w-full px-3 py-2 rounded-xl border dark:border-zinc-700 bg-transparent"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="px-3 py-2 rounded-xl border dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
              title={showPass ? "Ocultar" : "Mostrar"}
            >
              {showPass ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <Link
            className="underline opacity-80 hover:opacity-100"
            to="/forgot-password"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Link
            className="underline opacity-80 hover:opacity-100"
            to="/register"
          >
            Crear cuenta
          </Link>
        </div>

        <button
          disabled={loading}
          className="w-full px-4 py-3 rounded-2xl bg-black text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {err && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {err}
          </div>
        )}
      </form>
    </div>
  );
}
