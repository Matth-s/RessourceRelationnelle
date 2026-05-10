import { describe, it, expect } from "vitest";

import { createCategorySchema } from "@/features/categories/schemas/create-category-schema";

import { updateCategorySchema } from "@/features/categories/schemas/update-category-schema";

describe("createCategorySchema", () => {
  it("should validate a valid category", () => {
    const validData = {
      categoryName: "Technology",
    };

    const result = createCategorySchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should reject empty category name", () => {
    const invalidData = {
      categoryName: "",
    };

    const result = createCategorySchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Veuillez entrez le nom de la catégorie",
      );
    }
  });

  it("should reject whitespace-only category name", () => {
    const invalidData = {
      categoryName: "   ",
    };

    const result = createCategorySchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});

describe("updateCategorySchema", () => {
  it("should validate valid update data", () => {
    const validData = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      categoryName: "Science",
    };

    const result = updateCategorySchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should reject invalid uuid", () => {
    const invalidData = {
      id: "123",
      categoryName: "Science",
    };

    const result = updateCategorySchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("should reject empty category name", () => {
    const invalidData = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      categoryName: "",
    };

    const result = updateCategorySchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Veuillez entrez le nom de la catégorie",
      );
    }
  });
});
