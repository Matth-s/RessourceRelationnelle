export const USER_ROLE = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  SUPERADMIN: 'superadmin',
} as const;

export type IUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
