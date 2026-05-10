import { describe, it, expect } from "vitest";
import { loginSchema } from "@/features/auth/schemas/login-schema";

describe("AuthSchema", () => {
  describe("loginSchema", () => {
    it("should validate correct login data", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
      };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should fail on invalid email", () => {
      const data = {
        email: "invalid-email",
        password: "password123",
      };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should fail on empty password", () => {
      const data = {
        email: "test@example.com",
        password: "",
      };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
