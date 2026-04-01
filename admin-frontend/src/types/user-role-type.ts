export interface IUserRoleConstant {
  name: string;
  value: IUserRole;
}

export const USER_ROLE = {
  USER: "User",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  SUPERADMIN: "Superadmin",
} as const;

export type IUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
