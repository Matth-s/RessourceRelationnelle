import { describe, it, expect } from "vitest";
import { USER_ROLE } from "@/type/user-type";

describe("user type constants", () => {
  it("doit avoir les 4 rôles définis", () => {
    expect(Object.keys(USER_ROLE)).toHaveLength(4);
  });

  it("doit avoir le rôle User", () => {
    expect(USER_ROLE.USER).toBe("User");
  });

  it("doit avoir le rôle Admin", () => {
    expect(USER_ROLE.ADMIN).toBe("Admin");
  });

  it("doit avoir le rôle Moderator", () => {
    expect(USER_ROLE.MODERATOR).toBe("Moderator");
  });

  it("doit avoir le rôle SuperAdmin", () => {
    expect(USER_ROLE.SUPERADMIN).toBe("SuperAdmin");
  });

  it("doit être un objet constant (readonly)", () => {
    const keys = Object.keys(USER_ROLE);
    expect(keys).toContain("USER");
    expect(keys).toContain("ADMIN");
    expect(keys).toContain("MODERATOR");
    expect(keys).toContain("SUPERADMIN");
  });
});
