import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { api } from "@/lib/axios-client";
import {
  getFavoritesApi,
  getBookmarksApi,
  getUserResourcesApi,
  toggleFavoriteApi,
  toggleBookmarkApi,
  addToViewHistory,
  getViewHistory,
} from "@/features/resources/api/profile-api";
import type { ResourceReturn } from "@/features/resources/api/resources-api";

vi.mock("@/lib/cookie", () => ({
  setAuthCookie: vi.fn(),
  getAuthToken: vi.fn(),
}));

const mockResource: ResourceReturn = {
  id: "res-1",
  title: "Resource 1",
  resume: "Resume",
  content: "Content",
  mediaUrl: "",
  mediaType: "",
  isVisible: true,
  publicationStatus: "Approved",
  updatedAt: null,
  publishedAt: "2026-01-01T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
  viewCount: 0,
  likeCount: 0,
  liked: false,
  user: { id: "u1", username: "user1" },
  category: { id: "c1", categoryName: "Cat1" },
  typeResource: { id: "tr1", typeRessource: "Type1" },
  typeRelation: { id: "trel1", typeRelation: "Rel1" },
  comments: [],
};

describe("profile api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("getFavoritesApi", () => {
    it("doit récupérer les favoris", async () => {
      mock.onGet("/Progression/favorites").reply(200, [mockResource]);

      const result = await getFavoritesApi();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("res-1");
    });

    it("doit retourner un tableau vide", async () => {
      mock.onGet("/Progression/favorites").reply(200, []);

      const result = await getFavoritesApi();

      expect(result).toHaveLength(0);
    });

    it("doit retourner une erreur", async () => {
      mock.onGet("/Progression/favorites").reply(500);

      await expect(getFavoritesApi()).rejects.toThrow();
    });
  });

  describe("getBookmarksApi", () => {
    it("doit récupérer les signets", async () => {
      mock.onGet("/Progression/bookmarks").reply(200, [mockResource]);

      const result = await getBookmarksApi();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("res-1");
    });

    it("doit retourner une erreur", async () => {
      mock.onGet("/Progression/bookmarks").reply(500);

      await expect(getBookmarksApi()).rejects.toThrow();
    });
  });

  describe("getUserResourcesApi", () => {
    it("doit récupérer les ressources d'un utilisateur", async () => {
      mock.onGet("/Resource/UserResources/u1").reply(200, [mockResource]);

      const result = await getUserResourcesApi("u1");

      expect(result).toHaveLength(1);
      expect(result[0].user.id).toBe("u1");
    });

    it("doit retourner une erreur si l'utilisateur n'existe pas", async () => {
      mock.onGet("/Resource/UserResources/invalid").reply(404);

      await expect(getUserResourcesApi("invalid")).rejects.toThrow();
    });
  });

  describe("toggleFavoriteApi", () => {
    it("doit toggler le favori", async () => {
      mock.onPost("/Progression/favorite/res-1").reply(200);

      await expect(toggleFavoriteApi("res-1")).resolves.toBeUndefined();
    });

    it("doit retourner une erreur", async () => {
      mock.onPost("/Progression/favorite/res-1").reply(500);

      await expect(toggleFavoriteApi("res-1")).rejects.toThrow();
    });
  });

  describe("toggleBookmarkApi", () => {
    it("doit toggler le signet", async () => {
      mock.onPost("/Progression/bookmark/res-1").reply(200);

      await expect(toggleBookmarkApi("res-1")).resolves.toBeUndefined();
    });

    it("doit retourner une erreur", async () => {
      mock.onPost("/Progression/bookmark/res-1").reply(500);

      await expect(toggleBookmarkApi("res-1")).rejects.toThrow();
    });
  });

  describe("addToViewHistory", () => {
    it("doit ajouter une ressource à l'historique", () => {
      addToViewHistory(mockResource);

      const history = getViewHistory();
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe("res-1");
    });

    it("doit ajouter en début de liste", () => {
      const resource2 = { ...mockResource, id: "res-2", title: "Resource 2" };

      addToViewHistory(mockResource);
      addToViewHistory(resource2);

      const history = getViewHistory();
      expect(history[0].id).toBe("res-2");
      expect(history[1].id).toBe("res-1");
    });

    it("ne doit pas dupliquer une ressource existante", () => {
      addToViewHistory(mockResource);
      addToViewHistory(mockResource);

      const history = getViewHistory();
      expect(history).toHaveLength(1);
    });

    it("doit limiter l'historique à 4 éléments", () => {
      for (let i = 1; i <= 6; i++) {
        addToViewHistory({ ...mockResource, id: `res-${i}` });
      }

      const history = getViewHistory();
      expect(history).toHaveLength(4);
      expect(history[0].id).toBe("res-6");
    });

    it("doit remonter une ressource déjà vue en début de liste", () => {
      const resource1 = { ...mockResource, id: "res-1" };
      const resource2 = { ...mockResource, id: "res-2" };
      const resource3 = { ...mockResource, id: "res-3" };

      addToViewHistory(resource1);
      addToViewHistory(resource2);
      addToViewHistory(resource3);
      addToViewHistory(resource1);

      const history = getViewHistory();
      expect(history[0].id).toBe("res-1");
      expect(history[1].id).toBe("res-3");
      expect(history[2].id).toBe("res-2");
    });
  });

  describe("getViewHistory", () => {
    it("doit retourner un tableau vide si aucun historique", () => {
      const history = getViewHistory();
      expect(history).toEqual([]);
    });

    it("doit retourner l'historique stocké", () => {
      localStorage.setItem(
        "resource_view_history",
        JSON.stringify([mockResource])
      );

      const history = getViewHistory();
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe("res-1");
    });
  });
});
