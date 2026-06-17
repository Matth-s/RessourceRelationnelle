import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "@/features/auth/auth.slice";

describe("store", () => {
  const createTestStore = () =>
    configureStore({
      reducer: {
        auth: authReducer,
      },
    });

  it("doit initialiser le store correctement", () => {
    const store = createTestStore();
    const state = store.getState();

    expect(state.auth).toBeDefined();
    expect(state.auth.user).toBeNull();
  });

  it("doit gérer le dispatch de login", () => {
    const store = createTestStore();

    store.dispatch(
      login({
        username: "testuser",
        role: ["User"],
        token: "token-123",
      })
    );

    const state = store.getState();
    expect(state.auth.user?.username).toBe("testuser");
  });

  it("doit gérer le dispatch de logout", () => {
    const store = createTestStore();

    store.dispatch(
      login({
        username: "testuser",
        role: ["User"],
        token: "token-123",
      })
    );
    store.dispatch(logout());

    const state = store.getState();
    expect(state.auth.user).toBeNull();
  });

  it("doit retourner le bon type de state", () => {
    const store = createTestStore();
    const state = store.getState();

    expect(state).toHaveProperty("auth");
    expect(state.auth).toHaveProperty("user");
  });
});
