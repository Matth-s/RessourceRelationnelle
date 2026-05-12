import { describe, it, expect } from "vitest";

import { formatRole } from "@/helpers/format-role-name";

describe("formatRole", () => {
  it("doit retourner admin pour Admin role", () => {
    expect(formatRole("Admin")).toBe("Admin");
  });

  it("doit retourner  Modérateur pour Moderator role", () => {
    expect(formatRole("Moderator")).toBe("Modérateur");
  });

  it("doit retourner Super admin pour SuperAdmin role", () => {
    expect(formatRole("SuperAdmin")).toBe("Super admin");
  });

  it("doit retourner Utilisateur pour User role", () => {
    expect(formatRole("User")).toBe("Utilisateur");
  });
});
