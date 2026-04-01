import { USER_ROLE, type IUserRoleConstant } from "@/types/user-role-type";

export const USER_ROLE_CONSTANT: IUserRoleConstant[] = [
  {
    name: "User",
    value: USER_ROLE.USER,
  },
  {
    name: "Admin",
    value: USER_ROLE.ADMIN,
  },
  {
    name: "Modérateur",
    value: USER_ROLE.MODERATOR,
  },
  {
    name: "Super admin",
    value: USER_ROLE.SUPERADMIN,
  },
];
