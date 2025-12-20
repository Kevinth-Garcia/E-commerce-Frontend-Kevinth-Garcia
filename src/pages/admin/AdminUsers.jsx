import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

//pestaña de gestion de usuarios Admin donde se pueden eliminar usuarios o dar derechos de Admin

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // user object

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/userRoutes"); // ruta
      setUsers(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleAdmin = async (u) => {
    try {
      const next = !u.isAdmin;

      const res = await api.put(`/users/${u._id}`, { isAdmin: next }); // PUT
      const updated = res.data?.data;

      setUsers((prev) => prev.map((x) => (x._id === u._id ? updated : x)));

      toast.success(`Permiso admin: ${next ? "ACTIVADO" : "DESACTIVADO"}`);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error actualizando usuario");
    }
  };

  const askDelete = (u) => setConfirmDelete(u);
  const cancelDelete = () => setConfirmDelete(null);

  const doDelete = async () => {
    if (!confirmDelete) return;

    try {
      await api.delete(`/userRoutes/${confirmDelete._id}`); // DELETE
      setUsers((prev) => prev.filter((x) => x._id !== confirmDelete._id));
      toast.success("Usuario eliminado ✅");
      setConfirmDelete(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Error eliminando usuario");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Admin · Usuarios</h1>
      </div>

      <div className="rounded-2xl border dark:border-zinc-800 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold bg-gray-50 dark:bg-zinc-900">
          <div className="col-span-5">Usuario</div>
          <div className="col-span-3">Verificado</div>
          <div className="col-span-4 text-right">Acciones</div>
        </div>

        {loading ? (
          <div className="p-4 opacity-80">Cargando...</div>
        ) : users.length ? (
          users.map((u) => (
            <div
              key={u._id}
              className="grid grid-cols-12 gap-2 px-4 py-3 border-t dark:border-zinc-800 bg-white dark:bg-zinc-950"
            >
              <div className="col-span-5">
                <p className="font-semibold line-clamp-1">
                  {u.nombre} {u.apellido}
                </p>
                <p className="text-xs opacity-70 line-clamp-1">{u.email}</p>
                {u.isAdmin && (
                  <span className="inline-flex mt-2 rounded-full px-3 py-1 text-xs border border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200">
                    Admin
                  </span>
                )}
              </div>

              <div className="col-span-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs border ${
                    u.isEmailVerified
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
                      : "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
                  }`}
                >
                  {u.isEmailVerified ? "Sí" : "No"}
                </span>
              </div>

              <div className="col-span-4 flex justify-end gap-2">
                <button
                  onClick={() => toggleAdmin(u)}
                  className={`px-3 py-1.5 rounded-xl border transition ${
                    u.isAdmin
                      ? "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      : "border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  }`}
                >
                  {u.isAdmin ? "Quitar Admin" : "Hacer Admin"}
                </button>

                <button
                  onClick={() => askDelete(u)}
                  className="px-3 py-1.5 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 opacity-80">No hay usuarios.</div>
        )}
      </div>

      {/* Confirmación de eliminar (dentro de la página, no alert) */}
      {confirmDelete && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm">
            ¿Seguro que quieres eliminar a{" "}
            <span className="font-semibold">
              {confirmDelete.nombre} {confirmDelete.apellido}
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
