import type { Restaurant } from '../types/restaurant';

export type RestaurantFilterState = {
  category: string;
  minRating: number;
  keyword: string;
  sortBy: 'rating' | 'reviews' | 'distance';
};

export const DEFAULT_FILTERS: RestaurantFilterState = {
  category: '전체',
  minRating: 0,
  keyword: '',
  sortBy: 'rating',
};

/** API가 category/minRating/sortBy 처리 후, 키워드만 클라이언트 필터 */
export function filterRestaurants(
  restaurants: Restaurant[],
  filters: RestaurantFilterState,
): Restaurant[] {
  const keyword = filters.keyword.trim().toLowerCase();
  if (!keyword) return restaurants;

  return restaurants.filter((r) => {
    const haystack = `${r.name} ${r.category} ${r.address} ${r.description}`.toLowerCase();
    return haystack.includes(keyword);
  });
}
