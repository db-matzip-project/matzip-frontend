import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import PageHeader from '../../components/ui/PageHeader';
import Chip from '../../components/ui/Chip';
import { RESTAURANT_CATEGORIES } from '../../constants/restaurantFilters';
import { DUMMY_RESTAURANTS } from '../../data/dummyRestaurants';
import {
  DEFAULT_FILTERS,
  filterRestaurants,
  type RestaurantFilterState,
} from '../../utils/filterRestaurants';

export default function RestaurantListPage() {
  const [category, setCategory] = useState<string>('전체');

  const filters: RestaurantFilterState = useMemo(
    () => ({ ...DEFAULT_FILTERS, category, sortBy: 'rating' }),
    [category],
  );

  const restaurants = useMemo(
    () => filterRestaurants(DUMMY_RESTAURANTS, filters),
    [filters],
  );

  return (
    <div className="pb-4">
      <PageHeader
        title="맛집 탐색"
        subtitle={`총 ${DUMMY_RESTAURANTS.length}곳`}
        action={
          <Link
            to="/restaurants/search"
            className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark"
          >
            검색·필터
          </Link>
        }
      />

      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {RESTAURANT_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={category === cat}
              onClick={() => setCategory(cat)}
            />
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between px-4">
        <p className="text-sm text-muted">
          <span className="font-bold text-ink">{restaurants.length}</span>개
          표시 중
        </p>
        <Link
          to="/restaurants/map"
          className="text-xs font-medium text-brand"
        >
          지도로 보기 →
        </Link>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {restaurants.length > 0 ? (
          restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} showMatch={false} />
          ))
        ) : (
          <div className="rounded-2xl bg-brand-soft py-12 text-center text-sm text-muted">
            해당 카테고리의 식당이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
