/**
 * Swagger: `category`는 everywhere `string` (enum 미기재).
 * GET ?category= · 응답 `category` · from-place `place.category` 모두 동일 필드명.
 * 백엔드 저장 값은 아래 6종(한식~디저트)으로 맞추는 것을 전제로 UI 구성.
 */
export const RESTAURANT_CATEGORY_VALUES = [
  '한식',
  '일식',
  '중식',
  '양식',
  '채식',
  '디저트',
] as const;

export type RestaurantCategoryValue = (typeof RESTAURANT_CATEGORY_VALUES)[number];

export const RESTAURANT_CATEGORIES = ['전체', ...RESTAURANT_CATEGORY_VALUES] as const;

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
