import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

//panel de observacion de ordenes de admin para eliminar o revisar orden

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [q, setQ] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // order object

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/admin/all");
      setOrders(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error cargando órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return orders;

    return orders.filter((o) => {
      const user = o.usuario
        ? `${o.usuario?.nombre || ""} ${o.usuario?.apellido || ""} ${
            o.usuario?.email || ""
          }`
        : "";

      const products = Array.isArray(o.productos)
        ? o.productos.map((p) => `${p.nombre} ${p.id}`).join(" ")
        : "";

      return `${o._id} ${user} ${products}`.toLowerCase().includes(s);
    });
  }, [orders, q]);

  const toggleOpen = (id) => setOpenId((prev) => (prev === id ? null : id));

  const askDelete = (order) => setConfirmDelete(order);
  const cancelDelete = () => setConfirmDelete(null);

  const doDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/orders/${confirmDelete._id}`);
      setOrders((prev) => prev.filter((o) => o._id !== confirmDelete._id));
      toast.success("Orden eliminada ✅");
      setConfirmDelete(null);
      if (openId === confirmDelete._id) setOpenId(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error eliminando orden");
    }
  };

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Admin · Órdenes</h1>

        <input
          className="w-full sm:w-72 px-3 py-2 rounded-xl border dark:border-zinc-800 bg-transparent"
          placeholder="Buscar por id, usuario o producto..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border dark:border-zinc-800 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold bg-gray-50 dark:bg-zinc-900">
          <div className="col-span-4">Orden</div>
          <div className="col-span-4">Usuario</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        {loading ? (
          <div className="p-4 opacity-80">Cargando...</div>
        ) : filtered.length ? (
          filtered.map((o) => (
            <div key={o._id} className="border-t dark:border-zinc-800">
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-white dark:bg-zinc-950">
                <div className="col-span-4">
                  <p className="font-semibold line-clamp-1">{o._id}</p>
                  <p className="text-xs opacity-70 line-clamp-1">
                    {formatDate(o.createdAt || o.fecha)}
                  </p>
                </div>

                <div className="col-span-4">
                  {o.usuario ? (
                    <>
                      <p className="font-semibold line-clamp-1">
                        {o.usuario?.nombre} {o.usuario?.apellido}
                      </p>
                      <p className="text-xs opacity-70 line-clamp-1">
                        {o.usuario?.email}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm opacity-70">Sin usuario</p>
                  )}
                </div>

                <div className="col-span-2 font-bold">${o.total}</div>

                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => toggleOpen(o._id)}
                    className="px-3 py-1.5 rounded-xl border dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  >
                    {openId === o._id ? "Ocultar" : "Ver"}
                  </button>

                  <button
                    onClick={() => askDelete(o)}
                    className="px-3 py-1.5 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Detalle */}
              {openId === o._id && (
                <div className="px-4 pb-4 bg-white dark:bg-zinc-950">
                  <div className="mt-3 rounded-2xl border dark:border-zinc-800 overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold bg-gray-50 dark:bg-zinc-900">
                      <div className="col-span-6">Producto</div>
                      <div className="col-span-2">Precio</div>
                      <div className="col-span-2">Cantidad</div>
                      <div className="col-span-2 text-right">Subtotal</div>
                    </div>

                    {Array.isArray(o.productos) && o.productos.length ? (
                      o.productos.map((p, idx) => {
                        const price = Number(p.precio) || 0;
                        const qty = Number(p.cantidad) || 0;
                        return (
                          <div
                            key={`${o._id}-${idx}`}
                            className="grid grid-cols-12 gap-2 px-4 py-3 border-t dark:border-zinc-800"
                          >
                            <div className="col-span-6">
                              <p className="font-semibold line-clamp-1">
                                {p.nombre}
                              </p>
                              <p className="text-xs opacity-70 line-clamp-1">
                                ID: {p.id}
                              </p>
                            </div>
                            <div className="col-span-2">${price}</div>
                            <div className="col-span-2">{qty}</div>
                            <div className="col-span-2 text-right font-semibold">
                              ${(price * qty).toFixed(2)}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 opacity-80">Sin productos.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 opacity-80">No hay órdenes.</div>
        )}
      </div>

      {/* Confirmación dentro de la página */}
      {confirmDelete && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm">
            ¿Seguro que quieres eliminar la orden{" "}
            <span className="font-semibold">{confirmDelete._id}</span>? Esta
            acción no se puede deshacer.
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={cancelDelete}
              className="flex-1 px-4 py-2 rounded-xl border dark:border-zinc-700 hover:bg-white/60 dark:hover:bg-zinc-900"
            >
              Cancelar
            </button>
            <button
              onClick={doDelete}
              className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:opacity-90"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
