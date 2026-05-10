import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";

import { loginApi } from "@/features/auth/api/login-api";
import { api } from "@/lib/axios-client";
import { USER_ROLE } from "@/types/user-type";

vi.mock("@/lib/cookie", () => ({
  setAuthCookie: vi.fn(),
  getAuthToken: vi.fn(),
}));

describe("loginApi", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    vi.clearAllMocks();
  });

  it("should return validated data on successful login", async () => {
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

  it("should throw an error on failed login", async () => {
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

  it("should throw if response schema is invalid", async () => {
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
