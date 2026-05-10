import { describe, it, expect } from "vitest";

import { createCommentSchema } from "@/features/comments/schemas/create-comment-schema";

describe("createCommentSchema", () => {
  it("should validate valid comment data", () => {
    const validData = {
      content: "This is a comment",
      resourceId: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = createCommentSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it("should reject empty content", () => {
    const invalidData = {
      content: "",
      resourceId: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = createCommentSchema.safeParse(invalidData);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Veuillez entrer un message",
      );
    }
  });

  it("should reject whitespace-only content", () => {
    const invalidData = {
      content: "   ",
      resourceId: "550e8400-e29b-41d4-a716-446655440000",
    };

    const result = createCommentSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it("should reject invalid uuid", () => {
    const invalidData = {
      content: "Valid comment",
      resourceId: "123",
    };

    const result = createCommentSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});
