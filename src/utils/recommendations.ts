import { PREFERENCE_LABELS } from '../constants/preferences';
import type { RecommendedRestaurant, Restaurant } from '../types/restaurant';

export function buildRecommendations(
  restaurants: Restaurant[],
  preferences: string[],
  limit = 6,
): RecommendedRestaurant[] {
  if (preferences.length === 0) {
    return restaurants.slice(0, limit).map((r) => ({
      ...r,
      matchScore: 0,
      matchReasons: [],
    }));
  }

  return restaurants
    .map((restaurant) => {
      const matchReasons = preferences
        .filter((pref) => restaurant.tags.includes(pref) || restaurant.category.includes(PREFERENCE_LABELS[pref] ?? ''))
        .map((pref) => PREFERENCE_LABELS[pref] ?? pref);

      const matchScore =
        preferences.length > 0
          ? Math.round((matchReasons.length / preferences.length) * 100)
          : 0;

      return { ...restaurant, matchScore, matchReasons };
    })
    .sort((a, b) => b.matchScore - a.matchScore || b.rating - a.rating)
    .slice(0, limit);
}
