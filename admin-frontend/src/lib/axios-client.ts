import axios from "axios";
import { getAuthToken } from "./cookie";

export const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_ROUTE,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
