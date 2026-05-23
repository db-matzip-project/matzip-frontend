import { apiClient } from './client';
import type { OptimalOrderResponse, RouteLegDto } from './types';

export async function getScheduleRouteLegsApi(scheduleId: number) {
  const { data } = await apiClient.get<RouteLegDto[]>(
    `/api/v1/schedules/${scheduleId}/route/legs`,
  );
  return data;
}

export async function getScheduleSuggestedOrderApi(
  scheduleId: number,
  startRestaurantId?: number,
) {
  const { data } = await apiClient.get<OptimalOrderResponse>(
    `/api/v1/schedules/${scheduleId}/route/suggested-order`,
    { params: { startRestaurantId } },
  );
  return data;
}

export async function getOptimalOrderApi(
  restaurantIds: number[],
  startRestaurantId?: number,
) {
  const { data } = await apiClient.post<OptimalOrderResponse>(
    '/api/v1/route/optimal-order',
    { restaurantIds, startRestaurantId },
  );
  return data;
}
