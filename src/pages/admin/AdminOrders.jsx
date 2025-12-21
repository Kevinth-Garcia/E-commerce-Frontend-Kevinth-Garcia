import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

//pestana de admin para gestionar ordenes 
//con grilla para ver los detalles

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [q, setQ] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/orders/admin/all");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setOrders(list);
    } catch (e) {
      const msg = e?.response?.data?.message || "Error al obtener órdenes";
      setError(msg);
      toast.error(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return orders;

    return orders.filter((o) => {
      const id = (o._id || o.id || "").toString();
      const user = o.usuario
        ? `${o.usuario.email || ""} ${o.usuario.nombre || ""} ${
            o.usuario.apellido || ""
          }`
        : "";
      const productos = Array.isArray(o.productos)
        ? o.productos.map((p) => `${p.nombre}`).join(" ")
        : "";
      return `${id} ${user} ${productos}`.toLowerCase().includes(s);
    });
  }, [orders, q]);

  const money = (n) => Number(n || 0).toFixed(2);
  const countItems = (o) =>
    Array.isArray(o.productos)
      ? o.productos.reduce((acc, p) => acc + (Number(p.cantidad) || 0), 0)
      : 0;

  const askDelete = (o) => setConfirmDelete(o);
  const cancelDelete = () => setConfirmDelete(null);

  const doDelete = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete._id || confirmDelete.id;
    try {
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((x) => (x._id || x.id) !== id));
      toast.success("Orden eliminada ✅");
      setConfirmDelete(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error eliminando orden");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Admin · Órdenes</h1>
          <p className="text-sm opacity-80">Gestión de órdenes del sistema</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            className="w-full sm:w-80 px-3 py-2 rounded-xl border dark:border-zinc-800 bg-transparent"
            placeholder="Buscar por ID, usuario o producto..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            onClick={load}
            className="px-4 py-2 rounded-xl border dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900"
          >
            Recargar
          </button>
        </div>
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
          <div className="p-6 opacity-80">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 opacity-80">No hay órdenes.</div>
        ) : (
          <>
            {/* MOBILE cards */}
            <div className="sm:hidden divide-y dark:divide-zinc-800">
              {filtered.map((o) => {
                const id = o._id || o.id;
                const fecha = o.createdAt || o.fecha;
                const isOpen = openId === id;

                const u = o.usuario || {};
                const who =
                  u.email ||
                  `${u.nombre || ""} ${u.apellido || ""}`.trim() ||
                  "—";

                return (
                  <div key={id} className="p-4">
                    <button
                      className="w-full text-left"
                      onClick={() => toggle(id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs opacity-70">Orden</p>
                          <p className="font-semibold break-all">{id}</p>

                          <p className="mt-2 text-xs opacity-70">Usuario</p>
                          <p className="text-sm break-all">{who}</p>

                          <p className="mt-2 text-xs opacity-70">Fecha</p>
                          <p className="text-sm">
                            {fecha ? new Date(fecha).toLocaleString() : "—"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs opacity-70">Total</p>
                          <p className="font-extrabold">${money(o.total)}</p>

                          <p className="mt-2 text-xs opacity-70">Items</p>
                          <p className="text-sm font-semibold">
                            {countItems(o)}
                          </p>

                          <span className="inline-flex mt-3 px-2 py-1 rounded-lg border text-xs dark:border-zinc-800">
                            {isOpen ? "Ocultar" : "Ver detalle"}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="mt-3 flex gap-2 justify-end">
                      <button
                        onClick={() => askDelete(o)}
                        className="px-3 py-2 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        Eliminar
                      </button>
                    </div>

                    {isOpen && (
                      <div className="mt-4 rounded-2xl border dark:border-zinc-800 overflow-hidden">
                        <div className="px-4 py-2 text-xs font-semibold bg-gray-50 dark:bg-zinc-950">
                          Detalle
                        </div>
                        {Array.isArray(o.productos) && o.productos.length ? (
                          o.productos.map((p, idx) => {
                            const price = Number(p.precio) || 0;
                            const qty = Number(p.cantidad) || 0;
                            return (
                              <div
                                key={`${id}-${idx}`}
                                className="px-4 py-3 border-t dark:border-zinc-800"
                              >
                                <p className="font-semibold">{p.nombre}</p>
                                <p className="text-xs opacity-70">
                                  ${money(price)} × {qty} ={" "}
                                  <span className="font-semibold">
                                    ${money(price * qty)}
                                  </span>
                                </p>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-4 opacity-80">Sin productos.</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* DESKTOP table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-[1050px] w-full text-sm">
                <thead className="text-left">
                  <tr className="border-b dark:border-zinc-800">
                    <th className="p-3">ID</th>
                    <th className="p-3">Usuario</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((o) => {
                    const id = o._id || o.id;
                    const fecha = o.createdAt || o.fecha;
                    const isOpen = openId === id;
                    const u = o.usuario || {};
                    const who =
                      u.email ||
                      `${u.nombre || ""} ${u.apellido || ""}`.trim() ||
                      "—";

                    return (
                      <React.Fragment key={id}>
                        <tr
                          className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40 cursor-pointer"
                          onClick={() => toggle(id)}
                        >
                          <td className="p-3 opacity-70 break-all">{id}</td>
                          <td className="p-3 break-all">{who}</td>
                          <td className="p-3">
                            {fecha ? new Date(fecha).toLocaleString() : "—"}
                          </td>
                          <td className="p-3">{countItems(o)}</td>
                          <td className="p-3 font-semibold">
                            ${money(o.total)}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                askDelete(o);
                              }}
                              className="px-3 py-1.5 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>

                        {isOpen && (
                          <tr className="border-b dark:border-zinc-800">
                            <td colSpan={6} className="p-3">
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
                                    const price = Number(p.precio) || 0;
                                    const qty = Number(p.cantidad) || 0;

                                    return (
                                      <div
                                        key={`${id}-${idx}`}
                                        className="grid grid-cols-12 gap-2 px-4 py-3 border-t dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                      >
                                        <div className="col-span-6">
                                          <p className="font-semibold line-clamp-1">
                                            {p.nombre}
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
                                    Total productos: {countItems(o)}
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
            </div>
          </>
        )}
      </div>

      {/* Confirm delete inline */}
      {confirmDelete && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm">
            ¿Seguro que quieres eliminar la orden{" "}
            <span className="font-semibold break-all">
              {confirmDelete._id || confirmDelete.id}
            </span>
            ? Esta acción no se puede deshacer.
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
