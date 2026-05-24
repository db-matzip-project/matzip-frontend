# 프론트 ↔ 백엔드 연동 핸드오프 (2026-05)

**Swagger:** https://unthread-book-salvation.ngrok-free.dev/swagger-ui/index.html

> 백엔드 담당자: **`docs/BACKEND_환경변수_안내.md`** 참고 (`VITE_*`는 프론트 전용, 백엔드 repo에서 지도 안 뜨는 이유 설명)

## 환경 변수 (.env / .env.local)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_PROXY_TARGET=http://localhost:8080
VITE_KAKAO_MAP_APP_KEY=<카카오 JavaScript 키>
```

- ngrok 테스트 시 `VITE_API_*` 만 현재 URL로 교체
- `JWT_SECRET`, `KAKAO_REST_API_KEY` → **백엔드 서버 전용** (프론트 저장소에 넣지 않음)

## 인증

- `Authorization: Bearer {accessToken}`
- 비밀번호 최소 **6자** (가입/로그인 UI와 동일)
- 카카오 **키워드 검색**: `VITE_KAKAO_REST_API_KEY` (프론트 직접 호출)
- **장소 DB 저장 (from-place)**: `POST /api/v1/schedules/{scheduleId}/items/from-place` 만 사용 (JWT 필수)
- **검색·필터 「저장하고 보기」**: 임시 일정 생성 → `POST .../schedules/{id}/items/from-place` → 일정 삭제 (import/kakao 는 폴백)
- ~~`/api/v1/restaurants/from-place`~~ 백엔드 미제공 — 호출하지 않음

## 대시보드 · 분석 (Swagger)

- `GET /api/v1/dashboard/me` (없으면 `/dashboard/stats/me` → `/dashboard/stats` 순 fallback)
- `GET /api/v1/analytics/similar-users/top-restaurants/me` (없으면 `/top-restaurants`)
- 홈 「맞춤 추천」: 대시보드 `similarTasteTopRestaurants` + 식당 상세 조회

## 일정 · 카카오 장소 (Lazy)

- `POST /api/v1/schedules` — `restaurantIds` 로 생성 시 한 번에 등록 (첫 항목 메모 있으면 기존처럼 items API)

- 카카오 검색: 프론트 `VITE_KAKAO_REST_API_KEY` → 키워드 검색 API
- 일정 추가: `POST /api/v1/schedules/{id}/items/from-place` (`place.apiId`, `name`, `latitude`, `longitude` 필수)
- 기존 DB 식당: `POST .../items` + `restaurantId`

## 식당·리뷰 API (Swagger 기준)

### category (restaurant-controller)

| 위치 | Swagger 타입 | 프론트 |
|------|----------------|--------|
| `GET /restaurants?category=` | string | `한식` 등 (`RESTAURANT_CATEGORY_VALUES`) |
| 응답 `Restaurant.category` | string | 카드/상세 그대로 표시 |
| `POST /schedules/{id}/items/from-place` → `place.category` | string | 카카오 `category_name` 전달 → **백엔드에서 6종으로 정규화** |

백엔드 저장 시 `한식|일식|중식|양식|채식|디저트` 로 정규화. `GET ?category=` 는 위 값 **정확히** 매칭 (레거시 데이터는 마이그레이션 전까지 일부 어긋날 수 있음).

### 기타

- `GET /restaurants` — `minRating`, `sortBy` (`rating` | `reviews` | `distance` …), `tasteSimilar`, bounds
- 정렬: **`sortBy`만 전송** (있으면 `sortBy` 우선, 없을 때만 `sort` — Swagger `sort`는 레거시 호환)
- `GET/POST/DELETE /restaurants/{id}/reviews` — 리뷰 목록·업서트(201)·삭제(204)
- **`GET /api/v1/users/me/reviews`** — 마이페이지 「내 리뷰」(최근 수정 순, `restaurantName` 포함) ✅
- `POST /route/optimal-order` — `{ restaurantIds, startRestaurantId? }` → 일정 생성 전 동선 미리보기
- `POST /restaurants/import/kakao` — 검색 탭 저장·일괄 수집 / 일정 추가는 `schedules/.../items/from-place`

## API 변경 (취향)

- `GET /api/v1/preferences/me`: 응답에 `weight` 없음 (`preferenceId`, `code`, `displayName`만)
- `PUT /api/v1/preferences/me`: `{ "preferenceIds": number[] }` 만 전송 (프론트 `updateMyPreferencesApi` 동일)

## 재테스트 체크리스트

- [ ] signup / login
- [ ] schedule PATCH (title만 / travelDate만)
- [ ] `GET /restaurants?category=한식&sort=reviewCount,desc`
- [ ] `GET /restaurants?sort=distance,asc` + minLat/maxLat/minLng/maxLng
- [ ] rating/reviewCount/lat/lng null 없이 카드 렌더링
- [ ] 지도 탭 카카오맵 + 카테고리 필터

## 프론트 반영 요약 (Cursor)

- REST API 전 도메인 연동, 더미 데이터 제거
- Vite 프록시, Bearer 토큰, 카카오맵 JS SDK
- ngrok 하드코딩 제거 → localhost:8080 기본
- distance 정렬 시 서울 bounds 기본 전달
