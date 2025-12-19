import { Link } from "react-router-dom";

//panel de admin para ver Ordenes, Usuarios, Productos

export default function AdminDashboard() {
  const Card = ({ title, desc, to }) => (
    <Link
      to={to}
      className="rounded-2xl border p-5 bg-white dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-sm transition"
    >
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="mt-1 text-sm opacity-80">{desc}</p>
      <p className="mt-4 text-sm underline">Entrar</p>
    </Link>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Admin Panel</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Productos" desc="CRUD de productos" to="/admin/products" />
        <Card
          title="Usuarios"
          desc="Ver usuarios / permisos"
          to="/admin/users"
        />
        <Card
          title="Órdenes"
          desc="Ver historial de órdenes"
          to="/admin/orders"
        />
      </div>
    </div>
  );
}
