import { DUMMY_RESTAURANTS } from '../../data/dummyRestaurants';

type RestaurantPickerProps = {
  selectedIds: string[];
  onToggle: (restaurantId: string) => void;
  excludeIds?: string[];
};

export default function RestaurantPicker({
  selectedIds,
  onToggle,
  excludeIds = [],
}: RestaurantPickerProps) {
  const available = DUMMY_RESTAURANTS.filter((r) => !excludeIds.includes(r.id));

  return (
    <ul className="max-h-64 space-y-2 overflow-y-auto">
      {available.map((r) => {
        const selected = selectedIds.includes(r.id);
        return (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onToggle(r.id)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                selected
                  ? 'border-brand bg-brand-soft'
                  : 'border-brand-light bg-cream hover:bg-brand-soft'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${
                  selected
                    ? 'border-brand bg-brand text-white'
                    : 'border-brand-light bg-brand-soft text-muted'
                }`}
              >
                {selected ? '✓' : ''}
              </span>
              <span className="text-xl">{r.imageEmoji}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{r.name}</p>
                <p className="text-xs text-muted">
                  {r.category} · ★ {r.rating}
                </p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
