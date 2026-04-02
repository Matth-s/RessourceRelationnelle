import type { IStats } from "@/types/stats-type";
import type { usersSchemaType } from "../schemas/users-schema";

export const createUserStats = (users: usersSchemaType): IStats[] => {
  const total = users.length;
  const totalAdmin = users.filter((user) => user.role.includes("Admin"));
  const totalSuperAdmin = users.filter((user) =>
    user.role.includes("SuperAdmin"),
  );
  const totalActive = users.filter(
    (user) => user.role.includes("User") && user.isActive,
  );
  const totalModerator = users.filter((user) =>
    user.role.includes("Moderator"),
  );

  return [
    {
      title: "Total",
      value: total,
    },
    {
      title: "Actifs",
      value: totalActive.length,
    },
    {
      title: "Admin",
      value: totalAdmin.length,
    },
    {
      title: "Super admin",
      value: totalSuperAdmin.length,
    },
    {
      title: "Modérateurs",
      value: totalModerator.length,
    },
  ];
};
