# BeMore Design Guide

## 1. Overall Mood (전체적인 무드)

BeMore embodies a **trustworthy and professional** design mood that prioritizes user comfort and emotional safety. The overall concept centers on creating a calming, non-clinical environment where Gen-Z users feel safe to explore their emotions without judgment. The design language emphasizes clarity, accessibility, and gentle guidance through sophisticated yet approachable visual elements.

The service aims to feel like a trusted friend rather than a clinical tool - warm enough to encourage vulnerability, yet professional enough to instill confidence in the AI-driven insights. Every design decision supports the core mission of making emotional self-awareness accessible and actionable for stressed students and young professionals.

## 2. Reference Service (참조 서비스)

- **Name**: Apple Health
- **Description**: Comprehensive health and wellness tracking platform that presents complex data in digestible, actionable formats
- **Design Mood**: Clean, trustworthy, data-focused with gentle encouragement
- **Primary Color**: #007AFF (System Blue)
- **Secondary Color**: #F2F2F7 (Light Gray)

Apple Health's approach to presenting sensitive personal data with clarity and trust aligns perfectly with BeMore's need to display emotional insights. The clean interface, thoughtful use of charts, and non-intimidating presentation of health metrics serve as inspiration for our emotion tracking dashboard.

## 3. Color & Gradient (색상 & 그라데이션)

- **Primary Color**: #25324A (Misty Navy)
- **Secondary Color**: #F5F7FA (Light Slate)
- **Mood**: Cool, Low Saturation - promoting calmness and trust

**Extended Color Palette:**
- **Accent Primary**: #3D8A9E (Dusty Teal) - Charts, primary buttons
- **Accent Secondary**: #A9B0C7 (Muted Lavender) - Secondary CTA, borders
- **Highlight/CTA**: #2F80ED (Sky Blue) - Primary actions, links
- **Success**: #2DBE76 (Emerald)
- **Warning**: #E8A531 (Amber)
- **Error**: #E1574C (Coral)

