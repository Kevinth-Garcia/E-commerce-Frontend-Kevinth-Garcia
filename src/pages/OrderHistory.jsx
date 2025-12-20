import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

//historial de ordenes que devuelve por id
//muestra la fecha de cuando fue hecha
//numero de items
//total (suma de todos)
//con opcion de ver desenglozado

export default function OrderHistory() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        // backend: /api/orderRoutes
        const res = await api.get("/orders");
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setOrders(list);
      } catch (e) {
        setError(
          e?.response?.data?.message || e.message || "Error cargando órdenes"
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return orders;

    return orders.filter((o) => {
      const oid = (o._id || o.id || "").toString();

      const productos = Array.isArray(o.productos)
        ? o.productos
            .map((p) => {
              const pid =
                p?.id ||
                p?.productId ||
                p?._id ||
                (typeof p?.producto === "string"
                  ? p.producto
                  : p?.producto?._id) ||
                "";
              return `${p?.nombre || ""} ${pid}`;
            })
            .join(" ")
        : "";

      return `${oid} ${productos}`.toLowerCase().includes(s);
    });
  }, [orders, q]);

  const countItems = (o) => {
    if (!Array.isArray(o.productos)) return 0;
    return o.productos.reduce((acc, p) => acc + (Number(p.cantidad) || 0), 0);
  };

  const money = (n) => Number(n || 0).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Mis Órdenes</h1>
          <p className="text-sm opacity-80">Historial de compras</p>
        </div>

        <input
          className="w-full sm:w-72 px-3 py-2 rounded-xl border dark:border-zinc-800 bg-transparent"
          placeholder="Buscar por id o producto..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 text-red-800 p-3 dark:bg-red-950/30 dark:border-red-900">
          {error}
        </div>
      )}

      <div className="rounded-2xl border dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="bg-gray-50 dark:bg-zinc-950 px-4 py-3 text-sm flex justify-between">
          <span className="font-semibold">Órdenes</span>
          <span className="opacity-70">{filtered.length}</span>
        </div>

        {loading ? (
          <div className="p-6">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 opacity-80">Aún no tienes órdenes.</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-[950px] w-full text-sm">
              <thead className="text-left">
                <tr className="border-b dark:border-zinc-800">
                  <th className="p-3">ID</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Acción</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((o, index) => {
                  //  key seguro
                  const rowKey = o._id || o.id || `row-${index}`;
                  const fecha = o.createdAt || o.fecha;
                  const isOpen = openId === rowKey;

                  return (
                    <React.Fragment key={rowKey}>
                      {/* Fila principal */}
                      <tr
                        className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 cursor-pointer"
                        onClick={() => toggle(rowKey)}
                      >
                        <td className="p-3 opacity-70">{rowKey}</td>

                        <td className="p-3">
                          {fecha ? new Date(fecha).toLocaleString() : "—"}
                        </td>

                        <td className="p-3">{countItems(o)}</td>

                        <td className="p-3 font-semibold">${money(o.total)}</td>

                        <td className="p-3">
                          <span className="px-2 py-1 rounded-lg border dark:border-zinc-800">
                            {isOpen ? "Ocultar" : "Ver detalle"}
                          </span>
                        </td>
                      </tr>

                      {/* Detalle desplegable */}
                      {isOpen && (
                        <tr className="border-b dark:border-zinc-800">
                          <td colSpan={5} className="p-3">
                            <div className="rounded-2xl border dark:border-zinc-800 overflow-hidden">
                              <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold bg-gray-50 dark:bg-zinc-950">
                                <div className="col-span-6">Producto</div>
                                <div className="col-span-2">Precio</div>
                                <div className="col-span-2">Cant.</div>
                                <div className="col-span-2 text-right">
                                  Subtotal
                                </div>
                              </div>

                              {Array.isArray(o.productos) &&
                              o.productos.length ? (
                                o.productos.map((p, idx) => {
                                  const price = Number(p?.precio) || 0;
                                  const qty = Number(p?.cantidad) || 0;

                                  //  ID del producto viene con distintos nombres según backend
                                  const pid =
                                    p?.id ||
                                    p?.productId ||
                                    p?._id ||
                                    (typeof p?.producto === "string"
                                      ? p.producto
                                      : p?.producto?._id) ||
                                    null;

                                  const pKey = `${rowKey}-${pid || "p"}-${idx}`;

                                  return (
                                    <div
                                      key={pKey}
                                      className="grid grid-cols-12 gap-2 px-4 py-3 border-t dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                    >
                                      <div className="col-span-6">
                                        <p className="font-semibold line-clamp-1">
                                          {p?.nombre || "Producto"}
                                        </p>
                                        <p className="text-xs opacity-70 line-clamp-1">
                                          ID: {pid || "—"}
                                        </p>
                                      </div>

                                      <div className="col-span-2">
                                        ${money(price)}
                                      </div>

                                      <div className="col-span-2">{qty}</div>

                                      <div className="col-span-2 text-right font-semibold">
                                        ${money(price * qty)}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="p-4 opacity-80">
                                  Sin productos.
                                </div>
                              )}

                              <div className="flex justify-end gap-6 px-4 py-3 border-t dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-sm">
                                <span className="opacity-70">
                                  Total de productos: {countItems(o)}
                                </span>
                                <span className="font-bold">
                                  Total: ${money(o.total)}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            <div className="px-4 py-3 text-xs opacity-70">
              Tip: haz click en una orden para ver sus productos.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
