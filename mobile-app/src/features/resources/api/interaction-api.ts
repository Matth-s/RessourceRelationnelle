import { api } from "@/lib/axios-client";

export type Interaction = {
  isFavorite: boolean;
  bookMarked: boolean;
  isExploited: boolean;
  resourceId: string;
};

export const getInteractionApi = async (resourceId: string): Promise<Interaction | null> => {
  try {
    const { data } = await api.get(`/Interaction/${resourceId}`);
    return data;
  } catch {
    return null;
  }
};

export const toggleFavoriteApi = async (resourceId: string): Promise<void> => {
  await api.post(`/Interaction/favorite/${resourceId}`);
};

export const toggleBookmarkApi = async (resourceId: string): Promise<void> => {
  await api.post(`/Interaction/bookmark/${resourceId}`);
};

export const toggleExploitationApi = async (resourceId: string): Promise<void> => {
  await api.post(`/Interaction/exploitation/${resourceId}`);
};

export const markAsExploitedApi = async (resourceId: string): Promise<void> => {
  await api.post(`/Interaction/mark-exploited/${resourceId}`);
};
