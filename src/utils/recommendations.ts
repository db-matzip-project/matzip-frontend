import { DUMMY_RESTAURANTS } from '../data/dummyRestaurants';
import type { RecommendedRestaurant } from '../types/restaurant';
import { PREFERENCE_LABELS } from '../constants/preferences';

export function getRecommendations(
  preferences: string[],
  limit = 6,
): RecommendedRestaurant[] {
  if (preferences.length === 0) {
    return DUMMY_RESTAURANTS.slice(0, limit).map((r) => ({
      ...r,
      matchScore: 0,
      matchReasons: [],
    }));
  }

  return DUMMY_RESTAURANTS.map((restaurant) => {
    const matchReasons = preferences
      .filter((pref) => restaurant.tags.includes(pref))
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
