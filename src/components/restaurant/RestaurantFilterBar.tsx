import {
  PRICE_OPTIONS,
  RATING_OPTIONS,
  RESTAURANT_CATEGORIES,
  SORT_OPTIONS,
} from '../../constants/restaurantFilters';
import type { RestaurantFilterState } from '../../utils/filterRestaurants';
import Chip from '../ui/Chip';

type RestaurantFilterBarProps = {
  filters: RestaurantFilterState;
  onChange: (patch: Partial<RestaurantFilterState>) => void;
  resultCount: number;
};

export default function RestaurantFilterBar({
  filters,
  onChange,
  resultCount,
}: RestaurantFilterBarProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold text-muted">카테고리</p>
        <div className="flex flex-wrap gap-2">
          {RESTAURANT_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={filters.category === cat}
              onClick={() => onChange({ category: cat })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted">최소 평점</p>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map(({ value, label }) => (
            <Chip
              key={label}
              label={label}
              selected={filters.minRating === value}
              onClick={() => onChange({ minRating: value })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted">가격대</p>
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map(({ value, label }) => (
            <Chip
              key={label}
              label={label}
              selected={filters.priceRange === value}
              onClick={() => onChange({ priceRange: value })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted">정렬</p>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map(({ value, label }) => (
            <Chip
              key={value}
              label={label}
              selected={filters.sortBy === value}
              onClick={() => onChange({ sortBy: value })}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-muted">
        <span className="font-bold text-brand">{resultCount}</span>개 식당
      </p>
    </div>
  );
}
