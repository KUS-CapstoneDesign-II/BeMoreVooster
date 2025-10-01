# BeMore Information Architecture (IA)

## 1. Site Map

```
BeMore
├── Landing (Public)
│   ├── Home
│   ├── Features
│   ├── Privacy Policy
│   └── Terms of Service
├── Authentication
│   ├── Sign Up
│   ├── Sign In
│   └── Password Reset
└── Application (Protected)
    ├── Home (Record Session)
    │   ├── Permission Setup
    │   ├── Recording Interface
    │   └── Processing Status
    ├── Dashboard
    │   ├── Weekly Snapshot
    │   ├── Emotion Trends
    │   └── Habit Streaks
    ├── Reports
    │   ├── Report List
    │   └── Report Detail
    │       ├── Emotion Analysis
    │       ├── CBT Recommendations
    │       └── PDF Download
    ├── Community
    │   ├── Anonymous Feed
    │   └── Shared Story Detail
    ├── AI Coach
    │   └── Chat Interface
    └── Profile
        ├── Account Settings
        ├── Notification Preferences
        ├── Privacy Controls
        └── Data Export
```

## 2. User Flow

**Primary Flow: Weekly Reflection Session**
1. User opens BeMore app/web
2. Navigates to Home (Record) page
3. Grants camera/microphone permissions (first time)
4. Starts 2-3 minute recording session
5. Completes optional text journal entry
6. Submits recording for analysis
7. Waits for processing (10-15 seconds)
8. Views emotion analysis results
9. Reads personalized CBT recommendations
10. Downloads PDF report or shares anonymously
11. Accesses AI Coach for follow-up questions

**Secondary Flow: Trend Review**
1. User opens Dashboard
2. Views weekly emotion snapshots
3. Examines VAD trend charts over time
4. Identifies patterns and improvements
5. Celebrates habit streaks
6. Sets reminders for next session

**Tertiary Flow: Community Engagement**
1. User visits Community section
2. Browses anonymous shared experiences
3. Reads encouraging stories from others
4. Optionally shares own insights anonymously
5. Finds motivation for continued reflection

## 3. Navigation Structure

**Mobile Navigation (Bottom Tab Bar):**
- Home (Record) - Primary CTA for weekly sessions
- Dashboard - Emotion trends and insights
- Reports - Historical analysis and CBT tips
- Community - Anonymous peer support
- Profile - Settings and account management

**Desktop Navigation:**
- **Top Bar**: BeMore logo, Home, Dashboard, Reports, Community, User Avatar
- **Dashboard Sidebar** (when in Dashboard):
  - Weekly Snapshot
  - Emotion Trends
  - Habit Tracking
  - Calendar View

**Global Navigation Elements:**
- Header: Service logo, main navigation, user avatar
- Footer: Privacy policy, terms, support links (public pages only)

## 4. Page Hierarchy

```
/ (Depth 1 - Public)
├── /features (Depth 2)
├── /privacy (Depth 2)
└── /terms (Depth 2)

/auth (Depth 1)
├── /auth/signup (Depth 2)
├── /auth/signin (Depth 2)
└── /auth/reset-password (Depth 2)

/app (Depth 1 - Protected)
├── /app/home (Depth 2)
│   ├── /app/home/permissions (Depth 3)
│   └── /app/home/recording (Depth 3)
├── /app/dashboard (Depth 2)
│   ├── /app/dashboard/trends (Depth 3)
│   └── /app/dashboard/calendar (Depth 3)
├── /app/reports (Depth 2)
│   └── /app/reports/:id (Depth 3)
├── /app/community (Depth 2)
│   └── /app/community/:postId (Depth 3)
├── /app/coach (Depth 2)
└── /app/profile (Depth 2)
    ├── /app/profile/account (Depth 3)
    ├── /app/profile/notifications (Depth 3)
    └── /app/profile/privacy (Depth 3)
```

## 5. Content Organization

