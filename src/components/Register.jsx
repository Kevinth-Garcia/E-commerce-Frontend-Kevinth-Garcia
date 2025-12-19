import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

//formulario de registro de usuario
//con chequeo que las contraseñas se han iguales
//boton para ver si la contraseña se esta escribiendo correctamente
//con clausulas a seguir para que se haga un registro limpio y facil de ver en la base de datos

export default function Register() {
  const nav = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch =
    form.password && form.confirmPassword
      ? form.password === form.confirmPassword
      : true;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.nombre.trim()) return setErr("El nombre es requerido");
    if (!form.apellido.trim()) return setErr("El apellido es requerido");
    if (!form.email.trim()) return setErr("El email es requerido");
    if (form.password.length < 6)
      return setErr("La contraseña debe tener al menos 6 caracteres");
    if (form.password !== form.confirmPassword)
      return setErr("Las contraseñas no coinciden");

    try {
      setLoading(true);

      const res = await register({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      toast.success(res?.message || "Registro exitoso. Revisa tu email 📩");
      nav("/login", { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Error en el registro";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-2xl border p-6 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      <p className="mt-1 text-sm opacity-80">
        Regístrate para comenzar a comprar.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <input
          className="w-full p-2 rounded-xl border dark:border-zinc-700 bg-transparent"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />

        <input
          className="w-full p-2 rounded-xl border dark:border-zinc-700 bg-transparent"
          placeholder="Apellido"
          value={form.apellido}
          onChange={(e) => setForm({ ...form, apellido: e.target.value })}
        />

        <input
          className="w-full p-2 rounded-xl border dark:border-zinc-700 bg-transparent"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <div className="space-y-1">
          <div className="flex gap-2">
            <input
              className="w-full p-2 rounded-xl border dark:border-zinc-700 bg-transparent"
              placeholder="Contraseña"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="px-3 py-2 rounded-xl border dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
              title={showPassword ? "Ocultar" : "Mostrar"}
            >
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <div className="flex gap-2">
            <input
              className="w-full p-2 rounded-xl border dark:border-zinc-700 bg-transparent"
              placeholder="Confirmar contraseña"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
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

          {/* Mensaje en vivo */}
          {!passwordsMatch && (
            <p className="text-sm text-red-500">
              ❌ Las contraseñas no coinciden
            </p>
          )}

          {passwordsMatch && form.password && form.confirmPassword && (
            <p className="text-sm text-emerald-600">
              ✔️ Las contraseñas coinciden
            </p>
          )}
        </div>

        <button
          disabled={loading}
          className="w-full px-4 py-3 rounded-2xl bg-black text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        {err && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {err}
          </div>
        )}
      </form>

      <p className="mt-4 text-sm opacity-80">
        ¿Ya tienes cuenta?{" "}
        <Link className="underline" to="/login">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
