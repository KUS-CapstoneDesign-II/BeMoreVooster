# BeMore Development Guidelines

## Principles
- 안전성 우선, 단계적 구현, DRY, 단순성, 가독성
- Clean Architecture: App(UI) → API(Hono) → Domain → Infra 단방향
- 테스트 우선(TDD 지향), 형상 관리 원칙(작은 PR, 명확한 커밋)

## Branch & Commit
- 브랜치: feature/*, bugfix/*, refactor/*
- 커밋: 48자 이내 요약 + 상세 본문(필요 시)
- PR: 목적/변경사항/테스트 방법/리스크/롤백 계획 포함

## Coding
- 타입 명시(공개 API), 의미 있는 네이밍, 조기 반환, 2~3단 조건 중첩 제한
- 에러는 상위에서 의미 있게 처리, 불필요한 try/catch 금지
- 주석은 "왜"를 설명, 불필요한 주석/주석 처리 코드 금지

## UI
- shadcn/ui + Tailwind, 팔레트/토큰 준수
- 반응형 우선, 접근성 검사(포커스 링/키보드 내비/콘트라스트)
- i18n: SSR 안전(초기 값 고정, useEffect로 브라우저 상태 반영)

## Auth & State
- 세션/쿠키 조작은 Route Handler 또는 Middleware에서만
- 클라이언트는 Supabase Browser Client, 서버는 Server Client 사용
- 사용자 표시명: user_metadata.nickname 우선 → 이메일

## Storage & Profile
- 아바타: Storage "avatars" 버킷(public read), 업로드 후 public URL을 user_metadata.avatar_url에 저장
- 즉시 미리보기: URL.createObjectURL + localStorage(Data URL)
- 버킷명은 .env(NEXT_PUBLIC_AVATAR_BUCKET)로 관리

## Recording Flow
- 1단계: UI-only(권한→프리뷰→타이머→검토→제출 스텁)
- 2단계: 업로드→큐→모의 분석→대시보드 차트 연결
- 3단계: 실제 분석 파이프라인 연결(Edge Functions/Queue)

## Dashboard
- 모의 타임시리즈로 차트 구성 후, API 연동 시 스냅샷 주입
- 기간 필터와 전역 상태 동기화(필요 시 URL 쿼리 사용)

## API & Security
- Hono 라우트: 입력 검증(zod), 인증 체크, 명확한 오류 응답
- DB: RLS 필수, 최소 권한, Storage 오브젝트 소유자 정책
- 비밀키: 서버 전용, 로테이션 정책, 클라이언트 비노출

## Observability & QA
- 로깅: 구조화 로그, 중요 경계에서 컨텍스트 포함
- 모니터링: Sentry, 지표(에러율/지연시간/스루풋)
- 테스트: 유닛/통합/E2E(Playwright), a11y(axe), Lighthouse

## CI/CD
- CI: lint/type/test, 프리뷰 배포, Supabase 마이그레이션 체크
- CD: main 병합 시 Vercel 배포, 환경 별 변수 구분

## Definition of Done
- UI/기능 동작 + 접근성 기본 충족
- 테스트/린트/타입/빌드 통과, 로깅/오류 처리 점검
- 문서(README/가이드/주석) 갱신, 스크린샷 또는 데모 링크
