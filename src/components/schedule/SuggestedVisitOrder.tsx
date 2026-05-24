import { useEffect, useMemo, useState } from 'react';
import { getOptimalOrderApi, getScheduleSuggestedOrderApi } from '../../api/route';
import { getApiErrorMessage } from '../../api/client';
import { getCachedRestaurant } from '../../utils/restaurantCache';
import Button from '../ui/Button';

type SuggestedVisitOrderProps = {
  restaurantIds: string[];
  scheduleId?: string;
  onApply: (orderedIds: string[]) => void | Promise<void>;
  disabled?: boolean;
};

function sameOrder(a: string[], b: string[]) {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

export default function SuggestedVisitOrder({
  restaurantIds,
  scheduleId,
  onApply,
  disabled = false,
}: SuggestedVisitOrderProps) {
  const [suggestedIds, setSuggestedIds] = useState<string[]>([]);
  const [totalDistanceKm, setTotalDistanceKm] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantIds.length < 2) {
      setSuggestedIds([]);
      setTotalDistanceKm(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const numericIds = restaurantIds.map(Number).filter((n) => Number.isFinite(n));
        const data = scheduleId
          ? await getScheduleSuggestedOrderApi(Number(scheduleId))
          : await getOptimalOrderApi(numericIds);
        if (cancelled) return;
        const ordered = data.restaurantIdsInVisitOrder.map(String);
        setSuggestedIds(ordered);
        setTotalDistanceKm(data.totalDistanceKm);
      } catch (err) {
        if (!cancelled) {
          setSuggestedIds([]);
          setTotalDistanceKm(null);
          setError(getApiErrorMessage(err, '추천 순서를 불러오지 못했습니다.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [scheduleId, restaurantIds.join(',')]);

  const alreadyApplied = useMemo(
    () => suggestedIds.length > 0 && sameOrder(restaurantIds, suggestedIds),
    [restaurantIds, suggestedIds],
  );

  const handleApply = async () => {
    if (suggestedIds.length < 2) return;
    setApplying(true);
    setError(null);
    try {
      await onApply(suggestedIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : '순서 적용에 실패했습니다.');
    } finally {
      setApplying(false);
    }
  };

  if (restaurantIds.length < 2) return null;

  return (
    <div className="space-y-3 rounded-2xl border border-brand-light bg-cream p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-ink">이 순서로 방문하세요</h3>
          <p className="mt-0.5 text-xs text-muted">
            최단 동선 기준 추천 방문 순서입니다.
          </p>
        </div>
        {totalDistanceKm != null && totalDistanceKm > 0 && (
          <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
            약 {totalDistanceKm.toFixed(1)} km
          </span>
        )}
      </div>

      {loading && (
        <p className="text-center text-xs text-muted">추천 순서 계산 중...</p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}

      {!loading && !error && suggestedIds.length > 0 && (
        <>
          <ol className="space-y-2">
            {suggestedIds.map((id, index) => {
              const restaurant = getCachedRestaurant(id);
              return (
                <li
                  key={id}
                  className="flex items-center gap-3 rounded-xl bg-brand-soft px-3 py-2"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-lg">{restaurant?.imageEmoji ?? '🍽️'}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                    {restaurant?.name ?? `식당 #${id}`}
                  </span>
                </li>
              );
            })}
          </ol>

          <Button
            fullWidth
            disabled={disabled || applying || alreadyApplied}
            onClick={handleApply}
          >
            {applying
              ? '적용 중...'
              : alreadyApplied
                ? '추천 순서가 적용됨'
                : '추천 순서 적용'}
          </Button>
        </>
      )}
    </div>
  );
}
