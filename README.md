# 순대와따

토스 인앱용 비게임 미니앱 초안입니다.

## 포함된 범위

- 인트로 진입 화면
- 내 주변 트럭 지도형 캔버스
- 트럭 상세 BottomSheet
- 실시간 제보 반영
- 신규 등록 요청
- 정보 수정 요청
- Supabase 우선, localStorage fallback 데이터 저장 구조

## 데이터 구조

- 최종 트럭 DB: `supabase/schema.sql`, `src/lib/repository.ts`
- 실시간 제보 DB: `supabase/schema.sql`, `src/lib/repository.ts`
- 등록/수정 요청 DB: `supabase/schema.sql`, `src/lib/repository.ts`

## 실행 전 참고

- `.env.example`를 복사해 `.env`를 만들고 Supabase URL/anon key를 넣으면 실제 DB를 사용합니다.
- Supabase가 없으면 `localStorage` fallback으로 흐름을 검증합니다.
- 실제 지도 SDK는 아직 연결하지 않았고, 심사 친화적인 지도형 캔버스로 먼저 구현했습니다.
- 앱인토스 제출 전에는 실제 위치 권한/지도 SDK/서버 API 연결이 추가로 필요합니다.
