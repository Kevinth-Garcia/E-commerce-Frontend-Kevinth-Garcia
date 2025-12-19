import ProductCard from "./ProductCard";

// lista de productos

export default function ProductList({ products = [] }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border p-6 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <p className="opacity-80">No hay productos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
