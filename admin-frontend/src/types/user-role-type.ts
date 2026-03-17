export const USER_ROLE = {
  ADMIN: "Admin",
  MODERATOR: "moderator",
  SUPERADMIN: "superadmin",
} as const;

export type IUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
