import { describe, it, expect } from "vitest";
import { loginSchema } from "@/features/auth/components/login-form/schemas/login-schemas";

describe("login schema", () => {
  it("doit valider un formulaire correct", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("doit rejeter un email invalide", () => {
    const result = loginSchema.safeParse({
      email: "invalid-email",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter un email vide", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter un mot de passe trop court", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "12345",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter un mot de passe vide", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter un mot de passe trop long (>100 caractères)", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "a".repeat(101),
    });

    expect(result.success).toBe(false);
  });

  it("doit accepter un mot de passe de 6 caractères exactement", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("doit accepter un mot de passe de 100 caractères exactement", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "a".repeat(100),
    });

    expect(result.success).toBe(true);
  });
});
