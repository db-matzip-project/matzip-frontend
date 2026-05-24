import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import RestaurantFilterBar from '../../components/restaurant/RestaurantFilterBar';
import KakaoPlaceSearch from '../../components/schedule/KakaoPlaceSearch';
import PageHeader from '../../components/ui/PageHeader';
import Chip from '../../components/ui/Chip';
import { useRestaurantList } from '../../hooks/useRestaurants';
import { saveRestaurantFromPlace } from '../../utils/saveRestaurantFromPlace';
import {
  DEFAULT_FILTERS,
  filterRestaurants,
  type RestaurantFilterState,
} from '../../utils/filterRestaurants';
import { buildRestaurantListQuery } from '../../utils/restaurantSort';

type SearchMode = 'db' | 'kakao';

export default function RestaurantSearchPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SearchMode>('db');
  const [filters, setFilters] = useState<RestaurantFilterState>(DEFAULT_FILTERS);
  const [keywordInput, setKeywordInput] = useState('');
  const [tasteSimilar, setTasteSimilar] = useState(false);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const apiParams = useMemo(
    () => buildRestaurantListQuery(filters, { tasteSimilar, size: 50 }),
    [filters, tasteSimilar, listRefreshKey],
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

  const handleSaveKakaoPlace = async (place: Parameters<typeof saveRestaurantFromPlace>[0]) => {
    const saved = await saveRestaurantFromPlace(place);
    setListRefreshKey((k) => k + 1);
    navigate(`/restaurants/${saved.id}`);
  };

  return (
    <div className="pb-4">
      <PageHeader title="검색·필터" backTo="/restaurants" />

      <div className="border-b border-brand-light bg-surface px-4 py-3">
        <div className="flex gap-2">
          <Chip
            label="DB 맛집"
            selected={mode === 'db'}
            onClick={() => setMode('db')}
          />
          <Chip
            label="카카오 검색"
            selected={mode === 'kakao'}
            onClick={() => setMode('kakao')}
          />
        </div>
      </div>

      {mode === 'kakao' ? (
        <div className="space-y-4 px-4 py-4">
          <KakaoPlaceSearch
            addLabel="저장하고 보기"
            hint="카카오 장소를 DB에 저장한 뒤 상세로 이동합니다. (로그인 필요)"
            onAdd={handleSaveKakaoPlace}
          />
          <p className="text-center text-xs text-muted">
            이미 저장된 맛집은{' '}
            <button type="button" className="font-medium text-brand" onClick={() => setMode('db')}>
              DB 맛집
            </button>
            탭에서 검색하세요.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 px-4 py-4">
            <div className="flex gap-2">
              <input
                type="search"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyKeyword()}
                placeholder="식당명, 주소, 설명 검색 (DB에 있는 맛집)"
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
                <RestaurantCard key={r.id} restaurant={r} />
              ))
            ) : (
              <div className="rounded-2xl bg-brand-soft px-4 py-12 text-center">
                {tasteSimilar ? (
                  <>
                    <p className="text-sm font-medium text-brand">
                      입맛 비슷한 사용자 맛집이 없습니다
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      같은 나이대·매운맛 취향이 겹치는 사용자의 최근 일정에 포함된 맛집만
                      보여 줍니다. 조건에 맞는 사용자나 일정이 없으면 빈 목록이 정상입니다.
                    </p>
                    <button
                      type="button"
                      onClick={() => setTasteSimilar(false)}
                      className="mt-4 text-sm font-medium text-brand"
                    >
                      필터 해제하고 전체 검색
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-brand">검색 결과가 없습니다</p>
                    <p className="mt-1 text-xs text-muted">
                      DB에 없는 맛집은{' '}
                      <button
                        type="button"
                        className="font-medium text-brand"
                        onClick={() => setMode('kakao')}
                      >
                        카카오 검색
                      </button>
                      탭을 이용해 보세요.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-4 text-sm font-medium text-brand"
                    >
                      전체 보기
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}

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
