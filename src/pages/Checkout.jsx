import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

//checkout de compra en la tienda

export default function Checkout() {
  const nav = useNavigate();

  const items = useCartStore((s) => s.items); // [{id,title,price,image,qty}]
  const total = useCartStore((s) => s.total);
  const clear = useCartStore((s) => s.clear);

  const token = useAuthStore((s) => s.token);

  const [loading, setLoading] = useState(false);

  const confirmar = async () => {
    if (!items.length) return;

    try {
      setLoading(true);

      // productos: [{ id, nombre, precio, cantidad }], total
      const payload = {
        productos: items.map((i) => ({
          id: i.id,
          nombre: i.title,
          precio: i.price,
          cantidad: i.qty,
        })),
        total: total(),
      };

      const res = await api.post("/orderRoutes", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data?.message || "Orden creada ✅");
      clear();
      nav("/orders", { replace: true });
    } catch (e) {
      const msg =
        e?.response?.data?.message || e.message || "Error creando la orden";
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
        className="mt-6 w-full px-4 py-3 rounded-2xl bg-black text-white font-semibold disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Confirmar compra"}
      </button>
    </div>
  );
}
