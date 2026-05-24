import { useEffect, useState } from 'react';
import { getOptimalOrderApi, getScheduleRouteLegsApi } from '../../api/route';
import type { RouteLegDto } from '../../api/types';
import { getCachedRestaurant } from '../../utils/restaurantCache';

type RouteVisualizationProps = {
  restaurantIds: string[];
  scheduleId?: string;
};

export default function RouteVisualization({
  restaurantIds,
  scheduleId,
}: RouteVisualizationProps) {
  const [legs, setLegs] = useState<RouteLegDto[]>([]);
  const [optimalTotalKm, setOptimalTotalKm] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (restaurantIds.length < 2) {
      setLegs([]);
      setOptimalTotalKm(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        if (scheduleId) {
          const data = await getScheduleRouteLegsApi(Number(scheduleId));
          if (!cancelled) {
            setLegs(data);
            setOptimalTotalKm(null);
          }
        } else {
          const ids = restaurantIds.map(Number).filter((n) => Number.isFinite(n));
          const data = await getOptimalOrderApi(ids);
          if (!cancelled) {
            setLegs([]);
            setOptimalTotalKm(data.totalDistanceKm);
          }
        }
      } catch {
        if (!cancelled) {
          setLegs([]);
          setOptimalTotalKm(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [scheduleId, restaurantIds.join(',')]);

  if (restaurantIds.length < 2) {
    return (
      <div className="rounded-2xl border border-brand-light bg-brand-soft px-4 py-6 text-center text-sm text-muted">
        식당을 2곳 이상 추가하면 이동 동선과 예상 거리를 확인할 수 있어요.
      </div>
    );
  }

  const totalDistanceKm =
    legs.length > 0
      ? legs.reduce((sum, leg) => sum + leg.distanceKm, 0)
      : (optimalTotalKm ?? 0);
  const totalWalkMinutes = Math.round(totalDistanceKm * 12);

  return (
    <div className="space-y-3">
      {loading && (
        <p className="text-center text-xs text-muted">동선 계산 중...</p>
      )}

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-brand-light bg-brand-soft p-4 text-ink">
        <div className="text-center">
          <p className="text-2xl font-bold text-brand">
            {totalDistanceKm > 0 ? totalDistanceKm.toFixed(1) : '—'}
          </p>
          <p className="text-[10px] text-muted">총 이동 거리 (km)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-brand">
            {totalWalkMinutes > 0 ? totalWalkMinutes : '—'}
          </p>
          <p className="text-[10px] text-muted">예상 도보 (분)</p>
        </div>
      </div>

      <ol className="space-y-0">
        {restaurantIds.map((id, index) => {
          const restaurant = getCachedRestaurant(id);
          const leg = legs[index];
          const fromName =
            getCachedRestaurant(String(leg?.fromRestaurantId))?.name ?? '';
          const toName =
            getCachedRestaurant(String(leg?.toRestaurantId))?.name ?? '';

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
                    <span className="text-lg">{restaurant?.imageEmoji ?? '🍽️'}</span>
                    <p className="truncate font-medium text-ink">
                      {restaurant?.name ?? `식당 #${id}`}
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
                    <span className="font-semibold">{leg.distanceKm.toFixed(1)} km</span>
                    <span className="text-muted">
                      {' '}
                      · 도보 약 {Math.round(leg.distanceKm * 12)}분
                    </span>
                    <p className="mt-0.5 text-[10px] text-subtle">
                      {fromName} → {toName}
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
