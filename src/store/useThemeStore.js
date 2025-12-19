// src/store/useThemeStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//theme light y dark configurado para no quemarle la vista a los usuarios

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light", // "light" | "dark"

      setTheme: (t) => {
        set({ theme: t });
        const root = document.documentElement; // <html>
        if (t === "dark") root.classList.add("dark");
        else root.classList.remove("dark");
      },

      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        get().setTheme(next);
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