**Color Usage by UI Element Importance:**
1. **Critical Actions**: Sky Blue (#2F80ED) - Start recording, view results
2. **Primary Content**: Misty Navy (#25324A) - Headers, important text
3. **Data Visualization**: Dusty Teal (#3D8A9E) - Charts, progress indicators
4. **Secondary Actions**: Muted Lavender (#A9B0C7) - Optional features, borders
5. **Background**: Light Slate (#F5F7FA) - Page backgrounds, card surfaces

## 4. Typography & Font (타이포그래피 & 폰트)

**Primary Font Family**: Inter (fallback: SF Pro Display/Text)

**Typography Scale:**
- **Heading 1**: Inter, 32px, Semi-bold (600), -0.2px letter-spacing
- **Heading 2**: Inter, 24px, Semi-bold (600), -0.1px letter-spacing
- **Heading 3**: Inter, 20px, Medium (500), normal letter-spacing
- **Body Large**: Inter, 18px, Regular (400), 1.5 line-height
- **Body**: Inter, 16px, Regular (400), 1.5 line-height
- **Body Small**: Inter, 14px, Regular (400), 1.4 line-height
- **Caption**: Inter, 12px, Medium (500), 1.3 line-height

**Special Typography:**
- **Chart Numbers**: Inter with tabular-nums for proper alignment
- **Emotional Labels**: Inter Medium for emphasis without being harsh

## 5. Layout & Structure (레이아웃 & 구조)

**Grid System:**
- **Base Unit**: 4px baseline grid
- **Spacing Tokens**: 4px, 8px, 16px, 24px, 32px, 48px, 64px
- **Container Max-Width**: 1200px on desktop
- **Mobile Breakpoints**: 375px (mobile), 768px (tablet), 1024px (desktop)

**Layout Principles:**
- **Mobile-First**: Bottom navigation with 5 core sections
- **Desktop**: Top navigation + left sidebar for Dashboard sub-sections
- **Content Hierarchy**: Clear visual hierarchy with generous whitespace
- **Card-Based**: Modular content blocks with consistent spacing
- **Responsive**: Fluid layouts that adapt gracefully across devices

**Page Structure:**
- Header: 64px height with service logo and user avatar
- Main Content: Flexible with 24px padding on mobile, 32px on desktop
- Bottom Navigation: 72px height on mobile only

## 6. Visual Style (비주얼 스타일)

**Iconography:**
- **Library**: Lucide React line icons
- **Style**: 1.5px stroke weight, rounded line caps
- **Sizes**: 16px (small), 20px (medium), 24px (large), 32px (XL)
- **Color**: Inherit from parent or use Misty Navy for standalone

**Illustrations:**
- **Style**: Minimal outline illustrations for onboarding
- **Color**: Single-color using Dusty Teal with Light Slate backgrounds
- **Usage**: Emotional states, feature explanations, empty states
- **Avoid**: Stock photos of people to maintain privacy focus

**Cards & Containers:**
- **Border Radius**: 12px for cards, 8px for buttons, 6px for inputs
- **Shadows**: Subtle elevation using rgba(37, 50, 74, 0.05)
- **Borders**: 1px solid using Muted Lavender for subtle separation

**Data Visualization:**
- **Charts**: Line charts and radar charts using Dusty Teal
- **Grid Lines**: Light Slate for subtle reference
- **Data Points**: Sky Blue for interactive elements
- **Trends**: Gradient from Dusty Teal to Sky Blue for positive trends

## 7. UX Guide (UX 가이드)

**Target User Approach**: Designed for beginners with emotional self-reflection tools

**Core UX Principles:**
1. **Guided Discovery**: Step-by-step onboarding with contextual help
2. **Emotional Safety**: Non-judgmental language and reassuring feedback
3. **Progressive Disclosure**: Complex features revealed as users gain comfort
4. **Immediate Value**: Quick wins in first session to build trust
5. **Gentle Encouragement**: Positive reinforcement without pressure

**User Experience Strategy:**
- **Onboarding**: 3-screen guided introduction with privacy explanation
- **First Session**: Simplified recording flow with encouraging prompts
- **Results Presentation**: Clear explanations of VAD model with tooltips
- **Habit Formation**: Gentle reminders with streak celebrations
- **Community**: Optional anonymous sharing with positive community guidelines

**Accessibility Considerations:**
- **Contrast**: Minimum 4.5:1 ratio for all text
- **Touch Targets**: Minimum 44×44px for all interactive elements
- **Screen Readers**: Semantic HTML with proper ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility for all features
- **Captions**: Video tutorials include closed captions

## 8. UI Component Guide (UI 컴포넌트 가이드)

**Buttons:**
- **Primary**: Sky Blue background, white text, 12px padding vertical, 24px horizontal
- **Secondary**: Transparent background, Sky Blue border and text
- **Ghost**: Transparent background, Misty Navy text, hover with Light Slate background
- **Destructive**: Coral background for critical actions
- **States**: Hover (10% darker), Active (15% darker), Disabled (50% opacity)

**Input Fields:**
- **Default**: Light Slate background, Muted Lavender border, 12px padding
- **Focus**: Sky Blue border, subtle shadow
- **Error**: Coral border with error message below
- **Success**: Emerald border with success indicator

**Navigation:**
- **Bottom Nav (Mobile)**: 5 items with icons and labels, active state with Sky Blue
- **Top Nav (Desktop)**: Service logo left, user avatar right, 64px height
- **Sidebar (Desktop)**: Dashboard sub-navigation, 240px width, collapsible

**Cards:**
- **Default**: White background, 12px border radius, subtle shadow
- **Interactive**: Hover state with slight elevation increase
- **Content**: 24px padding, clear hierarchy with proper spacing

**Modals & Overlays:**
- **Background**: rgba(37, 50, 74, 0.6) overlay
- **Content**: White background, 16px border radius, 32px padding
- **Close**: X icon in top-right corner using Muted Lavender

**Progress Indicators:**
- **Recording**: Pulsing red dot with timer
- **Analysis**: Circular progress with percentage in Dusty Teal
- **Streak**: Badge-style counters with Emerald background

**Charts & Data Visualization:**
- **Line Charts**: Dusty Teal lines, Sky Blue data points, Light Slate grid
- **Radar Charts**: Dusty Teal fill with 20% opacity, solid border
- **Trend Indicators**: Arrows using Success green (up) or Warning amber (neutral)

**Feedback Components:**
- **Success Messages**: Emerald background, white text, checkmark icon
- **Error Messages**: Coral background, white text, alert icon
- **Info Messages**: Sky Blue background, white text, info icon
- **Loading States**: Skeleton screens using Light Slate with subtle animation

**Typography Components:**
- **Emotional Labels**: Medium weight, Dusty Teal color for positive emotions
- **Data Values**: Tabular numbers for consistent alignment
- **Timestamps**: Caption size in Muted Lavender
- **CTAs**: Medium weight in Sky Blue for emphasis