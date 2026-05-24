export type Restaurant = {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  address: string;
  distance: string;
  imageEmoji: string;
  description: string;
  /** 지도 UI 모형용 위치 (0~100%) */
  mapPosition: { x: number; y: number };
  openHours: string;
  phone: string;
  latitude?: number;
  longitude?: number;
};
