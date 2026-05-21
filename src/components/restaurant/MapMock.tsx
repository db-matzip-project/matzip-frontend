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
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 ${className}`}
      role="img"
      aria-label="지도 영역 (API 연동 전 모형)"
    >
      {/* 격자 패턴 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(#9ca3af 1px, transparent 1px),
            linear-gradient(90deg, #9ca3af 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />
      {/* 도로 느낌 */}
      <div className="absolute left-[20%] top-0 h-full w-3 rotate-12 bg-gray-400/40" />
      <div className="absolute left-0 top-[45%] h-3 w-full bg-gray-400/40" />

      <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-medium text-gray-600 shadow">
        지도 미리보기 · API 연동 예정
      </div>

      {/* 현재 위치 */}
      <div
        className="absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 shadow-lg ring-4 ring-blue-200"
        style={{ left: '50%', top: '50%' }}
        title="내 위치"
      >
        <span className="h-2 w-2 rounded-full bg-white" />
      </div>

      {/* 마커 */}
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
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-sm shadow-md ${
                isSelected ? 'bg-orange-500' : 'bg-red-500'
              }`}
            >
              {r.imageEmoji}
            </span>
            {isSelected && (
              <span className="mt-0.5 max-w-[80px] truncate rounded bg-gray-900 px-1.5 py-0.5 text-[9px] font-medium text-white">
                {r.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
