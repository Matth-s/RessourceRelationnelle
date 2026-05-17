import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { api } from "@/lib/axios-client";
import { registerApi } from "@/features/auth/api/register-api";

vi.mock("@/lib/cookie", () => ({
  setAuthCookie: vi.fn(),
  getAuthToken: vi.fn(),
}));

describe("register api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    vi.clearAllMocks();
  });

  it("doit inscrire un utilisateur avec succès", async () => {
    mock.onPost("/authentication/signup").reply(201);

    await expect(
      registerApi({
        email: "new@example.com",
        username: "newuser",
        password: "password123",
        confirmPassword: "password123",
      })
    ).resolves.toBeUndefined();
  });

  it("doit retourner une erreur si l'email existe déjà", async () => {
    mock.onPost("/authentication/signup").reply(409, { message: "Email already exists" });

    await expect(
      registerApi({
        email: "existing@example.com",
        username: "user",
        password: "password123",
        confirmPassword: "password123",
      })
    ).rejects.toThrow();
  });

  it("doit retourner une erreur serveur", async () => {
    mock.onPost("/authentication/signup").reply(500);

    await expect(
      registerApi({
        email: "test@example.com",
        username: "user",
        password: "password123",
        confirmPassword: "password123",
      })
    ).rejects.toThrow();
  });

  it("doit envoyer les bonnes données dans la requête", async () => {
    mock.onPost("/authentication/signup").reply(201);

    await registerApi({
      email: "test@example.com",
      username: "testuser",
      password: "secure123",
      confirmPassword: "secure123",
    });

    const requestData = JSON.parse(mock.history.post[0].data);
    expect(requestData.email).toBe("test@example.com");
    expect(requestData.username).toBe("testuser");
    expect(requestData.password).toBe("secure123");
    expect(requestData.confirmPassword).toBe("secure123");
  });

  it("doit retourner une erreur de validation", async () => {
    mock.onPost("/authentication/signup").reply(400, { message: "Validation error" });

    await expect(
      registerApi({
        email: "invalid",
        username: "",
        password: "123",
        confirmPassword: "456",
      })
    ).rejects.toThrow();
  });
});
