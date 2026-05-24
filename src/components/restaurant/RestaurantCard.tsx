import { Link } from 'react-router-dom';
import type { Restaurant } from '../../types/restaurant';

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="flex gap-3 rounded-2xl border border-brand-light bg-cream p-3.5 transition-colors hover:border-brand-muted hover:bg-brand-soft"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-3xl">
        {restaurant.imageEmoji}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="truncate font-semibold text-ink">{restaurant.name}</h3>
        <p className="text-xs text-muted">
          {restaurant.category} · {restaurant.distance}
        </p>
        <div className="flex items-center gap-1 text-xs">
          <span className="font-semibold text-brand">★ {restaurant.rating ?? 0}</span>
          <span className="text-subtle">
            ({(restaurant.reviewCount ?? 0).toLocaleString()})
          </span>
        </div>
      </div>
    </Link>
  );
}
