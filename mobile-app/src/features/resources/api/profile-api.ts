import { api } from "@/lib/axios-client";
import type { ResourceReturn } from "./resources-api";

export const getFavoritesApi = async (): Promise<ResourceReturn[]> => {
  const { data } = await api.get("/Progression/favorites");
  return data;
};

export const getBookmarksApi = async (): Promise<ResourceReturn[]> => {
  const { data } = await api.get("/Progression/bookmarks");
  return data;
};

export const getUserResourcesApi = async (userId: string): Promise<ResourceReturn[]> => {
  const { data } = await api.get(`/Resource/UserResources/${userId}`);
  return data;
};

export const toggleFavoriteApi = async (resourceId: string): Promise<void> => {
  await api.post(`/Progression/favorite/${resourceId}`);
};

export const toggleBookmarkApi = async (resourceId: string): Promise<void> => {
  await api.post(`/Progression/bookmark/${resourceId}`);
};

// Historique local (localStorage)
const HISTORY_KEY = "resource_view_history";
const MAX_HISTORY = 4;

export const addToViewHistory = (resource: ResourceReturn) => {
  const history: ResourceReturn[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  const filtered = history.filter((r) => r.id !== resource.id);
  filtered.unshift(resource);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, MAX_HISTORY)));
};

export const getViewHistory = (): ResourceReturn[] => {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
};