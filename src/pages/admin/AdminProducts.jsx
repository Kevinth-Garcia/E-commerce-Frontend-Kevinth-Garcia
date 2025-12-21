import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

// Admin · Productos (CRUD)
// - Responsive: Mobile = cards / Desktop = tabla
// - Fix: soporta _id (Mongo) y id

const emptyForm = { nombre: "", descripcion: "", precio: "", imagen: "" };

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // producto

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;

    return items.filter((p) => {
      const nombre = (p.nombre || "").toLowerCase();
      const desc = (p.descripcion || "").toLowerCase();
      return `${nombre} ${desc}`.includes(s);
    });
  }, [items, q]);

  const load = async () => {
    setLoading(true);
    try {
      // ✅ GET /api/products
      const res = await api.get("/products");
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error cargando productos");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getId = (p) => p?._id || p?.id;

  const startEdit = (p) => {
    const id = getId(p);
    if (!id) return toast.error("ID de producto inválido");

    setEditingId(id);
    setForm({
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio:
        p.precio !== undefined && p.precio !== null ? String(p.precio) : "",
      imagen: p.imagen || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (e) => {
    e.preventDefault();

    const nombre = form.nombre.trim();
    const descripcion = form.descripcion.trim();
    const imagen = form.imagen.trim();

    if (!nombre) return toast.error("Nombre requerido");
    if (!descripcion) return toast.error("Descripción requerida");

    const precioNum = Number(form.precio);
    if (Number.isNaN(precioNum) || precioNum < 0) {
      return toast.error("Precio inválido");
    }

    if (!imagen) return toast.error("Imagen requerida (URL)");

    try {
      if (editingId) {
        // ✅ PUT /api/products/:id
        await api.put(`/products/${editingId}`, {
          nombre,
          descripcion,
          precio: precioNum,
          imagen,
        });
        toast.success("Producto actualizado ✅");
      } else {
        // ✅ POST /api/products
        await api.post("/products", {
          nombre,
          descripcion,
          precio: precioNum,
          imagen,
        });
        toast.success("Producto creado ✅");
      }

      cancelEdit();
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error guardando producto");
    }
  };

  const askDelete = (p) => setConfirmDelete(p);
  const cancelDelete = () => setConfirmDelete(null);

  const doDelete = async () => {
    if (!confirmDelete) return;
    const id = getId(confirmDelete);
    if (!id) return toast.error("ID de producto inválido");

    try {
      // ✅ DELETE /api/products/:id
      await api.delete(`/products/${id}`);
      toast.success("Producto eliminado ✅");

      setItems((prev) => prev.filter((x) => getId(x) !== id));
      setConfirmDelete(null);

      // si estabas editando ese producto, resetea form
      if (editingId === id) cancelEdit();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error eliminando producto");
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* LISTADO */}
      <section className="lg:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">Admin · Productos</h1>
            <p className="text-sm opacity-80">
              Crea, edita y elimina productos del catálogo.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              className="w-full sm:w-64 px-3 py-2 rounded-xl border dark:border-zinc-800 bg-transparent"
              placeholder="Buscar..."
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

        <div className="rounded-2xl border dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950">
          <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 text-sm flex justify-between">
            <span className="font-semibold">Productos</span>
            <span className="opacity-70">{filtered.length}</span>
          </div>

          {loading ? (
            <div className="p-4 opacity-80">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 opacity-80">No hay productos.</div>
          ) : (
            <>
              {/* ✅ MOBILE: cards */}
              <div className="sm:hidden divide-y dark:divide-zinc-800">
                {filtered.map((p) => {
                  const id = getId(p);
                  return (
                    <div key={id} className="p-4">
                      <div className="flex gap-3 items-start">
                        <img
                          src={p.imagen}
                          alt={p.nombre}
                          className="w-16 h-16 rounded-xl object-cover border dark:border-zinc-800"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/256?text=No+Image";
                          }}
                        />

                        <div className="flex-1">
                          <p className="font-semibold">{p.nombre}</p>
                          <p className="text-xs opacity-70 line-clamp-2">
                            {p.descripcion}
                          </p>
                          <p className="mt-2 font-extrabold">
                            ${Number(p.precio || 0).toFixed(2)}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              onClick={() => startEdit(p)}
                              className="px-3 py-2 rounded-xl border dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() => askDelete(p)}
                              className="px-3 py-2 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ✅ DESKTOP: tabla */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm">
                  <thead className="text-left">
                    <tr className="border-b dark:border-zinc-800">
                      <th className="p-3">Producto</th>
                      <th className="p-3">Precio</th>
                      <th className="p-3">Imagen</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((p) => {
                      const id = getId(p);
                      return (
                        <tr
                          key={id}
                          className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40"
                        >
                          <td className="p-3">
                            <p className="font-semibold line-clamp-1">
                              {p.nombre}
                            </p>
                            <p className="text-xs opacity-70 line-clamp-1">
                              {p.descripcion}
                            </p>
                          </td>

                          <td className="p-3 font-extrabold">
                            ${Number(p.precio || 0).toFixed(2)}
                          </td>

                          <td className="p-3">
                            <img
                              src={p.imagen}
                              alt={p.nombre}
                              className="w-16 h-12 rounded-xl object-cover border dark:border-zinc-800"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/256?text=No+Image";
                              }}
                            />
                          </td>

                          <td className="p-3 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => startEdit(p)}
                                className="px-3 py-1.5 rounded-xl border dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => askDelete(p)}
                                className="px-3 py-1.5 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* ✅ Confirm delete inline (sin confirm()) */}
        {confirmDelete && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm">
              ¿Seguro que quieres eliminar{" "}
              <span className="font-semibold">{confirmDelete.nombre}</span>?
              Esta acción no se puede deshacer.
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
      </section>

      {/* FORM */}
      <aside className="rounded-2xl border p-4 bg-white dark:bg-zinc-900 dark:border-zinc-800 h-fit">
        <h2 className="font-bold text-lg">
          {editingId ? "Editar producto" : "Crear producto"}
        </h2>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            className="w-full px-3 py-2 rounded-xl border dark:border-zinc-800 bg-transparent"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <textarea
            className="w-full px-3 py-2 rounded-xl border dark:border-zinc-800 bg-transparent min-h-24"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <input
            className="w-full px-3 py-2 rounded-xl border dark:border-zinc-800 bg-transparent"
            placeholder="Precio"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
          />

          <input
            className="w-full px-3 py-2 rounded-xl border dark:border-zinc-800 bg-transparent"
            placeholder="URL Imagen"
            value={form.imagen}
            onChange={(e) => setForm({ ...form, imagen: e.target.value })}
          />

          <button className="w-full px-4 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold">
            {editingId ? "Guardar cambios" : "Crear"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="w-full px-4 py-3 rounded-2xl border dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-950"
            >
              Cancelar
            </button>
          )}
        </form>

        {/* Preview */}
        {form.imagen?.trim() && (
          <div className="mt-4">
            <p className="text-xs opacity-70 mb-2">Preview</p>
            <img
              src={form.imagen}
              alt="preview"
              className="w-full h-40 rounded-2xl object-cover border dark:border-zinc-800"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
              }}
            />
          </div>
        )}
      </aside>
    </div>
  );
}
