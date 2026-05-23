import { apiClient } from './client';
import type { SimilarUserRestaurant } from './types';

export async function getSimilarUsersTopRestaurantsApi() {
  const { data } = await apiClient.get<SimilarUserRestaurant[]>(
    '/api/v1/analytics/similar-users/top-restaurants',
  );
  return data;
}
