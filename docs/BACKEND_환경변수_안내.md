# 백엔드 개발자용 — 환경 변수 / 카카오맵 안내

## 한 줄 요약

**`VITE_` 로 시작하는 변수는 프론트(React) 전용입니다.**  
백엔드(Spring) 프로젝트 폴더에 같은 파일을 두어도 **읽히지 않고, 지도도 뜨지 않습니다.**

---

## 왜 백엔드 repo에서 카카오맵이 안 뜨나요?

카카오맵 화면은 **브라우저에서 돌아가는 프론트엔드** 기능입니다.

| 구분 | 기술 | 카카오 키 종류 |
|------|------|----------------|
| **프론트** (`matzip-frontend`) | React + Vite + `react-kakao-maps-sdk` | **JavaScript 키** (`VITE_KAKAO_MAP_APP_KEY`) |
| **백엔드** (`matzip-backend` 등) | Spring Boot | **REST API 키** (`KAKAO_REST_API_KEY`) — 장소 검색·DB import용 |

백엔드에서 Swagger만 보고 있으면 지도 UI는 없습니다.  
지도 확인은 **프론트 `npm run dev` → 브라우저 → 하단 「지도」 탭** 입니다.

---

## 어디에 무엇을 넣나요?

### 프론트 프로젝트 루트 (`package.json`, `vite.config.ts` 있는 폴더)

파일: `.env` 또는 `.env.local` (git에 올리지 않음)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_PROXY_TARGET=http://localhost:8080
VITE_KAKAO_MAP_APP_KEY=<카카오 JavaScript 키>
```

- `npm run dev` **재시작** 후 반영
- ngrok 쓸 때만 위 URL을 ngrok 주소로 바꿈

### 백엔드 프로젝트

파일: `application.yml` 또는 백엔드 전용 `.env`

```properties
JWT_SECRET=...
KAKAO_REST_API_KEY=...   # REST API (import 등)
# DB, 서버 포트 등
```

**`VITE_` 접두사 변수는 백엔드에 넣지 마세요.**

---

## 프론트 ↔ 백엔드 연결 구조 (로컬)

```
브라우저 (localhost:5173)
    → /api/* 요청
    → Vite 프록시 (VITE_API_PROXY_TARGET)
    → Spring Boot (localhost:8080)
```

API 주소는 프론트 `.env`의 `VITE_API_PROXY_TARGET`으로만 결정됩니다.

---

## 카카오 개발자 콘솔 체크 (프론트 담당)

1. **지도(OPEN_MAP_AND_LOCAL)** 서비스 활성화
2. **JavaScript 키** → SDK 도메인에 `http://localhost:5173` 등 등록
3. REST API 키는 백엔드 import용 (지도 화면과 별개)

---

문의: 프론트 담당자 / `docs/TEAM_HANDOFF.md` 참고
