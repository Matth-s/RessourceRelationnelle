import { describe, it, expect } from "vitest";
import { currentUserSchema } from "@/features/user/schemas/current-user-schema";

describe("current user schema", () => {
  it("doit valider un utilisateur correct avec un rôle", () => {
    const result = currentUserSchema.safeParse({
      username: "testuser",
      role: ["User"],
      token: "jwt-token-123",
    });

    expect(result.success).toBe(true);
  });

  it("doit valider un utilisateur avec plusieurs rôles", () => {
    const result = currentUserSchema.safeParse({
      username: "admin",
      role: ["Admin", "Moderator"],
      token: "jwt-token-456",
    });

    expect(result.success).toBe(true);
  });

  it("doit rejeter un utilisateur sans rôle", () => {
    const result = currentUserSchema.safeParse({
      username: "testuser",
      role: [],
      token: "jwt-token-123",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter un rôle invalide", () => {
    const result = currentUserSchema.safeParse({
      username: "testuser",
      role: ["InvalidRole"],
      token: "jwt-token-123",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter si le username est manquant", () => {
    const result = currentUserSchema.safeParse({
      role: ["User"],
      token: "jwt-token-123",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter si le token est manquant", () => {
    const result = currentUserSchema.safeParse({
      username: "testuser",
      role: ["User"],
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter si le role est manquant", () => {
    const result = currentUserSchema.safeParse({
      username: "testuser",
      token: "jwt-token-123",
    });

    expect(result.success).toBe(false);
  });

  it("doit valider tous les rôles valides", () => {
    const validRoles = ["User", "Admin", "Moderator", "SuperAdmin"];
    for (const role of validRoles) {
      const result = currentUserSchema.safeParse({
        username: "testuser",
        role: [role],
        token: "token",
      });
      expect(result.success).toBe(true);
    }
  });
});
