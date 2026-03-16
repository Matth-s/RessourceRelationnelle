import axios from 'axios';
import {
  dashboardStatArraySchema,
  type IDashboardStatArrayType,
} from '../schemas/dashboard-schema';
import { dashboardStatsMock } from '@/mocks/dashboard-stat-mock';

export const getDashBoardStatsApi =
  async (): Promise<IDashboardStatArrayType> => {
    // const { data } = await axios.get('/stats');

    const data = dashboardStatsMock;

    const validatedData = dashboardStatArraySchema.parse(data);

    return validatedData;
  };
