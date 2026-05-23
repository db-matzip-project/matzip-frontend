import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import RestaurantFilterBar from '../../components/restaurant/RestaurantFilterBar';
import PageHeader from '../../components/ui/PageHeader';
import Chip from '../../components/ui/Chip';
import { useRestaurantList } from '../../hooks/useRestaurants';
import {
  DEFAULT_FILTERS,
  filterRestaurants,
  type RestaurantFilterState,
} from '../../utils/filterRestaurants';

export default function RestaurantSearchPage() {
  const [filters, setFilters] = useState<RestaurantFilterState>(DEFAULT_FILTERS);
  const [keywordInput, setKeywordInput] = useState('');
  const [tasteSimilar, setTasteSimilar] = useState(false);

  const apiParams = useMemo(
    () => ({
      category: filters.category !== '전체' ? filters.category : undefined,
      minRating: filters.minRating > 0 ? filters.minRating : undefined,
      sort:
        filters.sortBy === 'reviews'
          ? 'reviewCount,desc'
          : filters.sortBy === 'distance'
            ? 'distance,asc'
            : 'rating,desc',
      tasteSimilar,
      size: 50,
    }),
    [filters.category, filters.minRating, filters.sortBy, tasteSimilar],
  );

  const { restaurants: apiRestaurants, loading, error } = useRestaurantList(apiParams);

  const updateFilters = (patch: Partial<RestaurantFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const applyKeyword = () => {
    updateFilters({ keyword: keywordInput });
  };

  const restaurants = useMemo(
    () => filterRestaurants(apiRestaurants, filters),
    [apiRestaurants, filters],
  );

  const resetFilters = () => {
    setKeywordInput('');
    setTasteSimilar(false);
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="pb-4">
      <PageHeader title="검색·필터" backTo="/restaurants" />

      <div className="space-y-4 px-4 py-4">
        <div className="flex gap-2">
          <input
            type="search"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyKeyword()}
            placeholder="식당명, 주소, 설명 검색"
            className="flex-1 rounded-xl border border-brand-light bg-brand-soft px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
          />
          <button
            type="button"
            onClick={applyKeyword}
            className="shrink-0 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            검색
          </button>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-muted">추천 필터</p>
          <Chip
            label="입맛 비슷한 사용자 맛집"
            selected={tasteSimilar}
            onClick={() => setTasteSimilar((v) => !v)}
          />
        </div>

        {filters.keyword && (
          <p className="text-xs text-muted">
            검색어: <span className="font-medium text-ink">"{filters.keyword}"</span>
            <button
              type="button"
              onClick={() => {
                setKeywordInput('');
                updateFilters({ keyword: '' });
              }}
              className="ml-2 text-brand"
            >
              지우기
            </button>
          </p>
        )}

        <RestaurantFilterBar
          filters={filters}
          onChange={updateFilters}
          resultCount={restaurants.length}
        />

        <button
          type="button"
          onClick={resetFilters}
          className="w-full rounded-xl border border-dashed border-brand-light py-2 text-sm text-muted hover:bg-brand-soft"
        >
          필터 초기화
        </button>
      </div>

      {error && (
        <p className="mx-4 mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="flex flex-col gap-3 px-4">
        {loading ? (
          <div className="rounded-2xl bg-brand-soft py-12 text-center text-sm text-muted">
            검색 중...
          </div>
        ) : restaurants.length > 0 ? (
          restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} showMatch={false} />
          ))
        ) : (
          <div className="rounded-2xl bg-brand-soft py-12 text-center">
            <p className="text-sm font-medium text-brand">검색 결과가 없습니다</p>
            <p className="mt-1 text-xs text-muted">필터 조건을 변경해 보세요</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 text-sm font-medium text-brand"
            >
              전체 보기
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 px-4">
        <Link
          to="/restaurants/map"
          className="block rounded-2xl border border-brand-light bg-brand-soft py-3 text-center text-sm font-medium text-brand hover:bg-brand-soft"
        >
          지도에서 위치 확인
        </Link>
      </div>
    </div>
  );
}
