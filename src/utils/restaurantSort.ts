import { SEOUL_MAP_BOUNDS } from '../constants/mapBounds';
import type { RestaurantSortBy } from '../api/types';
import type { RestaurantFilterState } from './filterRestaurants';

export function buildRestaurantSortParam(
  sortBy: RestaurantFilterState['sortBy'],
): RestaurantSortBy {
  switch (sortBy) {
    case 'reviews':
      return 'reviews';
    case 'distance':
      return 'distance';
    default:
      return 'rating';
  }
}

export function buildRestaurantListQuery(
  filters: RestaurantFilterState,
  options?: {
    tasteSimilar?: boolean;
    size?: number;
  },
) {
  return {
    category: filters.category !== '전체' ? filters.category : undefined,
    minRating: filters.minRating > 0 ? filters.minRating : undefined,
    sortBy: buildRestaurantSortParam(filters.sortBy),
    tasteSimilar: options?.tasteSimilar,
    size: options?.size ?? 50,
    ...(filters.sortBy === 'distance' ? SEOUL_MAP_BOUNDS : {}),
  };
}
