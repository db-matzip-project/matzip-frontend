import { apiClient } from './client';
import type { DashboardMeResponse } from './types';

const DASHBOARD_PATHS = [
  '/api/v1/dashboard/me',
  '/api/v1/dashboard/stats/me',
  '/api/v1/dashboard/stats',
] as const;

/** Swagger: dashboard-controller (경로 alias 순서대로 시도) */
export async function getDashboardMeApi(): Promise<DashboardMeResponse> {
  let lastError: unknown;
  for (const path of DASHBOARD_PATHS) {
    try {
      const { data } = await apiClient.get<DashboardMeResponse>(path);
      return data;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}
