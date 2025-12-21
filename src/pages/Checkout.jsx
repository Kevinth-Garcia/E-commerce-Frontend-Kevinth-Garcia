import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

export default function Checkout() {
  const nav = useNavigate();

  const items = useCartStore((s) => s.items); // [{id,title,price,image,qty}]
  const total = useCartStore((s) => s.total);
  const clear = useCartStore((s) => s.clear);

  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(false);

  const confirmar = async () => {
    if (!items.length) return;

    // ✅ si no está logueado, mandas a login
    if (!isAuthed || !token) {
      toast.info("Inicia sesión para finalizar la compra.");
      nav("/login");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        productos: items.map((i) => ({
          id: i.id,
          nombre: i.title, // ✅ quieres nombre
          precio: Number(i.price) || 0,
          cantidad: Number(i.qty) || 1,
        })),
        total: total(),
      };

      // ✅ OJO: tu interceptor ya mete el token
      // pero lo dejamos igual por claridad (puedes quitar headers si quieres)
      const res = await api.post("/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000, // ✅ para que no se quede "Procesando..." infinito
      });

      // ✅ tu backend responde: { success, message, data }
      if (res.data?.success !== true) {
        throw new Error(res.data?.message || "No se pudo crear la orden");
      }

      toast.success(res.data?.message || "Compra confirmada ✅");

      // ✅ limpiamos si fue éxito
      clear();

      // ✅ redirigir al catálogo (como pediste)
      nav("/products", { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Error creando la orden";

      // ✅ NO limpiamos carrito si falla
      toast.error(msg);
      console.error("Checkout error:", e?.response?.data || e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border p-6 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="mt-4 space-y-2">
        <p className="text-sm opacity-80">Items: {items.length}</p>
        <p className="text-lg font-bold">Total: ${total()}</p>
      </div>

      <button
        disabled={!items.length || loading}
        onClick={confirmar}
        className="mt-6 w-full px-4 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Confirmar compra"}
      </button>

      {!isAuthed && (
        <p className="mt-3 text-sm opacity-70">
          Para finalizar la compra debes iniciar sesión.
        </p>
      )}
    </div>
  );
}
