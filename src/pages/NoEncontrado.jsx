import { Link } from "react-router-dom";

//pagina de error 404 ruta no encontrada

export default function NonContent() {
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl font-extrabold">404</h1>
      <p className="mt-2 opacity-80">
        Epa aca no debiste venir vuelve a la pagina principal por favor
      </p>
      <Link
        to="/"
        className="inline-block mt-5 px-4 py-2 rounded-xl bg-black text-white"
      >
        Volver al Home
      </Link>
    </div>
  );
}
