export const RESTAURANT_CATEGORIES = [
  '전체',
  '한식',
  '일식',
  '중식',
  '양식',
  '채식',
  '디저트',
] as const;

export const RATING_OPTIONS = [
  { value: 0, label: '전체' },
  { value: 4.0, label: '4.0+' },
  { value: 4.5, label: '4.5+' },
  { value: 4.8, label: '4.8+' },
] as const;

export const PRICE_OPTIONS = [
  { value: 0, label: '전체' },
  { value: 1, label: '₩' },
  { value: 2, label: '₩₩' },
  { value: 3, label: '₩₩₩' },
] as const;

export const SORT_OPTIONS = [
  { value: 'rating', label: '평점순' },
  { value: 'reviews', label: '리뷰순' },
  { value: 'distance', label: '거리순' },
] as const;
