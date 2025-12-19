import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { toast } from "react-toastify";
import { useState } from "react";

//funcion completa del carro con capacidad de eliminar, agregar , y eleminar todo los articulos

export default function Cart() {
  const nav = useNavigate();
  const items = useCartStore((s) => s.items);
  const inc = useCartStore((s) => s.inc);
  const dec = useCartStore((s) => s.dec);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total);
  const clear = useCartStore((s) => s.clear);
  const [confirmClear, setConfirmClear] = useState(false);

  const askClear = () => setConfirmClear(true);

  const cancelClear = () => setConfirmClear(false);

  const doClear = () => {
    clear();
    setConfirmClear(false);
    toast.success("Carrito vaciado");
  };

  if (!items.length) {
    return (
      <div className="rounded-2xl border p-6 dark:border-zinc-800">
        <h1 className="text-2xl font-bold">Carrito</h1>
        <p className="mt-2 opacity-80">Tu carrito está vacío.</p>
        <Link
          className="inline-block mt-4 px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
          to="/products"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  //Mapeo de items en el carro, junto con boton de eliminar todo que te preguntara si quieres eliminar todo los productos del carro
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <h1 className="text-2xl font-bold">Carrito</h1>

        {items.map((i) => (
          <div
            key={i.id}
            className="flex gap-4 rounded-2xl border p-4 dark:border-zinc-800 bg-white dark:bg-zinc-900"
          >
            <img
              src={i.image}
              alt={i.title}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold">{i.title}</p>
              <p className="text-sm opacity-80">${i.price} c/u</p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded-lg border dark:border-zinc-700 transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
                  onClick={() => dec(i.id)}
                >
                  -
                </button>
                <span className="min-w-8 text-center">{i.qty}</span>
                <button
                  className="px-3 py-1 rounded-lg border dark:border-zinc-700 transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
                  onClick={() => inc(i.id)}
                >
                  +
                </button>

                <button
                  className="ml-auto text-sm text-red-600 hover:underline "
                  onClick={() => removeItem(i.id)}
                >
                  Quitar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="rounded-2xl border p-4 h-fit dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h2 className="text-lg font-bold">Resumen</h2>
        <div className="mt-3 flex justify-between">
          <span>Total</span>
          <span className="font-bold">${total()}</span>
        </div>
        <button
          onClick={askClear}
          className="mt-3 w-full px-4 py-3 rounded-2xl border border-red-600 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
        >
          Vaciar carrito
        </button>

        {confirmClear && (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm">
              ¿Seguro que quieres vaciar el carrito?{" "}
              <span className="font-semibold">
                Esta acción no se puede deshacer.
              </span>
            </p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={cancelClear}
                className="flex-1 px-4 py-2 rounded-xl border dark:border-zinc-700 hover:bg-white/60 dark:hover:bg-zinc-900 transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
              >
                Cancelar
              </button>

              <button
                onClick={doClear}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:opacity-90 transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
              >
                Sí, vaciar
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => nav("/checkout")}
          className="mt-4 w-full px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold transition-all duration-150 hover:scale-105 active:scale-95 active:opacity-80"
        >
          Ir a Checkout
        </button>
      </aside>
    </div>
  );
}
