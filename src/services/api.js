import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

//api que se conecta con el backend utilizando la env del frontend

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3001/api
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
