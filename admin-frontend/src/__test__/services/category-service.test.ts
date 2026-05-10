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

describe("Category APIs", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  describe("createCategoryApi", () => {
    it("should create a category successfully", async () => {
      mock.onPost("/category").reply(201);

      await expect(
        createCategoryApi({
          categoryName: "Tech",
        }),
      ).resolves.toBeUndefined();
    });

    it("should throw on create error", async () => {
      mock.onPost("/category").reply(500);

      await expect(
        createCategoryApi({
          categoryName: "Tech",
        }),
      ).rejects.toThrow();
    });
  });

  describe("deleteCategoryApi", () => {
    it("should delete a category successfully", async () => {
      mock.onDelete("/category/1").reply(204);

      await expect(deleteCategoryApi("1")).resolves.toBeUndefined();
    });

    it("should throw on delete error", async () => {
      mock.onDelete("/category/1").reply(404);

      await expect(deleteCategoryApi("1")).rejects.toThrow();
    });
  });

  describe("getCategoriesApi", () => {
    it("should return validated categories", async () => {
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

    it("should throw if schema validation fails", async () => {
      const invalidResponse = [
        {
          id: "1",
        },
      ];

      mock.onGet("/category").reply(200, invalidResponse);

      await expect(getCategoriesApi()).rejects.toThrow();
    });

    it("should throw on api error", async () => {
      mock.onGet("/category").reply(500);

      await expect(getCategoriesApi()).rejects.toThrow();
    });
  });

  describe("updateCategoryApi", () => {
    it("should update a category successfully", async () => {
      mock.onPut("/category?id=1").reply(200);

      await expect(
        updateCategoryApi({
          id: "1",
          categoryName: "Updated Tech",
        }),
      ).resolves.toBeUndefined();
    });

    it("should throw on update error", async () => {
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
