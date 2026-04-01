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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Une erreur est survenue";

    return Promise.reject(new Error(message));
  },
);
