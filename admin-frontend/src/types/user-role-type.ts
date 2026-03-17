export const USER_ROLE = {
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  SUPERADMIN: "Superadmin",
} as const;

export type IUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
