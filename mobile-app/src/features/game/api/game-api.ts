import { api } from "@/lib/axios-client";

export type PlayerInfo = {
  id: string;
  name: string;
  isGuest: boolean;
};

export type ChatMessage = {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  sentAt: string;
};

export type GameSession = {
  id: string;
  resourceId: string | null;
  gameType: string;
  board: string[];
  currentTurn: string;
  winner: string | null;
  isDraw: boolean;
  playerX: PlayerInfo | null;
  playerO: PlayerInfo | null;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

export const createGameApi = async (resourceId?: string): Promise<{ session: GameSession; playerId: string }> => {
  const { data } = await api.post("/Game", { resourceId });
  return data;
};

export const getGameApi = async (id: string): Promise<GameSession> => {
  const { data } = await api.get(`/Game/${id}`);
  return data;
};

export const joinGameApi = async (
  id: string,
  name?: string,
  guestId?: string
): Promise<{ session: GameSession; playerId: string }> => {
  const { data } = await api.post(`/Game/${id}/join`, { name, guestId });
  return data;
};

export const moveGameApi = async (
  id: string,
  position: number,
  guestId?: string
): Promise<GameSession> => {
  const { data } = await api.post(`/Game/${id}/move`, { position, guestId });
  return data;
};

export const resetGameApi = async (id: string): Promise<GameSession> => {
  const { data } = await api.post(`/Game/${id}/reset`);
  return data;
};

export const sendChatApi = async (
  id: string,
  content: string,
  guestId?: string
): Promise<ChatMessage> => {
  const { data } = await api.post(`/Game/${id}/chat`, { content, guestId });
  return data;
};