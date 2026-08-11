import api from './AxiosConfig';
import type { DashboardHomeParams, DashboardHomeResponse } from '../types/Types';

// ===================== Dashboard =====================

export async function fetchDashboardHome(
  params: DashboardHomeParams = {}
): Promise<DashboardHomeResponse> {
  const query: Record<string, string> = {};

  if (params.search) query.search = params.search;
  if (params.device && params.device !== 'all') query.device = params.device;
  if (params.page) query.page = String(params.page);

  const { data } = await api.get<DashboardHomeResponse>('dashboard/home/', {
    params: query,
  });

  return data;
}