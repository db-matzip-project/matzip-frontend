import { apiClient } from './client';
import type { ScheduleDetail, ScheduleListItem } from './types';
import type { SchedulePlacePayload } from '../types/place';

export type CreateScheduleRequest = {
  title: string;
  travelDate: string;
  /** Swagger: 생성 시 visitOrder 1부터 함께 등록 */
  restaurantIds?: number[];
};

export type UpdateScheduleRequest = {
  title?: string;
  travelDate?: string;
};

export type AddScheduleItemRequest = {
  restaurantId: number;
  memo?: string;
};

export type AddScheduleItemFromPlaceRequest = {
  memo?: string;
  place: SchedulePlacePayload & { id?: string };
};

export type ReorderScheduleItemsRequest = {
  orderedRestaurantIds: number[];
};

export async function getSchedulesApi() {
  const { data } = await apiClient.get<ScheduleListItem[]>('/api/v1/schedules');
  return data;
}

export async function getScheduleByIdApi(scheduleId: number) {
  const { data } = await apiClient.get<ScheduleDetail>(`/api/v1/schedules/${scheduleId}`);
  return data;
}

export async function createScheduleApi(body: CreateScheduleRequest) {
  const { data } = await apiClient.post<ScheduleDetail>('/api/v1/schedules', body);
  return data;
}

export async function updateScheduleApi(scheduleId: number, body: UpdateScheduleRequest) {
  const { data } = await apiClient.patch<ScheduleDetail>(
    `/api/v1/schedules/${scheduleId}`,
    body,
  );
  return data;
}

export async function deleteScheduleApi(scheduleId: number) {
  await apiClient.delete(`/api/v1/schedules/${scheduleId}`);
}

export async function addScheduleItemApi(
  scheduleId: number,
  body: AddScheduleItemRequest,
) {
  const { data } = await apiClient.post<ScheduleDetail>(
    `/api/v1/schedules/${scheduleId}/items`,
    body,
  );
  return data;
}

/** 카카오 검색 결과 → DB upsert + 일정 추가 */
export async function addScheduleItemFromPlaceApi(
  scheduleId: number,
  body: AddScheduleItemFromPlaceRequest,
) {
  const { place, memo } = body;
  const { data } = await apiClient.post<ScheduleDetail>(
    `/api/v1/schedules/${scheduleId}/items/from-place`,
    {
      memo,
      place: {
        apiId: place.apiId ?? place.id,
        name: place.name,
        category: place.category,
        address: place.address,
        roadAddress: place.roadAddress,
        phone: place.phone,
        latitude: place.latitude,
        longitude: place.longitude,
      },
    },
  );
  return data;
}

export async function removeScheduleItemApi(scheduleId: number, itemId: number) {
  const { data } = await apiClient.delete<ScheduleDetail>(
    `/api/v1/schedules/${scheduleId}/items/${itemId}`,
  );
  return data;
}

export async function reorderScheduleItemsApi(
  scheduleId: number,
  body: ReorderScheduleItemsRequest,
) {
  const { data } = await apiClient.put<ScheduleDetail>(
    `/api/v1/schedules/${scheduleId}/items/order`,
    body,
  );
  return data;
}
