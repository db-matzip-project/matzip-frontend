/** API 응답 DTO */

export type AuthResponse = {
  tokenType: string;
  accessToken: string;
  expiresInMs: number;
  user: ApiUser;
};

export type ApiUser = {
  id: number;
  loginId: string;
  name: string;
  phone: string;
  nickname: string;
  age: number;
};

export type PreferenceCatalogItem = {
  id: number;
  code: string;
  displayName: string;
};

export type UserPreferenceItem = {
  preferenceId: number;
  code: string;
  displayName: string;
  weight: number;
};

export type ApiRestaurant = {
  id: number;
  apiId: string;
  name: string;
  category: string;
  address: string;
  roadAddress: string;
  phone: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number | null;
  reviewCount: number | null;
  scheduleAddCount: number | null;
};

export type RestaurantPageResponse = {
  content: ApiRestaurant[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ScheduleListItem = {
  id: number;
  title: string;
  travelDate: string;
  createdAt: string;
  itemCount: number;
};

export type ScheduleItemDto = {
  itemId: number;
  visitOrder: number;
  memo: string;
  restaurant: ApiRestaurant;
};

export type ScheduleDetail = {
  id: number;
  title: string;
  travelDate: string;
  createdAt: string;
  items: ScheduleItemDto[];
};

export type RouteLegDto = {
  fromRestaurantId: number;
  toRestaurantId: number;
  distanceKm: number;
};

export type OptimalOrderResponse = {
  restaurantIdsInVisitOrder: number[];
  totalDistanceKm: number;
};

export type SimilarUserRestaurant = {
  restaurantId: number;
  restaurantName: string;
  scheduleCount: number;
  contributorUserCount: number;
};
