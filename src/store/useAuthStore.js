import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../services/api";

//api que verifica al usuario utilizando los datos del backend

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async ({ email, password }) => {
        const res = await api.post("/auth/login", { email, password });

        const token = res.data?.data?.token;
        const user = res.data?.data?.user;

        if (!token || !user) throw new Error("Respuesta inválida del servidor");

        set({ token, user, isAuthenticated: true });
        return res.data;
      },

      register: async ({ nombre, apellido, email, password }) => {
        const res = await api.post("/auth/register", {
          nombre,
          apellido,
          email,
          password,
        });
        return res.data;
      },

      me: async () => {
        const token = get().token;
        if (!token) return null;

        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data?.data?.user;
        if (user) set({ user, isAuthenticated: true });
        return user;
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),

      // ✅ cuando se rehidrata desde sessionStorage, setea isAuthenticated
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.isAuthenticated = Boolean(state.token);
      },
    }
  )
);
