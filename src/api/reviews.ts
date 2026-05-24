import { apiClient } from './client';
import type { ApiReview, MyReviewPageResponse, ReviewPageResponse } from './types';

export type UpsertReviewPayload = {
  content: string;
  rating: number;
};

export async function getRestaurantReviewsApi(
  restaurantId: number,
  page = 0,
  size = 20,
) {
  const { data } = await apiClient.get<ReviewPageResponse>(
    `/api/v1/restaurants/${restaurantId}/reviews`,
    { params: { page, size } },
  );
  return data;
}

export async function upsertRestaurantReviewApi(
  restaurantId: number,
  payload: UpsertReviewPayload,
) {
  const { data } = await apiClient.post<ApiReview>(
    `/api/v1/restaurants/${restaurantId}/reviews`,
    payload,
  );
  return data;
}

export async function deleteRestaurantReviewApi(restaurantId: number, reviewId: number) {
  await apiClient.delete(`/api/v1/restaurants/${restaurantId}/reviews/${reviewId}`);
}

/** 내 리뷰 목록 (최근 수정 순, restaurantName 포함) */
export async function getMyReviewsApi(page = 0, size = 20) {
  const { data } = await apiClient.get<MyReviewPageResponse>('/api/v1/users/me/reviews', {
    params: { page, size },
  });
  return data;
}
