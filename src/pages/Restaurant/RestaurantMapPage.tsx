import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MapMock from '../../components/restaurant/MapMock';
import PageHeader from '../../components/ui/PageHeader';
import { DUMMY_RESTAURANTS } from '../../data/dummyRestaurants';
import {
  DEFAULT_FILTERS,
  filterRestaurants,
  type RestaurantFilterState,
} from '../../utils/filterRestaurants';
import Chip from '../../components/ui/Chip';
import { RESTAURANT_CATEGORIES } from '../../constants/restaurantFilters';

type MapLocationState = { selectedId?: string };

export default function RestaurantMapPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialId = (location.state as MapLocationState)?.selectedId;
  const [selectedId, setSelectedId] = useState<string | undefined>(initialId);
  const [category, setCategory] = useState<string>('전체');

  const filters: RestaurantFilterState = useMemo(
    () => ({ ...DEFAULT_FILTERS, category }),
    [category],
  );

  const restaurants = useMemo(
    () => filterRestaurants(DUMMY_RESTAURANTS, filters),
    [filters],
  );

  const selected = useMemo(() => {
    if (selectedId) {
      const found = restaurants.find((r) => r.id === selectedId);
      if (found) return found;
    }
    return restaurants[0];
  }, [restaurants, selectedId]);

  useEffect(() => {
    if (selectedId && !restaurants.some((r) => r.id === selectedId)) {
      setSelectedId(restaurants[0]?.id);
    }
  }, [restaurants, selectedId]);

  return (
    <div className="pb-4">
      <PageHeader title="지도 탐색" subtitle="주변 맛집 위치" />

      {/* 카테고리 + 필터 (헤더와 분리) */}
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
              onClick={() => {
                setCategory(cat);
                setSelectedId(undefined);
              }}
            />
          ))}
        </div>
      </div>

      {/* 지도 */}
      <div className="bg-cream px-4 py-4">
        <MapMock
          restaurants={restaurants}
          selectedId={selected?.id}
          onSelect={setSelectedId}
          className="h-52 w-full"
        />
        <p className="mt-2 text-center text-[10px] text-subtle">
          카카오/구글 맵 API 연동 전 · 더미 지도 UI
        </p>
      </div>

      {/* 주변 맛집 리스트 */}
      <div className="mx-4 rounded-2xl border border-brand-light bg-surface px-4 py-4">
        <h2 className="mb-3 text-sm font-bold text-ink">
          주변 맛집 ({restaurants.length})
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
                  {selected.category} · ★ {selected.rating} · {selected.distance}
                </p>
                <p className="mt-1 truncate text-xs font-medium text-brand">
                  탭하여 상세 보기 →
                </p>
              </div>
            </div>
          </button>
        )}

        <ul className="max-h-44 space-y-1.5 overflow-y-auto">
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
                <span className="min-w-0 flex-1 truncate text-ink">{r.name}</span>
                <span className="shrink-0 text-xs text-subtle">{r.distance}</span>
              </button>
            </li>
          ))}
        </ul>

        {restaurants.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">
            이 카테고리에 표시할 식당이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
