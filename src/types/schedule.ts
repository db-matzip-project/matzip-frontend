export type ScheduleItem = {
  itemId: number;
  restaurantId: string;
  visitOrder: number;
  memo?: string;
};

export type Schedule = {
  id: string;
  title: string;
  date: string;
  memo: string;
  /** 방문 순서대로 정렬된 식당 ID */
  restaurantIds: string[];
  items: ScheduleItem[];
  createdAt: string;
  itemCount?: number;
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
