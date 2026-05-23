# 맛집탐방 (Matzip)

> 미식 중심의 맞춤형 여행 및 식도락 동선 플래너

취향에 맞는 식당을 찾고, 나만의 맛집 투어 일정을 만들며, 효율적인 방문 동선까지 한 번에 설계할 수 있는 웹 서비스입니다.

---

## 주요 기능

### 1. 사용자 (User)

| 기능 | 설명 |
|------|------|
| 회원가입 | 이름, 아이디, 비밀번호, 전화번호로 가입 |
| 로그인 / 로그아웃 | 세션 기반 인증 |
| 사용자 정보 조회 | 프로필 및 계정 정보 확인 |
| 취향 온보딩 | 음식 취향 정보 저장 → 맞춤 식당 추천·검색에 활용 |

### 2. 식당 조회 및 검색 (Restaurant)

| 기능 | 설명 |
|------|------|
| 식당 목록 / 상세 조회 | 카카오맵·구글 지도 API 기반 수집 정보 표시 |
| 카테고리별 검색 | 음식 종류·태그 등으로 탐색 |
| 조건 기반 필터링 | 평점, 위치, **입맛이 비슷한 사용자가 방문한 식당** 등 |
| 지도 표시 | 지도 위 식당 위치 마커 |

### 3. 여행 일정 관리 (Schedule)

| 기능 | 설명 |
|------|------|
| 일정 CRUD | 생성 · 목록 · 상세 · 수정 · 삭제 |
| 다중 일정 | 한 사용자가 여러 맛집 투어 일정 보유 |

### 4. 일정–식당 연결

| 기능 | 설명 |
|------|------|
| 식당 추가 / 삭제 | 일정에 원하는 식당 담기·빼기 |
| 방문 순서 저장 | 일정 내 식당 방문 순서 관리 |

### 5. 동선 최적화

| 기능 | 설명 |
|------|------|
| 거리 계산 | 선택한 식당들 간 이동 거리 산출 |
| 최적 순서 추천 | 더 효율적인 방문 순서 제안 |
| 동선 시각화 | 이동 경로를 화면에 표시 |

### 6. 일정 편집

| 기능 | 설명 |
|------|------|
| 방문 순서 변경 | 드래그 앤 드롭 등으로 순서 직접 수정 |
| DB 반영 | 변경된 순서 저장 |
| 예외 처리 | 수정·삭제 시 유효성 검증 |

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React 19, TypeScript |
| Build | Vite 8 |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| HTTP | Axios |
| UI/UX | @dnd-kit (일정 순서 변경) |

---

## 시작하기

### 요구 사항

- Node.js 18+
- npm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/db-matzip-project/matzip-frontend.git
cd matzip-frontend

# 의존성 설치
npm install

# API 서버 URL 설정 (.env.example 참고)
cp .env.example .env

# 개발 서버 실행
npm run dev
```

### 환경 변수

| 변수 | 설명 |
|------|------|
| `VITE_API_BASE_URL` | 백엔드 API 베이스 URL (ngrok 등) |

로그인 후 `accessToken`을 `Authorization: Bearer {accessToken}` 형식으로 전송합니다.

브라우저에서 터미널에 표시된 주소(기본: `http://localhost:5173`)로 접속합니다.

### 기타 스크립트

```bash
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint 검사
```

---

## 프로젝트 구조

```
src/
├── pages/
│   ├── User/          # 회원가입, 로그인, 온보딩, 프로필, 홈
│   ├── Restaurant/    # 목록, 상세, 검색, 지도
│   └── Schedule/      # 일정 CRUD, 편집
├── components/        # 레이아웃, UI, 도메인 컴포넌트
├── context/           # Auth, Schedule 전역 상태
├── types/             # User, Restaurant, Schedule 타입
├── utils/             # 필터, 추천, 동선 계산
└── data/              # 개발용 더미 데이터
```

---

## 관련 저장소

| 저장소 | 역할 |
|--------|------|
| [matzip-frontend](https://github.com/db-matzip-project/matzip-frontend) | 프론트엔드 (본 저장소) |
| 백엔드 API | `db-matzip-project` 조직 내 백엔드 레포 |

---

## 개발 현황

**User · Restaurant · Schedule** 3개 도메인 UI가 백엔드 REST API(`/api/v1/*`)와 연동되어 있습니다. 인증, 취향, 식당 조회, 일정 CRUD, 동선(거리) API를 사용합니다.
