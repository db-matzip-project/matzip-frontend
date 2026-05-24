import axios from 'axios';
import { getApiErrorMessage } from '../api/client';
import {
  findRestaurantByApiIdApi,
  importKakaoRestaurantsApi,
  upsertRestaurantFromPlaceApi,
} from '../api/restaurants';
import type { ApiRestaurant } from '../api/types';
import type { SchedulePlacePayload } from '../types/place';

/** 카카오 장소 → DB 저장 후 식당 PK 반환 */
export async function saveRestaurantFromPlace(
  place: SchedulePlacePayload,
): Promise<ApiRestaurant> {
  try {
    return await upsertRestaurantFromPlaceApi(place);
  } catch (err) {
    if (!axios.isAxiosError(err) || err.response?.status !== 404) {
      throw new Error(getApiErrorMessage(err, '식당을 저장하지 못했습니다.'));
    }
  }

  await importKakaoRestaurantsApi({
    query: place.name,
    x: place.longitude,
    y: place.latitude,
    radius: 500,
    size: 15,
  });

  const found = await findRestaurantByApiIdApi(place.apiId);
  if (found) return found;

  throw new Error(
    '저장은 되었을 수 있으나 목록에서 찾지 못했습니다. 「DB 맛집」 탭에서 이름으로 다시 검색해 보세요.',
  );
}
