import { getRestaurantById } from '../data/dummyRestaurants';
import type { RouteLeg, RouteSummary } from '../types/schedule';

/** 지도 좌표(0~100%)를 대략적인 km로 환산 (10km × 10km 영역 가정) */
function positionToKm(pos: { x: number; y: number }) {
  return { x: (pos.x / 100) * 10, y: (pos.y / 100) * 10 };
}

function distanceBetweenKm(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const p1 = positionToKm(a);
  const p2 = positionToKm(b);
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function estimateWalkMinutes(km: number): number {
  return Math.max(1, Math.round(km * 12));
}

export function calculateRoute(restaurantIds: string[]): RouteSummary {
  const legs: RouteLeg[] = [];

  for (let i = 0; i < restaurantIds.length - 1; i++) {
    const from = getRestaurantById(restaurantIds[i]);
    const to = getRestaurantById(restaurantIds[i + 1]);
    if (!from || !to) continue;

    const distanceKm =
      Math.round(distanceBetweenKm(from.mapPosition, to.mapPosition) * 10) / 10;
    const walkMinutes = estimateWalkMinutes(distanceKm);

    legs.push({
      fromId: from.id,
      toId: to.id,
      fromName: from.name,
      toName: to.name,
      distanceKm,
      walkMinutes,
    });
  }

  const totalDistanceKm =
    Math.round(legs.reduce((sum, leg) => sum + leg.distanceKm, 0) * 10) / 10;
  const totalWalkMinutes = legs.reduce((sum, leg) => sum + leg.walkMinutes, 0);

  return { legs, totalDistanceKm, totalWalkMinutes };
}
