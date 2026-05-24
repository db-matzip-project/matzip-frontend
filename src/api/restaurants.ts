import { apiClient } from './client';
import type { ApiRestaurant, RestaurantPageResponse, RestaurantSortBy } from './types';

export type RestaurantListParams = {
  category?: string;
  minRating?: number;
  minLat?: number;
  minLng?: number;
  maxLat?: number;
  maxLng?: number;
  page?: number;
  size?: number;
  sortBy?: RestaurantSortBy;
  tasteSimilar?: boolean;
};

export async function getRestaurantsApi(params: RestaurantListParams = {}) {
  const { data } = await apiClient.get<RestaurantPageResponse>('/api/v1/restaurants', {
    params: {
      page: 0,
      size: 50,
      ...params,
      category: params.category && params.category !== '전체' ? params.category : undefined,
      minRating: params.minRating && params.minRating > 0 ? params.minRating : undefined,
      sortBy: params.sortBy,
    },
  });
  return data;
}

export async function getRestaurantByIdApi(id: number) {
  const { data } = await apiClient.get<ApiRestaurant>(`/api/v1/restaurants/${id}`);
  return data;
}
