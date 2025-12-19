import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

//Pagina de olvido de contraseña
//envia url al correo para cambiar la clave y poder acceder de nuevo
//actualizando los datos en el backend

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return setErr("Ingresa tu email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      return setErr("Email inválido.");

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", {
        email: cleanEmail,
      });

      setSent(true);
      toast.success(res?.data?.message || "Email de recuperación enviado ✅");
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Error enviando el email";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-2xl border p-6 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
      <p className="mt-1 text-sm opacity-80">
        Te enviaremos un enlace para restablecer tu contraseña.
      </p>

      {sent ? (
        <div className="mt-5 rounded-2xl border p-4 dark:border-zinc-800">
          <p className="text-sm">
            ✅ Si el email existe, te llegará un enlace de recuperación. Revisa
            tu bandeja de entrada (y spam).
          </p>

          <div className="mt-4 flex gap-2">
            <Link
              to="/login"
              className="flex-1 text-center px-4 py-2 rounded-xl bg-black text-white"
            >
              Volver a Login
            </Link>
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="flex-1 px-4 py-2 rounded-xl border dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Enviar otra vez
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full px-3 py-2 rounded-xl border dark:border-zinc-700 bg-transparent"
              placeholder="tuemail@gmail.com"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full px-4 py-3 rounded-2xl bg-black text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
              {err}
            </div>
          )}

          <p className="text-sm opacity-80">
            ¿Ya recuerdas?{" "}
            <Link className="underline" to="/login">
              Inicia sesión
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
