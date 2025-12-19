import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { useThemeStore } from "./store/useThemeStore";

function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    // Tailwind dark mode por clase
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeSync />
  </React.StrictMode>
);
