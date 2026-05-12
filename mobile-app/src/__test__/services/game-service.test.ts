import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { api } from "@/lib/axios-client";
import {
  createGameApi,
  getGameApi,
  joinGameApi,
  moveGameApi,
  resetGameApi,
  sendChatApi,
  type GameSession,
} from "@/features/game/api/game-api";

vi.mock("@/lib/cookie", () => ({
  setAuthCookie: vi.fn(),
  getAuthToken: vi.fn(),
}));

const mockGameSession: GameSession = {
  id: "game-123",
  resourceId: "res-456",
  gameType: "tic-tac-toe",
  board: ["", "", "", "", "", "", "", "", ""],
  currentTurn: "player-1",
  winner: null,
  isDraw: false,
  playerX: { id: "player-1", name: "Alice", isGuest: false },
  playerO: null,
  messages: [],
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("game api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    vi.clearAllMocks();
  });

  describe("createGameApi", () => {
    it("doit créer une session de jeu", async () => {
      const mockResponse = { session: mockGameSession, playerId: "player-1" };
      mock.onPost("/Game").reply(200, mockResponse);

      const result = await createGameApi("res-456");

      expect(result.session.id).toBe("game-123");
      expect(result.playerId).toBe("player-1");
    });

    it("doit créer une session sans resourceId", async () => {
      const mockResponse = {
        session: { ...mockGameSession, resourceId: null },
        playerId: "player-1",
      };
      mock.onPost("/Game").reply(200, mockResponse);

      const result = await createGameApi();

      expect(result.session.resourceId).toBeNull();
    });

    it("doit retourner une erreur serveur", async () => {
      mock.onPost("/Game").reply(500);

      await expect(createGameApi()).rejects.toThrow();
    });
  });

  describe("getGameApi", () => {
    it("doit récupérer une session de jeu", async () => {
      mock.onGet("/Game/game-123").reply(200, mockGameSession);

      const result = await getGameApi("game-123");

      expect(result.id).toBe("game-123");
      expect(result.gameType).toBe("tic-tac-toe");
      expect(result.board).toHaveLength(9);
    });

    it("doit retourner une erreur si la session n'existe pas", async () => {
      mock.onGet("/Game/invalid-id").reply(404);

      await expect(getGameApi("invalid-id")).rejects.toThrow();
    });
  });

  describe("joinGameApi", () => {
    it("doit rejoindre une session de jeu", async () => {
      const mockResponse = {
        session: {
          ...mockGameSession,
          playerO: { id: "player-2", name: "Bob", isGuest: true },
        },
        playerId: "player-2",
      };
      mock.onPost("/Game/game-123/join").reply(200, mockResponse);

      const result = await joinGameApi("game-123", "Bob", "guest-id");

      expect(result.playerId).toBe("player-2");
      expect(result.session.playerO?.name).toBe("Bob");
    });

    it("doit rejoindre sans paramètres optionnels", async () => {
      const mockResponse = { session: mockGameSession, playerId: "player-2" };
      mock.onPost("/Game/game-123/join").reply(200, mockResponse);

      const result = await joinGameApi("game-123");

      expect(result.playerId).toBe("player-2");
    });

    it("doit retourner une erreur si la session est pleine", async () => {
      mock.onPost("/Game/game-123/join").reply(400);

      await expect(joinGameApi("game-123")).rejects.toThrow();
    });
  });

  describe("moveGameApi", () => {
    it("doit effectuer un mouvement", async () => {
      const updatedSession = {
        ...mockGameSession,
        board: ["X", "", "", "", "", "", "", "", ""],
        currentTurn: "player-2",
      };
      mock.onPost("/Game/game-123/move").reply(200, updatedSession);

      const result = await moveGameApi("game-123", 0);

      expect(result.board[0]).toBe("X");
      expect(result.currentTurn).toBe("player-2");
    });

    it("doit effectuer un mouvement avec guestId", async () => {
      const updatedSession = {
        ...mockGameSession,
        board: ["", "", "", "", "O", "", "", "", ""],
      };
      mock.onPost("/Game/game-123/move").reply(200, updatedSession);

      const result = await moveGameApi("game-123", 4, "guest-id");

      expect(result.board[4]).toBe("O");
    });

    it("doit retourner une erreur pour un mouvement invalide", async () => {
      mock.onPost("/Game/game-123/move").reply(400);

      await expect(moveGameApi("game-123", 0)).rejects.toThrow();
    });
  });

  describe("resetGameApi", () => {
    it("doit réinitialiser le jeu", async () => {
      const resetSession = {
        ...mockGameSession,
        board: ["", "", "", "", "", "", "", "", ""],
        winner: null,
        isDraw: false,
      };
      mock.onPost("/Game/game-123/reset").reply(200, resetSession);

      const result = await resetGameApi("game-123");

      expect(result.board.every((cell) => cell === "")).toBe(true);
      expect(result.winner).toBeNull();
      expect(result.isDraw).toBe(false);
    });

    it("doit retourner une erreur serveur", async () => {
      mock.onPost("/Game/game-123/reset").reply(500);

      await expect(resetGameApi("game-123")).rejects.toThrow();
    });
  });

  describe("sendChatApi", () => {
    it("doit envoyer un message de chat", async () => {
      const mockMessage = {
        id: "msg-1",
        playerId: "player-1",
        playerName: "Alice",
        content: "Hello!",
        sentAt: "2026-01-01T00:01:00Z",
      };
      mock.onPost("/Game/game-123/chat").reply(200, mockMessage);

      const result = await sendChatApi("game-123", "Hello!");

      expect(result.content).toBe("Hello!");
      expect(result.playerName).toBe("Alice");
    });

    it("doit envoyer un message avec guestId", async () => {
      const mockMessage = {
        id: "msg-2",
        playerId: "guest-1",
        playerName: "Guest",
        content: "Hi!",
        sentAt: "2026-01-01T00:02:00Z",
      };
      mock.onPost("/Game/game-123/chat").reply(200, mockMessage);

      const result = await sendChatApi("game-123", "Hi!", "guest-1");

      expect(result.content).toBe("Hi!");
    });

    it("doit retourner une erreur si le jeu n'existe pas", async () => {
      mock.onPost("/Game/invalid/chat").reply(404);

      await expect(sendChatApi("invalid", "test")).rejects.toThrow();
    });
  });
});
