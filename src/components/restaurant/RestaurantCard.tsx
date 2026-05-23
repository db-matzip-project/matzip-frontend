import { Link } from 'react-router-dom';
import type { Restaurant } from '../../types/restaurant';

type RestaurantCardData = Restaurant & {
  matchScore?: number;
  matchReasons?: string[];
};

type RestaurantCardProps = {
  restaurant: RestaurantCardData;
  showMatch?: boolean;
};

const priceLabels = ['', '₩', '₩₩', '₩₩₩'];

export default function RestaurantCard({
  restaurant,
  showMatch = true,
}: RestaurantCardProps) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="flex gap-3 rounded-2xl border border-brand-light bg-cream p-3.5 transition-colors hover:border-brand-muted hover:bg-brand-soft"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-3xl">
        {restaurant.imageEmoji}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-ink">
            {restaurant.name}
          </h3>
          {showMatch && (restaurant.matchScore ?? 0) > 0 && (
            <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white">
              {restaurant.matchScore}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted">
          {restaurant.category} · {priceLabels[restaurant.priceRange]} ·{' '}
          {restaurant.distance}
        </p>
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold text-brand">★ {restaurant.rating ?? 0}</span>
          <span className="text-subtle">
            ({(restaurant.reviewCount ?? 0).toLocaleString()})
          </span>
        </div>
        {(restaurant.matchReasons?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1">
            {restaurant.matchReasons!.slice(0, 3).map((reason) => (
              <span
                key={reason}
                className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] text-ink"
              >
                {reason}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
