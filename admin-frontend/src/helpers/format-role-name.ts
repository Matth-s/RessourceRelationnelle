import type { IUserRole } from "@/types/user-type";

export const formatRole = (role: IUserRole) => {
  switch (role) {
    case "Admin":
      return role;
    case "Moderator":
      return "Modérateur";
    case "SuperAdmin":
      return "Super admin";
    case "User":
      return "Utilisateur";
  }
};