| Page | Key Content Elements |
|------|---------------------|
| Landing Home | Hero section, value proposition, feature highlights, social proof, CTA button |
| Sign Up | Registration form, privacy assurance, Google OAuth option, terms acceptance |
| Home (Record) | Recording interface, permission prompts, progress indicator, session prompts |
| Dashboard | Weekly emotion cards, VAD trend charts, habit streak counters, quick actions |
| Report Detail | Emotion radar chart, VAD scores, CBT recommendations, PDF download, share button |
| Community Feed | Anonymous story cards, emotion tags, encouragement reactions, post button |
| AI Coach | Chat interface, conversation history, suggested questions, emotional context |
| Profile | User avatar, account settings, notification toggles, privacy controls, data export |

## 6. Interaction Patterns

**Recording Session:**
- Progressive disclosure: Permissions → Recording → Journal → Processing
- Real-time feedback: Recording timer, audio level indicators
- Encouraging prompts: Guided questions to facilitate reflection

**Data Visualization:**
- Interactive charts: Hover states show detailed emotion scores
- Time range selection: Week, month, quarter views for trends
- Tooltip explanations: VAD model education on demand

**Community Engagement:**
- Anonymous sharing: One-click share from report with privacy controls
- Reaction system: Simple emoji responses for peer support
- Content moderation: Flagging system for inappropriate content

**AI Coach Integration:**
- Contextual suggestions: Questions based on current emotion state
- Conversation threading: Maintain context across chat sessions
- CBT exercise delivery: Interactive guided practices

## 7. URL Structure

**Public Pages:**
- `/` - Landing page
- `/features` - Feature overview
- `/privacy` - Privacy policy
- `/terms` - Terms of service

**Authentication:**
- `/auth/signup` - User registration
- `/auth/signin` - User login
- `/auth/reset-password` - Password recovery

**Application Pages:**
- `/app/home` - Recording interface
- `/app/dashboard` - Emotion trends overview
- `/app/reports` - Report listing
- `/app/reports/:reportId` - Individual report detail
- `/app/community` - Community feed
- `/app/community/:postId` - Shared story detail
- `/app/coach` - AI coach chat
- `/app/profile` - User profile and settings

## 8. Component Hierarchy

**Global Components:**
- Header: Logo, navigation, user avatar
- Footer: Links and legal information (public only)
- BottomNavigation: Mobile tab bar for main sections
- LoadingSpinner: Consistent loading states
- Toast: Success/error notifications

**Authentication Components:**
- AuthForm: Reusable form container
- SocialLogin: Google OAuth integration
- PasswordStrength: Real-time validation

**Recording Components:**
- CameraPreview: Video recording interface
- AudioVisualizer: Real-time audio level display
- RecordingTimer: Session duration tracking
- JournalInput: Optional text reflection

**Dashboard Components:**
- EmotionCard: Weekly snapshot display
- TrendChart: VAD line chart visualization
- StreakCounter: Habit tracking display
- CalendarView: Historical session overview

**Report Components:**
- RadarChart: Emotion analysis visualization
- CBTRecommendations: Personalized tip cards
- ShareModal: Anonymous sharing interface
- PDFExport: Report download functionality

**Community Components:**
- StoryCard: Anonymous shared experience
- ReactionBar: Emoji-based peer support
- PostComposer: Story sharing interface

**Chat Components:**
- MessageBubble: Chat conversation display
- SuggestedQuestions: AI-generated prompts
- TypingIndicator: AI response loading state

**Form Components:**
- Input: Standardized form fields
- Button: Primary, secondary, and ghost variants
- Toggle: Settings and preference controls
- Select: Dropdown selections

**Data Visualization:**
- LineChart: Trend visualization
- ProgressBar: Analysis processing states
- EmotionLabel: Standardized emotion tags
- ScoreDisplay: VAD numerical representations

This information architecture supports BeMore's core mission of providing accessible emotional self-awareness tools while maintaining user privacy and encouraging consistent engagement through clear navigation and intuitive content organization.