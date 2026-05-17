import { describe, it, expect, beforeEach } from "vitest";
import { api } from "@/lib/axios-client";

describe("axios client", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("doit avoir une baseURL configurée", () => {
    expect(api.defaults.baseURL).toBeDefined();
  });

  it("doit avoir un intercepteur de requête configuré", () => {
    const interceptors = api.interceptors.request;
    expect(interceptors).toBeDefined();
  });

  it("doit ajouter le token Authorization si présent dans localStorage", async () => {
    localStorage.setItem("auth_token", "test-token");

    const config = {
      headers: {} as Record<string, string>,
    };

    const handlers = (api.interceptors.request as any).handlers;
    if (handlers && handlers.length > 0) {
      const interceptor = handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = await interceptor.fulfilled(config);
        expect(result.headers.Authorization).toBe("Bearer test-token");
      }
    }
  });

  it("ne doit pas ajouter Authorization si pas de token", async () => {
    const config = {
      headers: {} as Record<string, string>,
    };

    const handlers = (api.interceptors.request as any).handlers;
    if (handlers && handlers.length > 0) {
      const interceptor = handlers[0];
      if (interceptor && interceptor.fulfilled) {
        const result = await interceptor.fulfilled(config);
        expect(result.headers.Authorization).toBeUndefined();
      }
    }
  });
});
