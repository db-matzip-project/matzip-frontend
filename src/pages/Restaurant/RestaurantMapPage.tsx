import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import KakaoRestaurantMap from '../../components/restaurant/KakaoRestaurantMap';
import PageHeader from '../../components/ui/PageHeader';
import {
  DEFAULT_FILTERS,
  filterRestaurants,
  type RestaurantFilterState,
} from '../../utils/filterRestaurants';
import Chip from '../../components/ui/Chip';
import { RESTAURANT_CATEGORIES } from '../../constants/restaurantFilters';
import { useRestaurantList } from '../../hooks/useRestaurants';

type MapLocationState = { selectedId?: string };

export default function RestaurantMapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialId = (location.state as MapLocationState)?.selectedId;
  const [selectedId, setSelectedId] = useState<string | undefined>(initialId);
  const [category, setCategory] = useState<string>('전체');

  // 지도는 전체 목록을 받아 프론트에서 카테고리 매칭 (API category 값 형식이 제각각일 수 있음)
  const { restaurants: apiRestaurants, loading, error } = useRestaurantList({
    size: 50,
    sortBy: 'rating',
  });

  const filters: RestaurantFilterState = useMemo(
    () => ({ ...DEFAULT_FILTERS, category }),
    [category],
  );

  const restaurants = useMemo(
    () => filterRestaurants(apiRestaurants, filters),
    [apiRestaurants, filters],
  );

  const selected = useMemo(
    () => (selectedId ? restaurants.find((r) => r.id === selectedId) : undefined),
    [restaurants, selectedId],
  );

  useEffect(() => {
    if (selectedId && !restaurants.some((r) => r.id === selectedId)) {
      setSelectedId(undefined);
    }
  }, [restaurants, selectedId]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setSelectedId(undefined);
  };

  return (
    <div className="pb-4">
      <PageHeader title="지도 탐색" subtitle="주변 맛집 위치" />

      <div className="border-b border-brand-light bg-surface px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted">카테고리</span>
          <Link
            to="/restaurants/search"
            className="rounded-lg bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"
          >
            상세 필터
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {RESTAURANT_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={category === cat}
              onClick={() => handleCategoryChange(cat)}
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="mx-4 mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="bg-cream px-4 py-4">
        {loading ? (
          <div className="flex h-52 items-center justify-center rounded-2xl bg-brand-soft text-sm text-muted">
            맛집 목록 불러오는 중...
          </div>
        ) : (
          <KakaoRestaurantMap
            restaurants={restaurants}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </div>

      <div className="mx-4 rounded-2xl border border-brand-light bg-surface px-4 py-4">
        <h2 className="mb-3 text-sm font-bold text-ink">
          {category === '전체' ? '주변 맛집' : `${category} 맛집`} ({restaurants.length})
        </h2>

        {selected && (
          <button
            type="button"
            onClick={() => navigate(`/restaurants/${selected.id}`)}
            className="mb-3 w-full rounded-2xl border-2 border-brand bg-brand-soft p-4 text-left transition-colors hover:bg-brand-muted"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selected.imageEmoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink">{selected.name}</p>
                <p className="text-xs text-muted">
                  {selected.category} · ★ {selected.rating ?? 0}
                </p>
                <p className="mt-1 truncate text-xs font-medium text-brand">
                  탭하여 상세 보기 →
                </p>
              </div>
            </div>
          </button>
        )}

        {!selectedId && restaurants.length > 0 && (
          <p className="mb-3 text-center text-xs text-muted">
            목록이나 지도 마커를 선택해 주세요
          </p>
        )}

        <ul className="max-h-80 space-y-1.5 overflow-y-auto">
          {restaurants.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelectedId(r.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedId === r.id
                    ? 'bg-brand-muted font-medium text-ink'
                    : 'text-muted hover:bg-brand-soft'
                }`}
              >
                <span className="text-xl">{r.imageEmoji}</span>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-ink">{r.name}</span>
                  <span className="block truncate text-[10px] text-subtle">
                    {r.category}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {!loading && restaurants.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">
            이 카테고리에 맞는 식당이 없습니다.
            <br />
            <span className="text-xs text-subtle">
              (백엔드 category 값이 「한식」 등과 다를 수 있습니다)
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
