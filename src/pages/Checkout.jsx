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

  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(false);

  const confirmar = async () => {
    if (loading) return;

    if (!token) {
      toast.info("Debes iniciar sesión para completar la compra.");
      nav("/login", { replace: true });
      return;
    }

    if (!items.length) {
      toast.info("Tu carrito está vacío.");
      nav("/products", { replace: true });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        productos: items.map((i) => ({
          id: i.id,
          nombre: i.title,
          precio: i.price,
          cantidad: i.qty,
        })),
        total: total(),
      };

      // ✅ evita “Procesando…” infinito (Render / email / colgado)
      const controller = new AbortController();
      const timeoutMs = 15000; // 15s
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await api.post("/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      clearTimeout(timer);

      toast.success(res.data?.message || "Compra exitosa ✅");
      clear();

      // ✅ redirigir al catálogo
      nav("/products", { replace: true });
    } catch (e) {
      const aborted =
        e?.name === "AbortError" ||
        e?.code === "ERR_CANCELED" ||
        e?.name === "CanceledError";

      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        (aborted
          ? "El servidor tardó demasiado. Intenta de nuevo (puede estar despertando)."
          : e?.message || "Error creando la orden");

      toast.error(`Error${status ? ` (${status})` : ""}: ${msg}`);
      console.error("Checkout error:", e?.response?.data || e);

      // Si el token expiró / inválido → mandar a login
      if (status === 401 || status === 403) {
        nav("/login", { replace: true });
      }
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
        className="mt-6 w-full px-4 py-3 rounded-2xl bg-black text-white font-semibold disabled:opacity-50 active:scale-[0.99]"
      >
        {loading ? "Procesando..." : "Confirmar compra"}
      </button>

      <p className="mt-3 text-xs opacity-70">
        *Si es la primera compra en Render, puede tardar unos segundos en
        responder.
      </p>
    </div>
  );
}
