import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/productRoutes");
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        // destacados: primeros 4
        setFeatured(list.slice(0, 4));
      } catch (e) {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-10">
      {/* HERO centrado */}
      <section className="rounded-3xl border dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 items-center p-8 md:p-12">
          {/* TEXTO */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Friki Mundo
            </h1>

            <p className="mt-3 max-w-xl text-sm md:text-base opacity-80">
              ¡Bienvenido a Friki Mundo! Descubre colecciones únicas y ofertas
              exclusivas de videojuegos, anime, PC gaming y mucho más.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
              >
                Ver Catálogo
              </Link>

              <Link
                to="/cart"
                className="px-4 py-2 rounded-xl border dark:border-zinc-700 font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
              >
                Ir al Carrito
              </Link>
            </div>
          </div>

          {/* IMAGEN */}
          <div className="hidden md:flex justify-center">
            <img
              src="src\static\Coolmeme.png"
              alt="Friki Mundo destacados"
              className="w-72 mx-auto animate-float drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">Productos destacados</h2>
            <p className="text-sm opacity-80">
              Una selección para que no empieces con la tienda vacía.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-semibold underline underline-offset-4 opacity-80 hover:opacity-100"
          >
            Ver todo
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border dark:border-zinc-800 p-6 opacity-80">
            Cargando destacados...
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-2xl border dark:border-zinc-800 p-6 opacity-80">
            No hay productos para mostrar.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
