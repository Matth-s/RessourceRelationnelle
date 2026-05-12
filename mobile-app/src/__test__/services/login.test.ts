import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { api } from "@/lib/axios-client";
import { loginApi } from "@/features/auth/api/login-api";

vi.mock("@/lib/cookie", () => ({
  setAuthCookie: vi.fn(),
  getAuthToken: vi.fn(),
}));

describe("login api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    vi.clearAllMocks();
  });

  it("doit retourner les données de connexion", async () => {
    const mockResponse = {
      token: "fake-jwt-token",
      expiration: "2026-12-31T23:59:59Z",
      username: "testuser",
      role: ["User"],
    };

    mock.onPost("/authentication/login").reply(200, mockResponse);

    const result = await loginApi({
      email: "test@example.com",
      password: "password123",
    });

    expect(result).toEqual(mockResponse);
    expect(result.token).toBe("fake-jwt-token");
    expect(result.username).toBe("testuser");
  });

  it("doit retourner une erreur si les identifiants sont invalides", async () => {
    mock.onPost("/authentication/login").reply(401, { message: "Unauthorized" });

    await expect(
      loginApi({
        email: "test@example.com",
        password: "wrong-password",
      })
    ).rejects.toThrow();
  });

  it("doit retourner une erreur serveur", async () => {
    mock.onPost("/authentication/login").reply(500);

    await expect(
      loginApi({
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toThrow();
  });

  it("doit envoyer les bonnes données dans la requête", async () => {
    const mockResponse = {
      token: "token",
      expiration: "2026-12-31",
      username: "user",
      role: ["Admin"],
    };

    mock.onPost("/authentication/login").reply(200, mockResponse);

    await loginApi({
      email: "admin@test.com",
      password: "adminpass",
    });

    const requestData = JSON.parse(mock.history.post[0].data);
    expect(requestData.email).toBe("admin@test.com");
    expect(requestData.password).toBe("adminpass");
  });
});
