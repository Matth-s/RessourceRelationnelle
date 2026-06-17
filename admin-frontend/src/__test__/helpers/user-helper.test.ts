import { createUserStats } from "@/features/user/helpers/user-helpers";
import type { usersSchemaType } from "@/features/user/schemas/users-schema";
import { describe, it, expect } from "vitest";

describe("user helper", () => {
  const mockUsers: usersSchemaType = [
    {
      id: "1",
      username: "AdminUser",
      email: "admin@test.fr",
      role: ["Admin"],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      username: "SuperUser",
      email: "super@test.fr",
      role: ["SuperAdmin"],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
    },
    {
      id: "3",
      username: "ActiveUser",
      email: "user1@test.fr",
      role: ["User"],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
    },
    {
      id: "4",
      username: "InactiveUser",
      email: "user2@test.fr",
      role: ["User"],
      isActive: false,
      emailVerified: true,
      createdAt: new Date(),
    },
    {
      id: "5",
      username: "ModUser",
      email: "mod@test.fr",
      role: ["Moderator"],
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
    },
  ];

  it("ca doit calculer les stats en fonction de chaque role", () => {
    const stats = createUserStats(mockUsers);

    expect(stats).toContainEqual({ title: "Total", value: 5 });
    expect(stats).toContainEqual({ title: "Actifs", value: 1 });
    expect(stats).toContainEqual({ title: "Admin", value: 1 });
    expect(stats).toContainEqual({ title: "Super admin", value: 1 });
    expect(stats).toContainEqual({ title: "Modérateurs", value: 1 });
  });

  it("doit retourner 0 si la liste est vide", () => {
    const stats = createUserStats([]);

    stats.forEach((stat) => {
      expect(stat.value).toBe(0);
    });
  });

  it("si un utilisateur a plusieurs role il est compté dans les categories qui le concerne", () => {
    const multiRoleUser: usersSchemaType = [
      {
        id: "6",
        username: "Multi",
        email: "multi@test.fr",
        role: ["Admin", "Moderator"],
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
      },
    ];

    const stats = createUserStats(multiRoleUser);

    expect(stats.find((s) => s.title === "Admin")?.value).toBe(1);
    expect(stats.find((s) => s.title === "Modérateurs")?.value).toBe(1);
  });
});
