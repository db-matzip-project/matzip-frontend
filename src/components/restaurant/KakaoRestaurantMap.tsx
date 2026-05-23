import { useMemo } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import type { Restaurant } from '../../types/restaurant';

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

type KakaoRestaurantMapProps = {
  restaurants: Restaurant[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
};

function hasValidCoords(r: Restaurant) {
  return (
    r.latitude != null &&
    r.longitude != null &&
    Number.isFinite(r.latitude) &&
    Number.isFinite(r.longitude) &&
    !(r.latitude === 0 && r.longitude === 0)
  );
}

function averageCenter(restaurants: Restaurant[]) {
  if (restaurants.length === 0) return DEFAULT_CENTER;
  const sum = restaurants.reduce(
    (acc, r) => ({
      lat: acc.lat + r.latitude!,
      lng: acc.lng + r.longitude!,
    }),
    { lat: 0, lng: 0 },
  );
  return {
    lat: sum.lat / restaurants.length,
    lng: sum.lng / restaurants.length,
  };
}

export default function KakaoRestaurantMap({
  restaurants,
  selectedId,
  onSelect,
  className = 'h-52 w-full',
}: KakaoRestaurantMapProps) {
  const appkey = import.meta.env.VITE_KAKAO_MAP_APP_KEY ?? '';

  const [loading, loadError] = useKakaoLoader({
    appkey,
    libraries: ['services'],
  });

  const mappable = useMemo(
    () => restaurants.filter(hasValidCoords),
    [restaurants],
  );

  const selected = useMemo(
    () => (selectedId ? mappable.find((r) => r.id === selectedId) : undefined),
    [mappable, selectedId],
  );

  const center = useMemo(() => {
    if (selected?.latitude != null && selected.longitude != null) {
      return { lat: selected.latitude, lng: selected.longitude };
    }
    return averageCenter(mappable);
  }, [selected, mappable]);

  if (!appkey) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-brand-light bg-brand-soft text-sm text-muted ${className}`}
      >
        .env에 VITE_KAKAO_MAP_APP_KEY를 설정해 주세요.
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-brand-light bg-brand-soft text-sm text-muted ${className}`}
      >
        카카오맵 불러오는 중...
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-600 ${className}`}
      >
        <p className="font-semibold">카카오맵을 불러오지 못했습니다.</p>
        <p className="text-xs leading-relaxed text-red-500">
          카카오 개발자 콘솔 → 앱(맛집탐방) →{' '}
          <strong>제품 설정에서 「지도」 서비스 활성화</strong>가 필요합니다.
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-2xl border border-brand-light shadow-sm ${className}`}>
      <Map
        center={center}
        isPanto={!!selectedId}
        style={{ width: '100%', height: '100%' }}
        level={selectedId ? 4 : mappable.length > 1 ? 5 : 6}
      >
        {mappable.map((r) => {
          const isSelected = selectedId === r.id;
          return (
            <MapMarker
              key={r.id}
              position={{ lat: r.latitude!, lng: r.longitude! }}
              title={r.name}
              clickable
              onClick={() => onSelect?.(r.id)}
              zIndex={isSelected ? 10 : 1}
            >
              {isSelected && (
                <div className="rounded-md bg-ink px-2 py-1 text-[10px] font-medium text-white shadow">
                  {r.name}
                </div>
              )}
            </MapMarker>
          );
        })}
      </Map>
      {mappable.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-cream/80 text-sm text-muted">
          좌표가 있는 식당이 없습니다.
        </div>
      )}
    </div>
  );
}
