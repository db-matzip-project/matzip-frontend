import type { Restaurant } from '../types/restaurant';

/** 홈 맞춤 추천: 평점 순 상위 N곳 (일치도 % 미사용) */
export function buildRecommendations(
  restaurants: Restaurant[],
  _preferences: string[],
  limit = 6,
): Restaurant[] {
  return [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, limit);
}
