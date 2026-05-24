import type { ApiRestaurant } from '../api/types';
import type { Restaurant } from '../types/restaurant';
import { cacheRestaurant } from '../utils/restaurantCache';

const CATEGORY_EMOJI: Record<string, string> = {
  한식: '🍚',
  중식: '🥟',
  일식: '🍣',
  양식: '🍝',
  채식: '🥗',
  카페: '☕',
  디저트: '🍰',
  기타: '🍽️',
  술집: '🍺',
  분식: '🍜',
};

function emojiForCategory(category: string): string {
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (category.includes(key)) return emoji;
  }
  return '🍽️';
}

/** 위도·경도 → 지도 UI용 0~100% 좌표 (서울 근처 기준 단순 정규화) */
function toMapPosition(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - 126.8) / 0.4) * 100;
  const y = ((37.7 - lat) / 0.2) * 100;
  return {
    x: Math.min(95, Math.max(5, x)),
    y: Math.min(95, Math.max(5, y)),
  };
}

export function mapApiRestaurant(api: ApiRestaurant): Restaurant {
  const restaurant: Restaurant = {
    id: String(api.id),
    name: api.name ?? '이름 없음',
    category: api.category ?? '기타',
    rating: api.rating ?? 0,
    reviewCount: api.reviewCount ?? 0,
    tags: [],
    address: api.roadAddress || api.address,
    distance: '—',
    imageEmoji: emojiForCategory(api.category),
    description: api.description || '',
    mapPosition: toMapPosition(api.latitude ?? 37.5665, api.longitude ?? 126.978),
    openHours: '정보 없음',
    phone: api.phone || '—',
    latitude: api.latitude,
    longitude: api.longitude,
  };
  cacheRestaurant(restaurant);
  return restaurant;
}

export function mapApiRestaurants(list: ApiRestaurant[]): Restaurant[] {
  return list.map(mapApiRestaurant);
}
