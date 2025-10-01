# Product Requirement Document (PRD)

## 1. Overview
BeMore is a responsive web service that captures a user’s face, voice, and text in a single weekly reflection session, converts those multimodal signals into a VAD-based emotion vector, then delivers CBT-driven feedback and clear visual trends to help Gen-Z college students and young professionals gain deeper self-awareness and reduce stress.

## 2. Objectives & Success Metrics
1. Help users understand their emotions beyond text-only analysis.
   • KPI 1: ≥ 75 % of weekly active users view the emotion report within 1 hour after recording.
2. Encourage continuous reflection to reveal long-term patterns.
   • KPI 2: 4-week retention ≥ 30 %.
3. Provide actionable CBT suggestions that users value.
   • KPI 3: Average feedback usefulness rating ≥ 4 / 5.

## 3. Target Users (Personas)
1. "Stressed Student" – 21-year-old university junior juggling exams and part-time work; records via phone in dorm room.
2. "Rising Pro" – 28-year-old UX designer working remote; reflects Sunday evening via laptop webcam.
Both value privacy, quick insights, and dislike clinical language.

## 4. Core Pain Points
• Text-only mood trackers feel shallow.
• Hard to see emotion trends over time.
• Therapy feels expensive or intimidating.

## 5. Main User Goals
A. Gain deep self-awareness of emotional patterns.
B. Reduce stress & anxiety through actionable CBT tips.

## 6. Main Use Case (MVP)
Weekly in-depth reflection session (2-3 min recording) → instant multimodal analysis → CBT feedback & downloadable PDF report → dashboard of emotion trends.

## 7. Key Features (MVP Scope)
1. Multimodal Emotion Detection (face, voice, text)
2. Emotion Trend Dashboard (charts of V, A, D over time)
3. CBT-Based Reflection Report (PDF + in-app)
4. Habit-Tracking Streaks & Gentle Nudges (email / push)
5. AI Chat Coach (follow-up Q&A on results)
6. Anonymous Community Sharing (optional)

## 8. Out-of-Scope (MVP)
• Continuous background monitoring
• Third-party wearable integration
• Enterprise admin portals

## 9. Functional Requirements
FR-1  User can create account with email/social login.
FR-2  User completes onboarding explaining privacy & how to record.
FR-3  User records video/audio & enters optional text journal.
FR-4  System runs AI pipeline → returns VAD scores & emotion labels.
FR-5  System stores results securely and updates dashboards.
FR-6  App generates CBT tips matched to dominant emotion.
FR-7  User can download PDF report or share anonymously.
FR-8  Habit engine sends reminders & tracks streaks.
FR-9  User can chat with AI coach about their report.

## 10. Non-Functional Requirements
• Works on mobile, tablet, desktop (responsive).
• Average analysis turnaround ≤ 15 sec.
• GDPR-level data privacy; all media encrypted at rest.
• Accessibility: WCAG 2.1 AA.

## 11. Assumptions
• Users are willing to grant camera & mic permission once a week.
• Off-the-shelf APIs (Whisper, MediaPipe, emotion model) provide sufficient accuracy.

## 12. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Low model accuracy | Users lose trust | Iterative model tuning; show confidence score |
| Privacy concerns | Drop-off at onboarding | Clear consent UX, local processing where possible |
| Long processing time | Abandon recording | Use lightweight models + queue system |

## 13. Development Strategy
MVP → monthly iterations; agile sprints (2 wks) using default SuperNext tech stack (Next.js 15, Hono.js API, Supabase, TypeScript, Tailwind, shadcn, lucide-react, TanStack Query).

## 14. Milestones & Timeline (tentative)
M0  Week 0    Project kickoff
M1  Week 4    Recording & emotion detection POC
M2  Week 8    CBT report & dashboard
M3  Week 10   Habit nudges & AI chat
M4  Week 12   Public beta launch

---
Owner: Captain (Product Lead)
Date: 2025-10-01