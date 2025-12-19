export default function Footer() {
  //Footer de la pagina con estilado sencillo
  return (
    <footer className="border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm opacity-70">
        © {new Date().getFullYear()} Todo los Derechos Reservados || Friki Mundo
      </div>
    </footer>
  );
}
