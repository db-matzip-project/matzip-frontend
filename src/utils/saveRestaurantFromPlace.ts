import axios from 'axios';
import {
  getAccessToken,
  getApiErrorMessage,
  getImportKakaoErrorMessage,
} from '../api/client';
import {
  findRestaurantByApiIdApi,
  importKakaoRestaurantsApi,
} from '../api/restaurants';
import {
  addScheduleItemFromPlaceApi,
} from '../api/schedules';
import type { ApiRestaurant, ScheduleDetail } from '../api/types';
import type { SchedulePlacePayload } from '../types/place';

type SaveRestaurantFromPlaceOptions = {
  scheduleId?: number;
  memo?: string;
};

function pickRestaurantFromDetail(
  detail: ScheduleDetail,
  placeApiId: string,
): ApiRestaurant | null {
  const match =
    detail.items.find((item) => item.restaurant.apiId === placeApiId) ??
    detail.items.at(-1);
  return match?.restaurant ?? null;
}

async function saveViaImportKakao(place: SchedulePlacePayload): Promise<ApiRestaurant> {
  const importRes = await importKakaoRestaurantsApi({
    query: place.name.trim(),
    x: place.longitude,
    y: place.latitude,
    radius: 500,
    page: 1,
    size: 15,
  });

  if (importRes.savedCount === 0 && importRes.kakaoResultCount === 0) {
    throw new Error(
      '주변에서 저장할 장소를 찾지 못했습니다. 다른 검색어로 다시 시도해 주세요.',
    );
  }

  const found = await findRestaurantByApiIdApi(place.apiId);
  if (found) return found;

  throw new Error(
    '저장은 되었을 수 있으나 목록에서 찾지 못했습니다. 「저장된 맛집」 탭에서 이름으로 다시 검색해 보세요.',
  );
}

/**
 * 카카오 장소 → DB 저장 후 식당 PK 반환
 * 1) scheduleId 있음 → 해당 일정에 from-place
 * 2) 검색·필터 → 식당 저장 전용 import/kakao
 */
export async function saveRestaurantFromPlace(
  place: SchedulePlacePayload,
  options?: SaveRestaurantFromPlaceOptions,
): Promise<ApiRestaurant> {
  if (!getAccessToken()) {
    throw new Error('로그인이 필요합니다. 로그인 후 다시 시도해 주세요.');
  }

  if (options?.scheduleId) {
    try {
      const detail = await addScheduleItemFromPlaceApi(options.scheduleId, {
        place,
        memo: options.memo,
      });
      const restaurant = pickRestaurantFromDetail(detail, place.apiId);
      if (restaurant) return restaurant;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        throw new Error(
          getApiErrorMessage(err, '로그인이 만료되었습니다. 다시 로그인해 주세요.'),
        );
      }
      throw new Error(getApiErrorMessage(err, '일정에 장소를 추가하지 못했습니다.'));
    }
    throw new Error('일정에 추가했으나 식당 정보를 찾지 못했습니다.');
  }

  try {
    return await saveViaImportKakao(place);
  } catch (importErr) {
    if (axios.isAxiosError(importErr) && importErr.response?.status === 401) {
      throw new Error(
        getApiErrorMessage(importErr, '로그인이 만료되었습니다. 다시 로그인해 주세요.'),
      );
    }
    throw new Error(getImportKakaoErrorMessage(importErr));
  }
}
