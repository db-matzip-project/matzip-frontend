import type { Restaurant } from '../../types/restaurant';

type MapMockProps = {
  restaurants: Restaurant[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
};

export default function MapMock({
  restaurants,
  selectedId,
  onSelect,
  className = '',
}: MapMockProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-brand-light bg-brand-soft ${className}`}
      role="img"
      aria-label="지도 영역 (API 연동 전 모형)"
    >
      <div className="absolute left-3 top-3 rounded-lg bg-cream px-2 py-1 text-[10px] font-medium text-muted ring-1 ring-brand-light">
        지도 미리보기 · API 연동 예정
      </div>

      <div
        className="absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand ring-2 ring-brand-light"
        style={{ left: '50%', top: '50%' }}
        title="내 위치"
      >
        <span className="h-2 w-2 rounded-full bg-white" />
      </div>

      {restaurants.map((r) => {
        const isSelected = selectedId === r.id;
        return (
          <button
            key={r.id}
            type="button"
            title={r.name}
            onClick={() => onSelect?.(r.id)}
            className={`absolute z-20 flex -translate-x-1/2 -translate-y-full flex-col items-center transition-transform ${
              isSelected ? 'scale-125' : 'hover:scale-110'
            }`}
            style={{ left: `${r.mapPosition.x}%`, top: `${r.mapPosition.y}%` }}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream text-sm ${
                isSelected ? 'bg-brand text-white' : 'bg-brand-light'
              }`}
            >
              {r.imageEmoji}
            </span>
            {isSelected && (
              <span className="mt-0.5 max-w-[80px] truncate rounded-md bg-ink px-1.5 py-0.5 text-[9px] font-medium text-white">
                {r.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
