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
      className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-3xl">
        {restaurant.imageEmoji}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-gray-900">
            {restaurant.name}
          </h3>
          {showMatch && (restaurant.matchScore ?? 0) > 0 && (
            <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
              {restaurant.matchScore}%
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {restaurant.category} · {priceLabels[restaurant.priceRange]} ·{' '}
          {restaurant.distance}
        </p>
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold text-amber-500">★ {restaurant.rating}</span>
          <span className="text-gray-400">
            ({restaurant.reviewCount.toLocaleString()})
          </span>
        </div>
        {(restaurant.matchReasons?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1">
            {restaurant.matchReasons!.slice(0, 3).map((reason) => (
              <span
                key={reason}
                className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
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
