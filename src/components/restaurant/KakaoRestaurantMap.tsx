import { useEffect, useMemo, useRef } from 'react';
import { CustomOverlayMap, Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import type { Restaurant } from '../../types/restaurant';

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };
const MAP_HEIGHT_PX = 256;

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
    !(r.latitude === 0 && r.longitude === 0) &&
    r.latitude >= 33 &&
    r.latitude <= 39 &&
    r.longitude >= 124 &&
    r.longitude <= 132
  );
}

function averageCenter(restaurants: Restaurant[]) {
  const valid = restaurants.filter(hasValidCoords);
  if (valid.length === 0) return DEFAULT_CENTER;
  const sum = valid.reduce(
    (acc, r) => ({
      lat: acc.lat + r.latitude!,
      lng: acc.lng + r.longitude!,
    }),
    { lat: 0, lng: 0 },
  );
  return {
    lat: sum.lat / valid.length,
    lng: sum.lng / valid.length,
  };
}

export default function KakaoRestaurantMap({
  restaurants,
  selectedId,
  onSelect,
  className = '',
}: KakaoRestaurantMapProps) {
  const appkey = import.meta.env.VITE_KAKAO_MAP_APP_KEY ?? '';
  const mapRef = useRef<kakao.maps.Map | null>(null);

  const [loading, loadError] = useKakaoLoader({
    appkey,
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

  useEffect(() => {
    if (loading || !mapRef.current) return;
    const timer = window.setTimeout(() => {
      mapRef.current?.relayout();
    }, 200);
    return () => window.clearTimeout(timer);
  }, [loading, center.lat, center.lng, mappable.length]);

  if (!appkey) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-brand-light bg-brand-soft text-sm text-muted ${className}`}
        style={{ height: MAP_HEIGHT_PX }}
      >
        .env에 VITE_KAKAO_MAP_APP_KEY를 설정해 주세요.
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-brand-light bg-brand-soft text-sm text-muted ${className}`}
        style={{ height: MAP_HEIGHT_PX }}
      >
        카카오맵 불러오는 중...
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-600 ${className}`}
        style={{ minHeight: MAP_HEIGHT_PX }}
      >
        <p className="font-semibold">카카오맵을 불러오지 못했습니다.</p>
        <p className="text-xs leading-relaxed text-red-500">
          카카오 개발자 콘솔 → 앱 → <strong>「지도」 서비스 활성화</strong>, JavaScript 키에{' '}
          <strong>http://localhost:5173</strong> 등 사이트 도메인 등록이 필요합니다.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden rounded-2xl border border-brand-light shadow-sm"
        style={{ width: '100%', height: MAP_HEIGHT_PX }}
      >
        <Map
          center={center}
          isPanto={!!selectedId}
          style={{ width: '100%', height: `${MAP_HEIGHT_PX}px` }}
          level={selectedId ? 4 : mappable.length > 1 ? 5 : 6}
          onCreate={(map) => {
            mapRef.current = map;
            window.setTimeout(() => map.relayout(), 100);
          }}
        >
          {mappable.map((r) => (
            <MapMarker
              key={r.id}
              position={{ lat: r.latitude!, lng: r.longitude! }}
              clickable
              onClick={() => onSelect?.(r.id)}
              zIndex={selectedId === r.id ? 10 : 1}
            />
          ))}
          {selected && (
            <CustomOverlayMap
              position={{ lat: selected.latitude!, lng: selected.longitude! }}
              yAnchor={2.4}
              xAnchor={0.5}
              zIndex={20}
            >
              <div className="whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] font-medium text-white shadow">
                {selected.name}
              </div>
            </CustomOverlayMap>
          )}
        </Map>
        {mappable.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-cream/85 px-4 text-center text-sm text-muted">
            표시할 좌표가 없습니다. (국내 좌표만 표시)
          </div>
        )}
      </div>
    </div>
  );
}
