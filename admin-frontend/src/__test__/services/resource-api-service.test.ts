import { describe, it, expect, vi, beforeEach } from "vitest";

import { api } from "@/lib/axios-client";
import type { createOrUpdateSchemaType } from "@/features/resources/schemas/create-or-update-schema";
import type { resourceObjectType } from "@/features/resources/schemas/ressource-schema";
import { PUBLICATION_RESOURCE_KEY } from "@/types/resource-type";
import { createResourceApi } from "@/features/resources/api/create-resource-api";
import { updateResourceById } from "@/features/resources/api/update-resource-by-id-api";
import { deleteResourceById } from "@/features/resources/api/delete-resource-by-id-api";
import type { deleteResourceType } from "@/features/resources/schemas/delete-resource-schema";
import { getResourceById } from "@/features/resources/api/get-resource-by-id-api";
import { getResourcesApi } from "@/features/resources/api/get-resources-api";

const mockResource: resourceObjectType = {
  id: "res-123",
  title: "Titre Test",
  resume: "Résumé",
  content: "Contenu suffisant pour le test",
  isVisible: true,
  publicationStatus: PUBLICATION_RESOURCE_KEY.APPROUVED,
  updatedAt: null,
  publishedAt: "2024-03-20T10:00:00Z",
  createdAt: "2024-03-20T10:00:00Z",
  mediaType: null,
  mediaUrl: null,
  viewCount: 10,
  likeCount: 5,
  liked: true,
  user: { id: "u1", username: "user1" },
  category: { id: "c1", categoryName: "Cat1" },
  typeResource: { id: "tr1", typeRessource: "Type1" },
  typeRelation: { id: "trel1", typeRelation: "Rel1" },
};

vi.mock("@/lib/axios-client", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Tests des services de Ressources ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("doit créer une ressource ", async () => {
    const mockParams: createOrUpdateSchemaType = {
      title: "Ma Ressource",
      resume: "Résumé test",
      content: "Contenu de plus de dix caractères",
      categoryId: "cat-1",
      resourceTypeId: "550e8400-e29b-41d4-a716-446655440000",
      relationTypeId: "550e8400-e29b-41d4-a716-446655440000",
      mediaType: "image",
      isVisible: true,
      publicationStatus: PUBLICATION_RESOURCE_KEY.APPROUVED,
    };

    const mockApiResponse: resourceObjectType = {
      id: "res-123",
      ...mockParams,
      updatedAt: null,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      mediaUrl: "https://photo.jpg",
      viewCount: 0,
      likeCount: 0,
      liked: false,
      user: { id: "u1", username: "admin" },
      category: { id: "cat-1", categoryName: "Sport" },
      typeResource: { id: "tr1", typeRessource: "Lien" },
      typeRelation: { id: "trel1", typeRelation: "Ami" },
    };

    vi.mocked(api.post).mockResolvedValue({ data: mockApiResponse });

    const result = await createResourceApi(mockParams);

    expect(result.id).toBe("res-123");
    expect(result.title).toBe("Ma Ressource");
  });

  it("doit mettre à jour le statut", async () => {
    const resourceToUpdate: Partial<resourceObjectType> = {
      id: "res-123",
      isVisible: false,
      publicationStatus: PUBLICATION_RESOURCE_KEY.PENDING,
    };

    vi.mocked(api.put).mockResolvedValue({ data: {} });

    await updateResourceById(resourceToUpdate as resourceObjectType);

    expect(api.put).toHaveBeenCalledWith("/resource/res-123/status", {
      isVisible: false,
      publicationStatus: PUBLICATION_RESOURCE_KEY.PENDING,
    });
  });
});

describe("Tests de suppression de ressource", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("doit appeler la route de suppression avec l'ID de ressource correct", async () => {
    const mockDeleteData: deleteResourceType = {
      resourceId: "789-abc-123",
      confirm: "Confirmer",
    };

    vi.mocked(api.delete).mockResolvedValue({ status: 204 });

    await deleteResourceById(mockDeleteData);

    expect(api.delete).toHaveBeenCalledWith("/resource/789-abc-123");
    expect(api.delete).toHaveBeenCalledTimes(1);
  });

  it("doit propager l'erreur si l'appel API échoue", async () => {
    const mockDeleteData: deleteResourceType = {
      resourceId: "fail-id",
      confirm: "Confirmer",
    };

    vi.mocked(api.delete).mockRejectedValue(new Error("Internal Server Error"));

    await expect(deleteResourceById(mockDeleteData)).rejects.toThrow(
      "Internal Server Error",
    );
  });
});

describe("getResourceById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and validate a single resource", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: mockResource });

    const result = await getResourceById("res-123");

    expect(api.get).toHaveBeenCalledWith("/resource/res-123");
    expect(result).toEqual(mockResource);
  });

  it("should throw an error when data is invalid", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: { invalid: "data" } });

    await expect(getResourceById("res-123")).rejects.toThrow();
  });
});

describe("getResourcesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all resources and validate them", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [mockResource] });

    const result = await getResourcesApi();

    expect(api.get).toHaveBeenCalledWith("/resource?includeAll=true");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("res-123");
  });

  it("should filter out invalid items and keep only valid ones", async () => {
    const mixedData = [
      mockResource,
      { id: "2", title: "Invalid item missing fields" },
    ];

    vi.mocked(api.get).mockResolvedValue({ data: mixedData });

    const result = await getResourcesApi();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("res-123");
  });

  it("should return an empty array if api returns no data", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    const result = await getResourcesApi();

    expect(result).toEqual([]);
  });
});
