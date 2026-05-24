import type { SchedulePlacePayload } from '../types/place';

type KakaoPlaceDocument = {
  id: string;
  place_name: string;
  category_name?: string;
  address_name?: string;
  road_address_name?: string;
  phone?: string;
  x: string;
  y: string;
};

type KakaoKeywordResponse = {
  documents: KakaoPlaceDocument[];
  meta?: { is_end?: boolean; pageable_count?: number };
};

const REST_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY ?? '';

export function isKakaoPlaceSearchConfigured(): boolean {
  return REST_KEY.length > 0;
}

export function mapKakaoDocumentToPlace(doc: KakaoPlaceDocument): SchedulePlacePayload | null {
  const latitude = Number(doc.y);
  const longitude = Number(doc.x);
  if (!doc.id || !doc.place_name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }
  return {
    apiId: doc.id,
    name: doc.place_name,
    category: doc.category_name,
    address: doc.address_name,
    roadAddress: doc.road_address_name || undefined,
    phone: doc.phone || undefined,
    latitude,
    longitude,
  };
}

export async function searchKakaoPlacesApi(query: string, page = 1, size = 15) {
  const trimmed = query.trim();
  if (!trimmed) return [];
  if (!REST_KEY) {
    throw new Error(
      '카카오 장소 검색 키가 없습니다. .env에 VITE_KAKAO_REST_API_KEY를 설정해 주세요.',
    );
  }

  const url = new URL('https://dapi.kakao.com/v2/local/search/keyword.json');
  url.searchParams.set('query', trimmed);
  url.searchParams.set('page', String(page));
  url.searchParams.set('size', String(size));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${REST_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`카카오 장소 검색 실패 (${res.status})`);
  }

  const data = (await res.json()) as KakaoKeywordResponse;
  return data.documents
    .map(mapKakaoDocumentToPlace)
    .filter((p): p is SchedulePlacePayload => p !== null);
}
