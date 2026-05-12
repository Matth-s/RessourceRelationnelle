import { describe, it, expect } from "vitest";
import { registerSchema } from "@/features/auth/components/register-form/schemas/register-schemas";

describe("register schema", () => {
  it("doit valider un formulaire correct", () => {
    const result = registerSchema.safeParse({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("doit rejeter un username trop court", () => {
    const result = registerSchema.safeParse({
      username: "a",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter un username vide", () => {
    const result = registerSchema.safeParse({
      username: "",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter un email invalide", () => {
    const result = registerSchema.safeParse({
      username: "testuser",
      email: "invalid",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter un mot de passe trop court", () => {
    const result = registerSchema.safeParse({
      username: "testuser",
      email: "test@example.com",
      password: "12345",
      confirmPassword: "12345",
    });

    expect(result.success).toBe(false);
  });

  it("doit rejeter si les mots de passe ne correspondent pas", () => {
    const result = registerSchema.safeParse({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "different456",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("confirmPassword");
    }
  });

  it("doit rejeter un mot de passe trop long (>100 caractères)", () => {
    const longPassword = "a".repeat(101);
    const result = registerSchema.safeParse({
      username: "testuser",
      email: "test@example.com",
      password: longPassword,
      confirmPassword: longPassword,
    });

    expect(result.success).toBe(false);
  });

  it("doit accepter un username de 2 caractères", () => {
    const result = registerSchema.safeParse({
      username: "ab",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("doit rejeter un username trop long (>100 caractères)", () => {
    const result = registerSchema.safeParse({
      username: "a".repeat(101),
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(false);
  });

  it("doit accepter un confirmPassword de 6 caractères minimum", () => {
    const result = registerSchema.safeParse({
      username: "testuser",
      email: "test@example.com",
      password: "123456",
      confirmPassword: "123456",
    });

    expect(result.success).toBe(true);
  });
});
