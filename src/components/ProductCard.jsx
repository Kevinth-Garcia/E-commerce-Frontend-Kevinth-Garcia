import { Link } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { toast } from "react-toastify";

export default function ProductCard({ p }) {
  const addItem = useCartStore((s) => s.addItem);

  const cartProduct = {
    id: p.id,
    title: p.nombre,
    price: p.precio,
    image: p.imagen,
  };

  const onAdd = () => {
    addItem(cartProduct);
    toast.success("Producto agregado al carrito 🛒");
  };

  return (
    <div
      className="
        group
        rounded-2xl border overflow-hidden
        bg-white dark:bg-zinc-900 dark:border-zinc-800
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      <Link to={`/product/${p.id}`} className="block overflow-hidden">
        <img
          src={p.imagen}
          alt={p.nombre}
          className="
            w-full h-44 object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
        />
      </Link>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold line-clamp-1">{p.nombre}</h3>

        <p className="text-sm opacity-80 line-clamp-2">{p.descripcion}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="font-bold">${p.precio}</span>

          <button
            onClick={onAdd}
            className="
              px-3 py-2 rounded-xl text-sm font-semibold
              bg-black text-white
              dark:bg-white dark:text-black
              transition-all duration-150
              hover:scale-105
              active:scale-95
              active:opacity-80
            "
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
