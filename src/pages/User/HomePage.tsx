import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import PageHeader from '../../components/ui/PageHeader';
import { PREFERENCE_LABELS } from '../../constants/preferences';
import { getRestaurantByIdApi } from '../../api/restaurants';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferenceContext';
import { useDashboard } from '../../hooks/useDashboard';
import { useRestaurantList } from '../../hooks/useRestaurants';
import { mapApiRestaurant } from '../../mappers/restaurant';
import type { Restaurant } from '../../types/restaurant';
import { buildRecommendations } from '../../utils/recommendations';

export default function HomePage() {
  const { user } = useAuth();
  const { catalog } = usePreferences();
  const { stats, loading: dashboardLoading, error: dashboardError } = useDashboard();
  const {
    restaurants: fallbackRestaurants,
    loading: fallbackLoading,
    error: fallbackError,
  } = useRestaurantList({
    tasteSimilar: true,
    size: 30,
    sortBy: 'rating',
  });

  const [similarRestaurants, setSimilarRestaurants] = useState<Restaurant[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  const similarIds = useMemo(
    () => stats?.similarTasteTopRestaurants?.map((r) => r.restaurantId) ?? [],
    [stats],
  );

  useEffect(() => {
    if (similarIds.length === 0) {
      setSimilarRestaurants([]);
      return;
    }

    let cancelled = false;
    setSimilarLoading(true);

    (async () => {
      const fetched = await Promise.all(
        similarIds.slice(0, 6).map(async (id) => {
          try {
            return mapApiRestaurant(await getRestaurantByIdApi(id));
          } catch {
            return null;
          }
        }),
      );
      if (!cancelled) {
        setSimilarRestaurants(fetched.filter((r): r is Restaurant => r !== null));
      }
    })().finally(() => {
      if (!cancelled) setSimilarLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [similarIds.join(',')]);

  const baseRestaurants =
    similarRestaurants.length > 0 ? similarRestaurants : fallbackRestaurants;

  const recommendations = useMemo(
    () => buildRecommendations(baseRestaurants, user?.preferences ?? [], 6),
    [baseRestaurants, user?.preferences],
  );

  const loading =
    dashboardLoading || similarLoading || (similarIds.length === 0 && fallbackLoading);
  const error = dashboardError ?? (similarIds.length === 0 ? fallbackError : null);

  /** 카드 숫자·리스트 모두 recommendations 기준 (stats.length 단독 사용 시 불일치) */
  const recommendCount = recommendations.length;
  const topMatchScore = recommendations[0]?.matchScore ?? 0;
  const preferenceCount = stats?.preferenceCount ?? user?.preferences.length ?? 0;
  const summarySource =
    similarIds.length > 0 && similarRestaurants.length > 0
      ? '대시보드·유사 사용자 기반'
      : '취향·유사 사용자 기반';

  const labelForPref = (code: string) => {
    const fromCatalog = catalog.find((p) => p.code === code)?.displayName;
    return fromCatalog ?? PREFERENCE_LABELS[code] ?? code;
  };

  return (
    <div className="pb-4">
      <PageHeader
        title={`안녕하세요, ${user?.name ?? '게스트'}님`}
        subtitle="오늘의 맞춤 맛집을 골라봤어요"
        action={
          <Link
            to="/onboarding"
            className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-medium text-brand"
          >
            취향 수정
          </Link>
        }
      />

      <section className="bg-surface px-4 py-4">
        <h2 className="mb-2 text-sm font-semibold text-ink">내 취향</h2>
        <div className="flex flex-wrap gap-1.5">
          {(user?.preferences ?? []).map((pref) => (
            <span
              key={pref}
              className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"
            >
              {labelForPref(pref)}
            </span>
          ))}
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-base font-bold text-ink">나를 위한 맞춤 추천</h2>
            <p className="text-xs text-muted">
              {summarySource} · 총 {recommendCount}곳
            </p>
          </div>
          <Link to="/restaurants" className="text-xs font-medium text-brand">
            전체 보기 →
          </Link>
        </div>

        {loading && (
          <p className="py-8 text-center text-sm text-muted">맛집 불러오는 중...</p>
        )}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl border border-brand-light bg-brand-soft p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand">{recommendCount}</p>
                <p className="text-[10px] text-muted">추천 맛집</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand">{topMatchScore}%</p>
                <p className="text-[10px] text-muted">최고 일치도</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand">{preferenceCount}</p>
                <p className="text-[10px] text-muted">선택 취향</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {recommendations.length > 0 ? (
                recommendations.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))
              ) : (
                <div className="rounded-2xl bg-brand-soft py-8 text-center text-sm text-muted">
                  추천할 맛집이 없습니다. 취향을 설정하거나 맛집 목록을 확인해 보세요.
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <section className="mt-2 px-4">
        <h2 className="mb-3 text-sm font-semibold text-ink">빠른 탐색</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/restaurants/search"
            className="rounded-2xl border border-brand-light bg-cream p-4 hover:bg-brand-soft"
          >
            <span className="text-2xl">🔍</span>
            <p className="mt-2 text-sm font-semibold text-ink">조건 검색</p>
            <p className="text-xs text-muted">카테고리·평점 필터</p>
          </Link>
          <Link
            to="/schedules/new"
            className="rounded-2xl border border-brand-light bg-brand-soft p-4 hover:bg-brand-muted"
          >
            <span className="text-2xl">📅</span>
            <p className="mt-2 text-sm font-semibold text-ink">일정 만들기</p>
            <p className="text-xs text-muted">맛집 투어 계획</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
