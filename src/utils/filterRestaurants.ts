import type { Restaurant } from '../types/restaurant';
import { matchesRestaurantCategory } from './restaurantCategory';

export type RestaurantFilterState = {
  category: string;
  minRating: number;
  priceRange: number;
  keyword: string;
  sortBy: 'rating' | 'reviews' | 'distance';
};

export const DEFAULT_FILTERS: RestaurantFilterState = {
  category: '전체',
  minRating: 0,
  priceRange: 0,
  keyword: '',
  sortBy: 'rating',
};

function parseDistanceKm(distance: string): number {
  const match = distance.match(/([\d.]+)\s*km/i);
  if (match) return parseFloat(match[1]);
  const m = distance.match(/([\d.]+)\s*m/i);
  if (m) return parseFloat(m[1]) / 1000;
  return 999;
}

export function filterRestaurants(
  restaurants: Restaurant[],
  filters: RestaurantFilterState,
): Restaurant[] {
  const keyword = filters.keyword.trim().toLowerCase();

  let result = restaurants.filter((r) => {
    if (!matchesRestaurantCategory(r.category, filters.category)) return false;
    if (filters.minRating > 0 && r.rating < filters.minRating) return false;
    if (filters.priceRange > 0 && r.priceRange !== filters.priceRange) return false;
    if (keyword) {
      const haystack = `${r.name} ${r.category} ${r.address} ${r.description}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => {
    switch (filters.sortBy) {
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'distance':
        return parseDistanceKm(a.distance) - parseDistanceKm(b.distance);
      default:
        return b.rating - a.rating;
    }
  });

  return result;
}
