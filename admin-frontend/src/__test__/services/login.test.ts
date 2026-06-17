import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";

import { loginApi } from "@/features/auth/api/login-api";
import { api } from "@/lib/axios-client";
import { USER_ROLE } from "@/types/user-type";

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

  it("doit retourner les données de l'utilisateur", async () => {
    const mockResponse = {
      username: "testuser",
      role: [USER_ROLE.ADMIN],
      token: "fake-jwt-token",
      id: "dede",
    };

    mock.onPost("/authentication/login").reply(200, mockResponse);

    const result = await loginApi({
      email: "test@example.com",
      password: "password",
    });

    expect(result).toEqual(mockResponse);
  });

  it("doit retourner une erreur", async () => {
    mock
      .onPost("/authentication/login")
      .reply(401, { message: "Unauthorized" });

    await expect(
      loginApi({
        email: "test@example.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow();
  });

  it("doit retourner une erreur si le schema est invalide", async () => {
    const invalidResponse = {
      username: "testuser",
    };

    mock.onPost("/authentication/login").reply(200, invalidResponse);

    await expect(
      loginApi({
        email: "test@example.com",
        password: "password",
      }),
    ).rejects.toThrow();
  });
});
