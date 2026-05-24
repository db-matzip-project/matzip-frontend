import { apiClient } from './client';
import type {
  ApiRestaurant,
  KakaoImportRequest,
  KakaoImportResponse,
  RestaurantPageResponse,
  RestaurantSortBy,
} from './types';
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
      page: params.page ?? 0,
      size: params.size ?? 50,
      ...params,
      category: params.category && params.category !== '전체' ? params.category : undefined,
      minRating: params.minRating && params.minRating > 0 ? params.minRating : undefined,
      sortBy: params.sortBy,
      tasteSimilar: params.tasteSimilar === true ? true : undefined,
    },
  });
  return data;
}

export async function getRestaurantByIdApi(id: number) {
  const { data } = await apiClient.get<ApiRestaurant>(`/api/v1/restaurants/${id}`);
  return data;
}

export async function importKakaoRestaurantsApi(body: KakaoImportRequest) {
  const { data } = await apiClient.post<KakaoImportResponse>(
    '/api/v1/restaurants/import/kakao',
    body,
  );
  return data;
}

export async function findRestaurantByApiIdApi(apiId: string) {
  const page = await getRestaurantsApi({ size: 100 });
  return page.content.find((r) => r.apiId === apiId) ?? null;
}
