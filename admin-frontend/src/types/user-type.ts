export interface IUserRoleConstant {
  label: string;
  value: IUserRole;
}

export const USER_ROLE = {
  USER: "User",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  SUPERADMIN: "SuperAdmin",
} as const;

export type IUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type IStatusParams = "active" | "inactive";
