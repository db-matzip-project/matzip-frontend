# 프론트 ↔ 백엔드 연동 핸드오프 (2026-05)

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
