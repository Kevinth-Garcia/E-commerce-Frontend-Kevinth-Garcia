import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

//pagina de catalogo de productos a mostrar
// cada que se agregue un nuevo producto aparecera al instante

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const res = await api.get("/productRoutes");
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setProducts(list);
      } catch (e) {
        setError(
          e?.response?.data?.message || e.message || "Error cargando productos"
        );
        setProducts([]);
      }
    };

    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Catálogo</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
