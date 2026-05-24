import { useState } from 'react';
import { isKakaoPlaceSearchConfigured, searchKakaoPlacesApi } from '../../api/kakaoPlaces';
import type { SchedulePlacePayload } from '../../types/place';
import Button from '../ui/Button';

type KakaoPlaceSearchProps = {
  onAdd: (place: SchedulePlacePayload) => Promise<void> | void;
  disabled?: boolean;
  addLabel?: string;
};

export default function KakaoPlaceSearch({
  onAdd,
  disabled = false,
  addLabel = '일정에 추가',
}: KakaoPlaceSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SchedulePlacePayload[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const configured = isKakaoPlaceSearchConfigured();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    setResults([]);
    try {
      const places = await searchKakaoPlacesApi(query);
      setResults(places);
      if (places.length === 0) {
        setError('검색 결과가 없습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색에 실패했습니다.');
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (place: SchedulePlacePayload) => {
    setAddingId(place.apiId);
    setError(null);
    try {
      await onAdd(place);
      setResults((prev) => prev.filter((p) => p.apiId !== place.apiId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '추가에 실패했습니다.');
    } finally {
      setAddingId(null);
    }
  };

  if (!configured) {
    return (
      <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
        카카오 장소 검색을 쓰려면 <code className="font-mono">VITE_KAKAO_REST_API_KEY</code>를
        .env에 넣어 주세요. (백엔드 REST API 키와 동일)
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">
        카카오에서 검색한 장소는 「{addLabel}」 시 우리 DB에 저장된 뒤 일정에 연결됩니다.
      </p>
      <div className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="예: 해운대 국밥, 강남 파스타"
          disabled={disabled || searching}
          className="flex-1 rounded-xl border border-brand-light bg-cream px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={disabled || searching || !query.trim()}
          className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {searching ? '검색 중' : '검색'}
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}

      <ul className="max-h-56 space-y-2 overflow-y-auto">
        {results.map((place) => (
          <li
            key={place.apiId}
            className="flex items-start justify-between gap-2 rounded-xl border border-brand-light bg-cream p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{place.name}</p>
              <p className="mt-0.5 truncate text-[10px] text-muted">
                {place.roadAddress || place.address || '주소 없음'}
              </p>
              {place.category && (
                <p className="mt-0.5 text-[10px] text-subtle">{place.category}</p>
              )}
            </div>
            <Button
              className="shrink-0 !px-3 !py-2 text-xs"
              disabled={disabled || addingId === place.apiId}
              onClick={() => handleAdd(place)}
            >
              {addingId === place.apiId ? '추가 중' : addLabel}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
