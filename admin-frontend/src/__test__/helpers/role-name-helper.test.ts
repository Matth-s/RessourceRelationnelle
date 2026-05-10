import { describe, it, expect } from "vitest";

import { formatRole } from "@/helpers/format-role-name";

describe("formatRole", () => {
  it("should return Admin for Admin role", () => {
    expect(formatRole("Admin")).toBe("Admin");
  });

  it("should return Modérateur for Moderator role", () => {
    expect(formatRole("Moderator")).toBe("Modérateur");
  });

  it("should return Super admin for SuperAdmin role", () => {
    expect(formatRole("SuperAdmin")).toBe("Super admin");
  });

  it("should return Utilisateur for User role", () => {
    expect(formatRole("User")).toBe("Utilisateur");
  });
});
