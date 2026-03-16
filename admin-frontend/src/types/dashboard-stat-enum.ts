export const DASHBOARD_TYPE = {
  resource: 'resource',
  user: 'user',
  resourceToValidate: 'resourceToValidate',
  consultations: 'consultations',
} as const;

export type IDashboardType =
  (typeof DASHBOARD_TYPE)[keyof typeof DASHBOARD_TYPE];
