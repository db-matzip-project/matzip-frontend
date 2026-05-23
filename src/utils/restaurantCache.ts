import type { Restaurant } from '../types/restaurant';

const cache = new Map<string, Restaurant>();

export function cacheRestaurant(restaurant: Restaurant) {
  cache.set(restaurant.id, restaurant);
}

export function cacheRestaurants(restaurants: Restaurant[]) {
  restaurants.forEach(cacheRestaurant);
}

export function getCachedRestaurant(id: string): Restaurant | undefined {
  return cache.get(id);
}

export function clearRestaurantCache() {
  cache.clear();
}
