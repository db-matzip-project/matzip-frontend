/**
 * Swagger `category` (string) — 백엔드 저장·필터 값.
 * UI 라벨만 다를 수 있음 (예: API `디저트` → 칩 「카페/디저트」).
 */
export const RESTAURANT_CATEGORY_OPTIONS = [
  { value: '한식', label: '한식' },
  { value: '일식', label: '일식' },
  { value: '중식', label: '중식' },
  { value: '양식', label: '양식' },
  { value: '채식', label: '채식' },
  { value: '디저트', label: '카페/디저트' },
  { value: '기타', label: '기타' },
] as const;

export type RestaurantCategoryValue =
  (typeof RESTAURANT_CATEGORY_OPTIONS)[number]['value'];

export const RESTAURANT_CATEGORY_VALUES: RestaurantCategoryValue[] =
  RESTAURANT_CATEGORY_OPTIONS.map((o) => o.value);

/** API 쿼리용 (`전체` 포함) */
export const RESTAURANT_CATEGORIES = ['전체', ...RESTAURANT_CATEGORY_VALUES] as const;

export function getRestaurantCategoryLabel(category: string): string {
  if (category === '전체') return '전체';
  const found = RESTAURANT_CATEGORY_OPTIONS.find((o) => o.value === category);
  return found?.label ?? category;
}

export const RATING_OPTIONS = [
  { value: 0, label: '전체' },
  { value: 4.0, label: '4.0+' },
  { value: 4.5, label: '4.5+' },
  { value: 4.8, label: '4.8+' },
] as const;

export const SORT_OPTIONS = [
  { value: 'rating', label: '평점순' },
  { value: 'reviews', label: '리뷰순' },
  { value: 'distance', label: '거리순' },
] as const;
