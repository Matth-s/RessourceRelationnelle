import { USER_ROLE, type IUserRoleConstant } from "@/types/user-type";

export const USER_ROLE_CONSTANT: IUserRoleConstant[] = [
  {
    label: "User",
    value: USER_ROLE.USER,
  },
  {
    label: "Admin",
    value: USER_ROLE.ADMIN,
  },
  {
    label: "Modérateur",
    value: USER_ROLE.MODERATOR,
  },
  {
    label: "Super admin",
    value: USER_ROLE.SUPERADMIN,
  },
];
