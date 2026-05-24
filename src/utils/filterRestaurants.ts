import type { Restaurant } from '../types/restaurant';
import { matchesRestaurantCategory } from './restaurantCategory';

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

/** API가 category/minRating/sortBy 처리 후, 키워드·레거시 category 보조 필터 */
export function filterRestaurants(
  restaurants: Restaurant[],
  filters: RestaurantFilterState,
): Restaurant[] {
  const keyword = filters.keyword.trim().toLowerCase();

  return restaurants.filter((r) => {
    if (!matchesRestaurantCategory(r.category, filters.category)) return false;
    if (keyword) {
      const haystack = `${r.name} ${r.category} ${r.address} ${r.description}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  });
}
