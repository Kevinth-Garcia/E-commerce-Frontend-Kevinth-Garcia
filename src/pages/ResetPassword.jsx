import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

//pagina de reseteo de contraseña para la comodidad del usuario
//seguiendo las consignias para que al guardar sea facil de arreglar en el backend

export default function ResetPassword() {
  const nav = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordsMatch = useMemo(() => {
    if (!password || !confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!token) return setErr("Token inválido.");
    if (password.length < 6)
      return setErr("La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirmPassword)
      return setErr("Las contraseñas no coinciden.");

    try {
      setLoading(true);
      const res = await api.post(`/auth/reset-password/${token}`, { password });

      toast.success(res?.data?.message || "Contraseña actualizada ✅");
      nav("/login", { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error restableciendo la contraseña";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-2xl border p-6 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold">Restablecer contraseña</h1>
      <p className="mt-1 text-sm opacity-80">Ingresa tu nueva contraseña.</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Nueva contraseña</label>
          <div className="flex gap-2">
            <input
              className="w-full px-3 py-2 rounded-xl border dark:border-zinc-700 bg-transparent"
              placeholder="••••••••"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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
          <p className="text-xs opacity-70">Mínimo 6 caracteres.</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Confirmar contraseña</label>
          <div className="flex gap-2">
            <input
              className={`w-full px-3 py-2 rounded-xl border dark:border-zinc-700 bg-transparent ${
                !passwordsMatch ? "border-red-400" : ""
              }`}
              placeholder="••••••••"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="px-3 py-2 rounded-xl border dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
              title={showConfirm ? "Ocultar" : "Mostrar"}
            >
              {showConfirm ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>

          {!passwordsMatch && (
            <p className="text-sm text-red-500">
              ❌ Las contraseñas no coinciden
            </p>
          )}
          {password && confirmPassword && passwordsMatch && (
            <p className="text-sm text-emerald-600">
              ✔️ Las contraseñas coinciden
            </p>
          )}
        </div>

        <button
          disabled={loading}
          className="w-full px-4 py-3 rounded-2xl bg-black text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar contraseña"}
        </button>

        {err && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {err}
          </div>
        )}

        <p className="text-sm opacity-80">
          Volver a{" "}
          <Link className="underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
