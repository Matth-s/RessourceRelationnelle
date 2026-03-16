import type { IDashboardStatArrayType } from '@/features/dashboard/schemas/dashboard-schema';
import { DASHBOARD_TYPE } from '@/types/dashboard-stat-enum';

export const dashboardStatsMock: IDashboardStatArrayType = [
  {
    name: 'Total Ressources',
    value: '272',
    augmentation: 12,
    key: DASHBOARD_TYPE.resource,
  },
  {
    name: 'Utilisateurs',
    value: '1 248',
    augmentation: 8,
    key: DASHBOARD_TYPE.user,
  },
  {
    name: 'Ressources à valider',
    value: '34',
    augmentation: -3,
    key: DASHBOARD_TYPE.resourceToValidate,
  },
  {
    name: 'Consultations',
    value: '5 421',
    augmentation: 21,
    key: DASHBOARD_TYPE.consultations,
  },
];
