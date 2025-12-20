import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

//pestaña de productos Admin para agregar,editar y eliminar

const emptyForm = { nombre: "", descripcion: "", precio: "", imagen: "" };

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) =>
      `${p.nombre} ${p.descripcion}`.toLowerCase().includes(s)
    );
  }, [items, q]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setItems(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio: String(p.precio ?? ""),
      imagen: p.imagen || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) return toast.error("Nombre requerido");
    if (!form.descripcion.trim()) return toast.error("Descripción requerida");
    const precioNum = Number(form.precio);
    if (Number.isNaN(precioNum) || precioNum < 0)
      return toast.error("Precio inválido");
    if (!form.imagen.trim()) return toast.error("Imagen requerida (URL)");

    try {
      if (editingId) {
        await api.put(`/productRoutes/${editingId}`, {
          ...form,
          precio: precioNum,
        });
        toast.success("Producto actualizado ✅");
      } else {
        await api.post("/productRoutes", { ...form, precio: precioNum });
        toast.success("Producto creado ✅");
      }
      cancelEdit();
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error guardando producto");
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await api.delete(`/productRoutes/${id}`);
      toast.success("Producto eliminado ✅");
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error eliminando producto");
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">Admin · Productos</h1>
          <input
            className="w-56 px-3 py-2 rounded-xl border dark:border-zinc-800 bg-transparent"
            placeholder="Buscar..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="rounded-2xl border dark:border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold bg-gray-50 dark:bg-zinc-900">
            <div className="col-span-5">Producto</div>
            <div className="col-span-3">Precio</div>
            <div className="col-span-4 text-right">Acciones</div>
          </div>

          {loading ? (
            <div className="p-4 opacity-80">Cargando...</div>
          ) : filtered.length ? (
            filtered.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-12 gap-2 px-4 py-3 border-t dark:border-zinc-800 bg-white dark:bg-zinc-950"
              >
                <div className="col-span-5">
                  <p className="font-semibold line-clamp-1">{p.nombre}</p>
                  <p className="text-xs opacity-70 line-clamp-1">
                    {p.descripcion}
                  </p>
                </div>
                <div className="col-span-3 font-bold">${p.precio}</div>
                <div className="col-span-4 flex justify-end gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="px-3 py-1.5 rounded-xl border dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="px-3 py-1.5 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 opacity-80">No hay productos.</div>
          )}
        </div>
      </section>

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
      </aside>
    </div>
  );
}
