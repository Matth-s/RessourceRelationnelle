import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { api } from "@/lib/axios-client";
import {
  getResourcesApi,
  getResourceByIdApi,
  getCategoriesApi,
  getTypeRelationsApi,
  getTypeResourcesApi,
  createResourceApi,
  updateResourceApi,
  type ResourceReturn,
  type Category,
  type TypeRelation,
  type TypeResource,
} from "@/features/resources/api/resources-api";

vi.mock("@/lib/cookie", () => ({
  setAuthCookie: vi.fn(),
  getAuthToken: vi.fn(),
}));

const mockResource: ResourceReturn = {
  id: "res-123",
  title: "Test Resource",
  resume: "A short resume",
  content: "Full content of the resource",
  mediaUrl: "https://example.com/media.jpg",
  mediaType: "image",
  isVisible: true,
  publicationStatus: "Approved",
  updatedAt: null,
  publishedAt: "2026-01-01T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
  viewCount: 10,
  likeCount: 5,
  liked: false,
  user: { id: "u1", username: "author" },
  category: { id: "c1", categoryName: "Technology" },
  typeResource: { id: "tr1", typeRessource: "Article" },
  typeRelation: { id: "trel1", typeRelation: "Ami" },
  comments: [],
};

describe("resources api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    vi.clearAllMocks();
  });

  describe("getResourcesApi", () => {
    it("doit récupérer la liste des ressources", async () => {
      const mockResources = [mockResource, { ...mockResource, id: "res-456", title: "Second" }];
      mock.onGet("/Resource").reply(200, mockResources);

      const result = await getResourcesApi();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("res-123");
      expect(result[1].title).toBe("Second");
    });

    it("doit retourner un tableau vide", async () => {
      mock.onGet("/Resource").reply(200, []);

      const result = await getResourcesApi();

      expect(result).toHaveLength(0);
    });

    it("doit retourner une erreur serveur", async () => {
      mock.onGet("/Resource").reply(500);

      await expect(getResourcesApi()).rejects.toThrow();
    });
  });

  describe("getResourceByIdApi", () => {
    it("doit récupérer une ressource par id", async () => {
      mock.onGet("/Resource/res-123").reply(200, mockResource);

      const result = await getResourceByIdApi("res-123");

      expect(result.id).toBe("res-123");
      expect(result.title).toBe("Test Resource");
      expect(result.user.username).toBe("author");
    });

    it("doit retourner une erreur si la ressource n'existe pas", async () => {
      mock.onGet("/Resource/invalid").reply(404);

      await expect(getResourceByIdApi("invalid")).rejects.toThrow();
    });
  });

  describe("getCategoriesApi", () => {
    it("doit récupérer les catégories", async () => {
      const mockCategories: Category[] = [
        { id: "c1", categoryName: "Technology" },
        { id: "c2", categoryName: "Science" },
      ];
      mock.onGet("/Category").reply(200, mockCategories);

      const result = await getCategoriesApi();

      expect(result).toHaveLength(2);
      expect(result[0].categoryName).toBe("Technology");
    });

    it("doit retourner une erreur serveur", async () => {
      mock.onGet("/Category").reply(500);

      await expect(getCategoriesApi()).rejects.toThrow();
    });
  });

  describe("getTypeRelationsApi", () => {
    it("doit récupérer les types de relation", async () => {
      const mockTypes: TypeRelation[] = [
        { id: "tr1", typeRelation: "Ami" },
        { id: "tr2", typeRelation: "Famille" },
      ];
      mock.onGet("/TypeRelation").reply(200, mockTypes);

      const result = await getTypeRelationsApi();

      expect(result).toHaveLength(2);
      expect(result[0].typeRelation).toBe("Ami");
    });

    it("doit retourner une erreur serveur", async () => {
      mock.onGet("/TypeRelation").reply(500);

      await expect(getTypeRelationsApi()).rejects.toThrow();
    });
  });

  describe("getTypeResourcesApi", () => {
    it("doit récupérer les types de ressource", async () => {
      const mockTypes: TypeResource[] = [
        { id: "t1", typeRessource: "Article" },
        { id: "t2", typeRessource: "Vidéo" },
      ];
      mock.onGet("/TypeResource").reply(200, mockTypes);

      const result = await getTypeResourcesApi();

      expect(result).toHaveLength(2);
      expect(result[0].typeRessource).toBe("Article");
    });

    it("doit retourner une erreur serveur", async () => {
      mock.onGet("/TypeResource").reply(500);

      await expect(getTypeResourcesApi()).rejects.toThrow();
    });
  });

  describe("createResourceApi", () => {
    it("doit créer une ressource", async () => {
      mock.onPost("/Resource").reply(201, mockResource);

      const formData = new FormData();
      formData.append("title", "Test Resource");

      const result = await createResourceApi(formData);

      expect(result.id).toBe("res-123");
      expect(result.title).toBe("Test Resource");
    });

    it("doit retourner une erreur de validation", async () => {
      mock.onPost("/Resource").reply(400);

      const formData = new FormData();
      await expect(createResourceApi(formData)).rejects.toThrow();
    });

    it("doit retourner une erreur serveur", async () => {
      mock.onPost("/Resource").reply(500);

      const formData = new FormData();
      await expect(createResourceApi(formData)).rejects.toThrow();
    });
  });

  describe("updateResourceApi", () => {
    it("doit mettre à jour une ressource", async () => {
      mock.onPut("/Resource").reply(200);

      await expect(
        updateResourceApi({
          id: "res-123",
          title: "Updated Title",
          resume: "Updated resume",
          content: "Updated content",
          categoryId: "c1",
          resourceTypeId: "tr1",
          relationTypeId: "trel1",
        })
      ).resolves.toBeUndefined();
    });

    it("doit retourner une erreur si la ressource n'existe pas", async () => {
      mock.onPut("/Resource").reply(404);

      await expect(
        updateResourceApi({
          id: "invalid",
          title: "Title",
          resume: "Resume",
          content: "Content",
          categoryId: "c1",
          resourceTypeId: "tr1",
          relationTypeId: "trel1",
        })
      ).rejects.toThrow();
    });

    it("doit envoyer les bonnes données", async () => {
      mock.onPut("/Resource").reply(200);

      await updateResourceApi({
        id: "res-123",
        title: "New Title",
        resume: "New resume",
        content: "New content",
        categoryId: "c2",
        resourceTypeId: "tr2",
        relationTypeId: "trel2",
      });

      const requestData = JSON.parse(mock.history.put[0].data);
      expect(requestData.id).toBe("res-123");
      expect(requestData.title).toBe("New Title");
      expect(requestData.categoryId).toBe("c2");
    });
  });
});
