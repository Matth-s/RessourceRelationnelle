import { DASHBOARD_TYPE } from '@/types/dashboard-stat-enum';
import z from 'zod';

const dashboardStatObjectSchema = z.object({
  name: z.string(),
  value: z.string(),
  augmentation: z.number(),
  key: z.enum(DASHBOARD_TYPE),
});

export const dashboardStatArraySchema = z.array(
  dashboardStatObjectSchema,
);

export type IDashboardStatSchema = z.infer<
  typeof dashboardStatObjectSchema
>;

export type IDashboardStatArrayType = z.infer<
  typeof dashboardStatArraySchema
>;
