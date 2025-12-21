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
    if (!items.length) return;

    // ✅ si no está logueado, no intentes crear orden
    if (!token) {
      toast.info("Inicia sesión para finalizar la compra.");
      nav("/login");
      return;
    }

    try {
      setLoading(true);

      // ✅ idempotencia para evitar duplicados si hay retry/timeout
      const clientOrderId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      // ✅ payload compatible con tu orderRoutes + nuevo schema
      const payload = {
        clientOrderId,
        productos: items.map((i) => ({
          id: String(i.id),
          nombre: i.title, // mostrar nombre real
          precio: Number(i.price) || 0,
          cantidad: Number(i.qty) || 1,
        })),
        total: Number(total()) || 0,
      };

      // interceptor ya mete Authorization, pero igual no estorba
      const res = await api.post("/orders", payload, {
        timeout: 45000, // Render a veces tarda en la primera request
      });

      if (res.data?.success !== true) {
        throw new Error(res.data?.message || "No se pudo crear la orden");
      }

      toast.success(res.data?.message || "Compra confirmada ✅");

      // ✅ solo borra si fue OK
      clear();

      // ✅ vuelve al catálogo
      nav("/products", { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message || e?.message || "Error creando la orden";

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
        <p className="text-lg font-bold">
          Total: ${Number(total()).toFixed(2)}
        </p>
      </div>

      <button
        disabled={!items.length || loading}
        onClick={confirmar}
        className="mt-6 w-full px-4 py-3 rounded-2xl bg-black text-white font-semibold disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Confirmar compra"}
      </button>
    </div>
  );
}
