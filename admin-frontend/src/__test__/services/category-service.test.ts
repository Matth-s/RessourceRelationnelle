import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { v4 as uuidv4 } from "uuid";
import { api } from "@/lib/axios-client";

import { createCategoryApi } from "@/features/categories/api/create-category-api";
import { deleteCategoryApi } from "@/features/categories/api/delete-category-api";
import { getCategoriesApi } from "@/features/categories/api/get-categories-api";
import { updateCategoryApi } from "@/features/categories/api/update-category-api";

vi.mock("@/lib/cookie", () => ({
  setAuthCookie: vi.fn(),
  getAuthToken: vi.fn(),
}));

describe("Category api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  describe("createCategoryApi", () => {
    it("doit créer une categorie", async () => {
      mock.onPost("/category").reply(201);

      await expect(
        createCategoryApi({
          categoryName: "Tech",
        }),
      ).resolves.toBeUndefined();
    });

    it("doit jeter une erreur", async () => {
      mock.onPost("/category").reply(500);

      await expect(
        createCategoryApi({
          categoryName: "Tech",
        }),
      ).rejects.toThrow();
    });
  });

  describe("deleteCategoryApi", () => {
    it("doit supprimer une categorie", async () => {
      mock.onDelete("/category/1").reply(204);

      await expect(deleteCategoryApi("1")).resolves.toBeUndefined();
    });

    it("doit jeter une erreur lors de la suppression d'une categorie", async () => {
      mock.onDelete("/category/1").reply(404);

      await expect(deleteCategoryApi("1")).rejects.toThrow();
    });
  });

  describe("getCategoriesApi", () => {
    it("doit retourner des categories valide", async () => {
      const mockResponse = [
        {
          id: uuidv4(),
          categoryName: "Tech",
        },
        {
          id: uuidv4(),
          categoryName: "Science",
        },
      ];

      mock.onGet("/category").reply(200, mockResponse);

      const result = await getCategoriesApi();

      expect(result).toEqual(mockResponse);
    });

    it("doit jeter une erreur si le schema n est pas valide", async () => {
      const invalidResponse = [
        {
          id: "1",
        },
      ];

      mock.onGet("/category").reply(200, invalidResponse);

      await expect(getCategoriesApi()).rejects.toThrow();
    });

    it("l api doit retourner une erreur", async () => {
      mock.onGet("/category").reply(500);

      await expect(getCategoriesApi()).rejects.toThrow();
    });
  });

  describe("updateCategoryApi", () => {
    it("doit update une categorie ", async () => {
      mock.onPut("/category?id=1").reply(200);

      await expect(
        updateCategoryApi({
          id: "1",
          categoryName: "Updated Tech",
        }),
      ).resolves.toBeUndefined();
    });

    it("doit echoue lors de l'update une categorie", async () => {
      mock.onPut("/category?id=1").reply(400);

      await expect(
        updateCategoryApi({
          id: "1",
          categoryName: "Updated Tech",
        }),
      ).rejects.toThrow();
    });
  });
});
