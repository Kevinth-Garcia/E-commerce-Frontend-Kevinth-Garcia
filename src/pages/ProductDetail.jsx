import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useCartStore } from "../store/useCartStore";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data?.data || res.data);
      } catch {
        toast.error("Producto no encontrado");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!product) return null;

  const cartProduct = {
    id: product._id || product.id,
    title: product.nombre,
    price: product.precio,
    image: product.imagen,
  };

  const addToCart = () => {
    for (let i = 0; i < qty; i++) addItem(cartProduct);
    toast.success("Producto agregado al carrito 🛒");
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* IMAGEN */}
      <div className="rounded-2xl border dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-[350px] object-contain"
        />
      </div>

      {/* INFO */}
      <div className="space-y-5">
        <h1 className="text-3xl font-extrabold">{product.nombre}</h1>

        <p className="text-2xl font-bold text-emerald-600">${product.precio}</p>

        {/* DESCRIPCIÓN MÁS GRANDE */}
        <p className="text-base md:text-lg leading-relaxed opacity-90">
          {product.descripcion}
        </p>

        {/* CANTIDAD */}
        <div className="flex items-center gap-3">
          <span className="font-semibold">Cantidad:</span>

          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-1 rounded-lg border dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
          >
            −
          </button>

          <span className="min-w-8 text-center font-semibold">{qty}</span>

          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-1 rounded-lg border dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
          >
            +
          </button>
        </div>

        {/* BOTÓN AGREGAR AL CARRITO (REACTIVO AL TEMA) */}
        <button
          onClick={addToCart}
          className="
            w-full md:w-auto px-6 py-3 rounded-2xl font-semibold
            bg-black text-white
            hover:opacity-90
            dark:bg-white dark:text-black
          "
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
