import { calculateRoute } from '../../utils/routeCalculator';
import { getRestaurantById } from '../../data/dummyRestaurants';

type RouteVisualizationProps = {
  restaurantIds: string[];
};

export default function RouteVisualization({
  restaurantIds,
}: RouteVisualizationProps) {
  const route = calculateRoute(restaurantIds);

  if (restaurantIds.length < 2) {
    return (
      <div className="rounded-2xl border border-brand-light bg-brand-soft px-4 py-6 text-center text-sm text-muted">
        식당을 2곳 이상 추가하면 이동 동선과 예상 거리를 확인할 수 있어요.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-brand-light bg-brand-soft p-4 text-ink">
        <div className="text-center">
          <p className="text-2xl font-bold text-brand">{route.totalDistanceKm}</p>
          <p className="text-[10px] text-muted">총 이동 거리 (km)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-brand">{route.totalWalkMinutes}</p>
          <p className="text-[10px] text-muted">예상 도보 (분)</p>
        </div>
      </div>

      <ol className="space-y-0">
        {restaurantIds.map((id, index) => {
          const restaurant = getRestaurantById(id);
          const leg = route.legs[index];
          return (
            <li key={id}>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  {index < restaurantIds.length - 1 && (
                    <div className="my-1 min-h-[24px] w-0.5 flex-1 bg-brand-light" />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{restaurant?.imageEmoji}</span>
                    <p className="truncate font-medium text-ink">
                      {restaurant?.name ?? id}
                    </p>
                  </div>
                  {restaurant && (
                    <p className="text-xs text-muted">{restaurant.address}</p>
                  )}
                </div>
              </div>

              {leg && (
                <div className="mb-3 ml-3 flex items-center gap-2 border-l-2 border-dashed border-brand-light pl-6">
                  <span className="text-brand">↓</span>
                  <div className="rounded-xl bg-brand-soft px-3 py-2 text-xs text-ink ring-1 ring-brand-light">
                    <span className="font-semibold">{leg.distanceKm} km</span>
                    <span className="text-muted"> · 도보 약 {leg.walkMinutes}분</span>
                    <p className="mt-0.5 text-[10px] text-subtle">
                      {leg.fromName} → {leg.toName}
                    </p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
