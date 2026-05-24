import axios from 'axios';
import { apiClient } from './client';
import type { SimilarUserRestaurant } from './types';

const ANALYTICS_PATHS = [
  '/api/v1/analytics/similar-users/top-restaurants/me',
  '/api/v1/analytics/similar-users/top-restaurants',
] as const;

export async function getSimilarUsersTopRestaurantsApi() {
  let lastError: unknown;
  for (const path of ANALYTICS_PATHS) {
    try {
      const { data } = await apiClient.get<SimilarUserRestaurant[]>(path);
      return data;
    } catch (err) {
      lastError = err;
      if (axios.isAxiosError(err) && err.response?.status === 404) continue;
      throw err;
    }
  }
  throw lastError;
}
