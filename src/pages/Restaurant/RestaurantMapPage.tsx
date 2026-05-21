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
    <div className="flex min-h-[calc(100svh-5rem)] flex-col pb-4">
      <PageHeader
        title="지도 탐색"
        subtitle="주변 맛집 위치"
        action={
          <Link
            to="/restaurants/search"
            className="text-xs font-medium text-orange-600"
          >
            필터
          </Link>
        }
      />

      <div className="px-4">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

        <MapMock
          restaurants={restaurants}
          selectedId={selected?.id}
          onSelect={setSelectedId}
          className="h-56 w-full"
        />

        <p className="mt-2 text-center text-[10px] text-gray-400">
          카카오/구글 맵 API 연동 전 · 더미 지도 UI
        </p>
      </div>

      {/* 하단 리스트 */}
      <div className="mt-4 flex-1 rounded-t-3xl border-t border-gray-200 bg-white px-4 pt-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <h2 className="mb-3 text-sm font-bold text-gray-900">
          주변 맛집 ({restaurants.length})
        </h2>

        {selected && (
          <button
            type="button"
            onClick={() => navigate(`/restaurants/${selected.id}`)}
            className="mb-3 w-full rounded-2xl border-2 border-orange-400 bg-orange-50 p-4 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selected.imageEmoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900">{selected.name}</p>
                <p className="text-xs text-gray-500">
                  {selected.category} · ★ {selected.rating} · {selected.distance}
                </p>
                <p className="mt-1 truncate text-xs text-orange-600">
                  탭하여 상세 보기 →
                </p>
              </div>
            </div>
          </button>
        )}

        <ul className="max-h-48 space-y-2 overflow-y-auto">
          {restaurants.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setSelectedId(r.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedId === r.id
                    ? 'bg-orange-50 font-medium text-orange-800'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{r.imageEmoji}</span>
                <span className="min-w-0 flex-1 truncate">{r.name}</span>
                <span className="shrink-0 text-xs text-gray-400">{r.distance}</span>
              </button>
            </li>
          ))}
        </ul>

        {restaurants.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            이 카테고리에 표시할 식당이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
