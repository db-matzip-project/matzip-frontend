import { SEOUL_MAP_BOUNDS } from '../constants/mapBounds';
import type { RestaurantFilterState } from './filterRestaurants';

export function buildRestaurantSortParam(
  sortBy: RestaurantFilterState['sortBy'],
): string {
  switch (sortBy) {
    case 'reviews':
      return 'reviewCount,desc';
    case 'distance':
      return 'distance,asc';
    default:
      return 'rating,desc';
  }
}

export function buildRestaurantListQuery(filters: RestaurantFilterState, options?: {
  tasteSimilar?: boolean;
  size?: number;
}) {
  const sort = buildRestaurantSortParam(filters.sortBy);

  return {
    category: filters.category !== '전체' ? filters.category : undefined,
    minRating: filters.minRating > 0 ? filters.minRating : undefined,
    sort,
    tasteSimilar: options?.tasteSimilar,
    size: options?.size ?? 50,
  ...(filters.sortBy === 'distance' ? SEOUL_MAP_BOUNDS : {}),
  };
}
