import { Link, useLocation } from "react-router-dom";

//pagina de verificacion de email para poder acceder a friki mundo

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function EmailVerification() {
  const q = useQuery();
  const status = (q.get("status") || "").toLowerCase();
  const email = q.get("email") || "";

  const ui = (() => {
    if (status === "success") {
      return {
        title: "✅ Email verificado",
        text: email
          ? `Tu cuenta (${email}) fue verificada correctamente. Ya puedes iniciar sesión.`
          : "Tu cuenta fue verificada correctamente. Ya puedes iniciar sesión.",
        badge:
          "inline-flex items-center rounded-full px-3 py-1 text-sm border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200",
      };
    }

    if (status === "invalid") {
      return {
        title: "⚠️ Enlace inválido o expirado",
        text: "El enlace de verificación no es válido o ya expiró. Si te registraste hace poco, intenta registrarte nuevamente o solicita otro email.",
        badge:
          "inline-flex items-center rounded-full px-3 py-1 text-sm border border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200",
      };
    }

    if (status === "error") {
      return {
        title: "❌ Ocurrió un error",
        text: "No se pudo verificar el email en este momento. Intenta más tarde.",
        badge:
          "inline-flex items-center rounded-full px-3 py-1 text-sm border border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200",
      };
    }

    // default
    return {
      title: "Verificación de email",
      text: "Procesando verificación… Si llegaste aquí manualmente, revisa el enlace del correo.",
      badge:
        "inline-flex items-center rounded-full px-3 py-1 text-sm border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200",
    };
  })();

  return (
    <div className="max-w-md mx-auto rounded-2xl border p-6 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl font-bold">{ui.title}</h1>
        <span className={ui.badge}>{status ? status : "info"}</span>
      </div>

      <p className="mt-3 text-sm opacity-80">{ui.text}</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-2">
        <Link
          to="/login"
          className="flex-1 text-center px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
        >
          Ir a Login
        </Link>

        <Link
          to="/register"
          className="flex-1 text-center px-4 py-2 rounded-xl border dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
        >
          Crear cuenta
        </Link>
      </div>

      <p className="mt-4 text-xs opacity-70">
        Tip: revisa “Spam/Promociones” si no te llegó el email.
      </p>
    </div>
  );
}
