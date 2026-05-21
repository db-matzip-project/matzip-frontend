export type Schedule = {
  id: string;
  userId: string;
  title: string;
  date: string;
  memo: string;
  /** 방문 순서대로 정렬된 식당 ID */
  restaurantIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type RouteLeg = {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  distanceKm: number;
  walkMinutes: number;
};

export type RouteSummary = {
  legs: RouteLeg[];
  totalDistanceKm: number;
  totalWalkMinutes: number;
};
