import { describe, it, expect, beforeEach } from "vitest";
import { setAuthCookie, getAuthToken } from "@/lib/cookie";

describe("cookie helpers", () => {
  beforeEach(() => {
    // Clear all cookies in jsdom
    document.cookie.split(";").forEach((c) => {
      const name = c.trim().split("=")[0];
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
  });

  describe("setAuthCookie", () => {
    it("doit définir le cookie auth-token", () => {
      setAuthCookie("my-token");

      expect(document.cookie).toContain("auth-token=my-token");
    });
  });

  describe("getAuthToken", () => {
    it("doit retourner le token depuis les cookies", () => {
      document.cookie = "auth-token=my-token";
      document.cookie = "other=value";

      const token = getAuthToken();
      expect(token).toBe("my-token");
    });

    it("doit retourner undefined si le cookie n'existe pas", () => {
      document.cookie = "other=value";
      document.cookie = "another=test";

      const token = getAuthToken();
      expect(token).toBeUndefined();
    });

    it("doit retourner undefined si aucun cookie n'est défini", () => {
      const token = getAuthToken();
      expect(token).toBeUndefined();
    });

    it("doit gérer un cookie auth-token parmi d'autres", () => {
      document.cookie = "session=abc";
      document.cookie = "auth-token=real-token";
      document.cookie = "theme=dark";

      const token = getAuthToken();
      expect(token).toBe("real-token");
    });
  });
});
