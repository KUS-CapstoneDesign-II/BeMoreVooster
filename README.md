<p align="center">
  <img alt="BeMore" src="public/easynext.png" width="120" />
</p>

# BeMore

BeMore는 주간 성찰 세션(얼굴·음성·텍스트)을 분석해 VAD 기반 감정 벡터와 CBT 피드백을 제공하는 감정 인사이트 서비스입니다. Gen‑Z/젊은 직장인이 스트레스를 줄이고 자기이해를 높이도록 돕습니다.

## 문서
- 제품 개요: `vooster-docs/prd.md`
- 아키텍처: `vooster-docs/architecture.md`
- 디자인 가이드: `vooster-docs/design-guide.md`
- 정보 구조(IA): `vooster-docs/ia.md`
- 단계별 가이드: `vooster-docs/step-by-step.md` (하단에 BeMore Development Guide 포함)
- 코드/클린 코드: `vooster-docs/clean-code.md`, `vooster-docs/guideline.md`

## 기술 스택
- Next.js 15, TypeScript, Tailwind CSS (v4)
- shadcn/ui, lucide-react
- Hono (API 라우팅), React Query
- Supabase (Auth/DB) — 로컬 UI 개발은 더미 env 사용 가능

## 개발 시작
```bash
npm install
npm run dev
# http://localhost:3000
```

환경 변수는 UI 개발 시 더미 값을 사용할 수 있습니다.
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-anon-key
```

## 주요 경로
- 공개: `/`, `/login`, `/signup`
- 보호: `/(protected)/dashboard`

## 현재 구현 현황
- 전역 테마/팔레트/타이포 설정 완료 (`tailwind.config.ts`, `src/app/globals.css`)
- 대시보드 UI 목업 구현(더미 데이터)
- 로그인/회원가입 UI 및 클라이언트 단 검증/스텁 제출

기여 가이드와 코드 스타일은 `vooster-docs/clean-code.md` 및 `vooster-docs/guideline.md`를 따릅니다.
