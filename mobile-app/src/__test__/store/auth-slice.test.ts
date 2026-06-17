import { describe, it, expect } from "vitest";
import authReducer, { login, logout } from "@/features/auth/auth.slice";
import type { ICurrentUserResponse } from "@/features/user/schemas/current-user-schema";

describe("auth slice", () => {
  const mockUser: ICurrentUserResponse = {
    username: "testuser",
    role: ["User"],
    token: "jwt-token-123",
  };

  it("doit avoir un état initial null", () => {
    const state = authReducer(undefined, { type: "@@INIT" });
    expect(state.user).toBeNull();
  });

  it("doit stocker l'utilisateur lors du login", () => {
    const state = authReducer(undefined, login(mockUser));

    expect(state.user).toEqual(mockUser);
    expect(state.user?.username).toBe("testuser");
    expect(state.user?.token).toBe("jwt-token-123");
  });

  it("doit mettre l'utilisateur à null lors du logout", () => {
    const loggedInState = authReducer(undefined, login(mockUser));
    const loggedOutState = authReducer(loggedInState, logout());

    expect(loggedOutState.user).toBeNull();
  });

  it("doit pouvoir se login avec un admin", () => {
    const adminUser: ICurrentUserResponse = {
      username: "admin",
      role: ["Admin"],
      token: "admin-token",
    };

    const state = authReducer(undefined, login(adminUser));

    expect(state.user?.username).toBe("admin");
    expect(state.user?.role).toContain("Admin");
  });

  it("doit écraser l'utilisateur existant lors d'un nouveau login", () => {
    const user2: ICurrentUserResponse = {
      username: "newuser",
      role: ["Moderator"],
      token: "new-token",
    };

    const stateAfterFirstLogin = authReducer(undefined, login(mockUser));
    const stateAfterSecondLogin = authReducer(stateAfterFirstLogin, login(user2));

    expect(stateAfterSecondLogin.user?.username).toBe("newuser");
    expect(stateAfterSecondLogin.user?.token).toBe("new-token");
  });

  it("doit gérer un logout sans utilisateur connecté", () => {
    const state = authReducer(undefined, logout());
    expect(state.user).toBeNull();
  });
});
