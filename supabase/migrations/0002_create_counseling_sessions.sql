-- Migration: Create counseling session management system
-- Description: Tables for categories, sessions, and messages with RLS policies
-- Author: Bemore Vooster Team
-- Date: 2025-10-07

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
create extension if not exists "pgcrypto";

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- 2.1 Counseling Categories Table
create table if not exists public.counseling_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text not null default 'MessageCircle',
  color text not null default '#3B82F6',
  initial_questions jsonb not null default '[]'::jsonb,
  is_custom boolean not null default false,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),

  -- Constraint: Default categories have no user_id, custom categories require user_id
  constraint category_ownership check (
    (is_custom = false and user_id is null) or
    (is_custom = true and user_id is not null)
  )
);

comment on table public.counseling_categories is 'Counseling categories - both default and user-custom';
comment on column public.counseling_categories.initial_questions is 'Array of questions shown when creating a session';
comment on column public.counseling_categories.is_custom is 'True if user-created, false if default category';

-- 2.2 Counseling Sessions Table
create table if not exists public.counseling_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.counseling_categories(id) on delete restrict,
  counselor_id uuid references auth.users(id) on delete set null,
  title text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  initial_responses jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  summary text,
  thumbnail text,
  created_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.counseling_sessions is 'Individual counseling sessions linked to categories';
comment on column public.counseling_sessions.initial_responses is 'User responses to initial questions (question_id -> answer)';
comment on column public.counseling_sessions.metadata is 'Additional metadata like tags, message_count, etc.';
comment on column public.counseling_sessions.last_activity_at is 'Auto-updated on new message';

-- 2.3 Counseling Messages Table
create table if not exists public.counseling_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.counseling_sessions(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  message_type text not null default 'text' check (message_type in ('text', 'image', 'file', 'system')),
  is_bookmarked boolean not null default false,
  metadata jsonb,
  created_at timestamptz not null default now()
);

comment on table public.counseling_messages is 'Messages within counseling sessions';
comment on column public.counseling_messages.message_type is 'Type of message: text, image, file, or system notification';
comment on column public.counseling_messages.metadata is 'Additional data like file URLs, image dimensions, etc.';

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

-- Categories indexes
create index if not exists counseling_categories_user_id_idx
  on public.counseling_categories(user_id);

create index if not exists counseling_categories_is_custom_idx
  on public.counseling_categories(is_custom);

-- Sessions indexes
create index if not exists counseling_sessions_user_id_status_idx
  on public.counseling_sessions(user_id, status);

create index if not exists counseling_sessions_category_id_idx
  on public.counseling_sessions(category_id);

create index if not exists counseling_sessions_last_activity_idx
  on public.counseling_sessions(last_activity_at desc);

create index if not exists counseling_sessions_counselor_id_idx
  on public.counseling_sessions(counselor_id);

-- Messages indexes
create index if not exists counseling_messages_session_id_created_idx
  on public.counseling_messages(session_id, created_at desc);

create index if not exists counseling_messages_sender_id_idx
  on public.counseling_messages(sender_id);

create index if not exists counseling_messages_is_bookmarked_idx
  on public.counseling_messages(session_id, is_bookmarked)
  where is_bookmarked = true;

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
alter table public.counseling_categories enable row level security;
alter table public.counseling_sessions enable row level security;
alter table public.counseling_messages enable row level security;

-- 4.1 Categories Policies
-- Anyone can view default categories
create policy "Anyone can view default categories"
  on public.counseling_categories for select
  using (is_custom = false);

-- Users can view their own custom categories
create policy "Users can view own custom categories"
  on public.counseling_categories for select
  using (is_custom = true and user_id = auth.uid());

-- Users can create custom categories
create policy "Users can create custom categories"
  on public.counseling_categories for insert
  with check (is_custom = true and user_id = auth.uid());

-- Users can update their own custom categories
create policy "Users can update own custom categories"
  on public.counseling_categories for update
  using (is_custom = true and user_id = auth.uid())
  with check (is_custom = true and user_id = auth.uid());

-- Users can delete their own custom categories
create policy "Users can delete own custom categories"
  on public.counseling_categories for delete
  using (is_custom = true and user_id = auth.uid());

-- 4.2 Sessions Policies
-- Users can view their own sessions
create policy "Users can view own sessions"
  on public.counseling_sessions for select
  using (user_id = auth.uid());

-- Counselors can view sessions they're assigned to
create policy "Counselors can view assigned sessions"
  on public.counseling_sessions for select
  using (counselor_id = auth.uid());

-- Users can create their own sessions
create policy "Users can create own sessions"
  on public.counseling_sessions for insert
  with check (user_id = auth.uid());

-- Users can update their own sessions
create policy "Users can update own sessions"
  on public.counseling_sessions for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Users can delete (archive) their own sessions
create policy "Users can delete own sessions"
  on public.counseling_sessions for delete
  using (user_id = auth.uid());

-- 4.3 Messages Policies
-- Session owners can view messages
create policy "Session owners can view messages"
  on public.counseling_messages for select
  using (
    exists (
      select 1 from public.counseling_sessions
      where id = counseling_messages.session_id
      and user_id = auth.uid()
    )
  );

-- Counselors can view messages in their sessions
create policy "Counselors can view session messages"
  on public.counseling_messages for select
  using (
    exists (
      select 1 from public.counseling_sessions
      where id = counseling_messages.session_id
      and counselor_id = auth.uid()
    )
  );

-- Authenticated users can send messages (checked by application logic)
create policy "Session participants can send messages"
  on public.counseling_messages for insert
  with check (
    sender_id = auth.uid() and
    exists (
      select 1 from public.counseling_sessions
      where id = counseling_messages.session_id
      and (user_id = auth.uid() or counselor_id = auth.uid())
    )
  );

-- Users can update their own messages (for bookmarking)
create policy "Users can update messages in their sessions"
  on public.counseling_messages for update
  using (
    exists (
      select 1 from public.counseling_sessions
      where id = counseling_messages.session_id
      and user_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

-- 5.1 Auto-update last_activity_at when a message is created
create or replace function update_session_last_activity()
returns trigger as $$
begin
  update public.counseling_sessions
  set last_activity_at = now()
  where id = new.session_id;
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_session_activity_on_message
  after insert on public.counseling_messages
  for each row
  execute function update_session_last_activity();

-- 5.2 Auto-update updated_at timestamp on session changes
create or replace function update_session_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_session_updated_at
  before update on public.counseling_sessions
  for each row
  execute function update_session_updated_at();

-- 5.3 Update message_count in session metadata when messages are added/deleted
create or replace function update_session_message_count()
returns trigger as $$
declare
  msg_count integer;
begin
  -- Count messages in the session
  select count(*) into msg_count
  from public.counseling_messages
  where session_id = coalesce(new.session_id, old.session_id);

  -- Update metadata with message count
  update public.counseling_sessions
  set metadata = jsonb_set(
    metadata,
    '{messageCount}',
    to_jsonb(msg_count),
    true
  )
  where id = coalesce(new.session_id, old.session_id);

  return coalesce(new, old);
end;
$$ language plpgsql;

create trigger trigger_update_message_count_on_insert
  after insert on public.counseling_messages
  for each row
  execute function update_session_message_count();

create trigger trigger_update_message_count_on_delete
  after delete on public.counseling_messages
  for each row
  execute function update_session_message_count();

-- ============================================================================
-- 6. SEED DATA - DEFAULT CATEGORIES
-- ============================================================================

insert into public.counseling_categories (name, description, icon, color, initial_questions, is_custom)
values
  (
    '연애 상담',
    '연애 관계, 이별, 짝사랑 등에 대한 고민',
    'Heart',
    '#EC4899',
    '[
      {
        "id": "q1",
        "text": "어떤 상황인가요?",
        "type": "select",
        "options": ["현재 연애 중", "이별 직후", "짝사랑", "복잡한 관계"],
        "required": true,
        "order": 1
      },
      {
        "id": "q2",
        "text": "가장 힘든 점은 무엇인가요?",
        "type": "text",
        "required": true,
        "order": 2
      },
      {
        "id": "q3",
        "text": "이 상담을 통해 얻고 싶은 것은?",
        "type": "text",
        "required": false,
        "order": 3
      }
    ]'::jsonb,
    false
  ),
  (
    '진로 고민',
    '직업, 진로 선택, 이직 등에 대한 상담',
    'Briefcase',
    '#3B82F6',
    '[
      {
        "id": "q1",
        "text": "현재 직업 상태는?",
        "type": "select",
        "options": ["재직 중", "구직 중", "학생", "프리랜서", "기타"],
        "required": true,
        "order": 1
      },
      {
        "id": "q2",
        "text": "어떤 고민이 있으신가요?",
        "type": "text",
        "required": true,
        "order": 2
      },
      {
        "id": "q3",
        "text": "목표하는 진로나 방향이 있나요?",
        "type": "text",
        "required": false,
        "order": 3
      }
    ]'::jsonb,
    false
  ),
  (
    '가족 관계',
    '부모님, 형제자매 등 가족 간 갈등',
    'Users',
    '#10B981',
    '[
      {
        "id": "q1",
        "text": "누구와의 관계인가요?",
        "type": "select",
        "options": ["부모님", "형제자매", "배우자 가족", "자녀", "기타"],
        "required": true,
        "order": 1
      },
      {
        "id": "q2",
        "text": "어떤 어려움을 겪고 계신가요?",
        "type": "text",
        "required": true,
        "order": 2
      }
    ]'::jsonb,
    false
  ),
  (
    '정신건강',
    '우울, 불안, 스트레스 등 심리적 어려움',
    'Brain',
    '#8B5CF6',
    '[
      {
        "id": "q1",
        "text": "증상이 시작된 시기는?",
        "type": "select",
        "options": ["최근 1주일", "1개월 이내", "3개월 이상", "1년 이상", "기억나지 않음"],
        "required": true,
        "order": 1
      },
      {
        "id": "q2",
        "text": "전문가 상담 경험이 있나요?",
        "type": "select",
        "options": ["있음", "없음"],
        "required": false,
        "order": 2
      },
      {
        "id": "q3",
        "text": "현재 가장 힘든 증상은 무엇인가요?",
        "type": "text",
        "required": true,
        "order": 3
      }
    ]'::jsonb,
    false
  ),
  (
    '대인관계',
    '친구, 직장 동료 등과의 관계 고민',
    'MessageCircle',
    '#F59E0B',
    '[
      {
        "id": "q1",
        "text": "어떤 관계에서의 어려움인가요?",
        "type": "select",
        "options": ["친구", "직장 동료", "학교", "온라인 커뮤니티", "기타"],
        "required": true,
        "order": 1
      },
      {
        "id": "q2",
        "text": "구체적으로 어떤 점이 힘드신가요?",
        "type": "text",
        "required": true,
        "order": 2
      }
    ]'::jsonb,
    false
  ),
  (
    '자기계발',
    '습관 형성, 목표 달성, 시간 관리 등',
    'Target',
    '#06B6D4',
    '[
      {
        "id": "q1",
        "text": "개선하고 싶은 영역은?",
        "type": "select",
        "options": ["습관 형성", "목표 달성", "시간 관리", "자기 돌봄", "기타"],
        "required": true,
        "order": 1
      },
      {
        "id": "q2",
        "text": "현재 겪고 있는 어려움은?",
        "type": "text",
        "required": true,
        "order": 2
      }
    ]'::jsonb,
    false
  ),
  (
    '학업 스트레스',
    '공부, 시험, 학업 성취에 대한 고민',
    'BookOpen',
    '#EF4444',
    '[
      {
        "id": "q1",
        "text": "현재 학년 또는 상황은?",
        "type": "select",
        "options": ["초등학생", "중학생", "고등학생", "대학생", "수험생", "기타"],
        "required": true,
        "order": 1
      },
      {
        "id": "q2",
        "text": "어떤 부분에서 어려움을 느끼시나요?",
        "type": "text",
        "required": true,
        "order": 2
      }
    ]'::jsonb,
    false
  ),
  (
    '기타 고민',
    '위 카테고리에 해당하지 않는 다양한 고민',
    'HelpCircle',
    '#6B7280',
    '[
      {
        "id": "q1",
        "text": "상담하고 싶은 주제를 간단히 설명해주세요",
        "type": "text",
        "required": true,
        "order": 1
      }
    ]'::jsonb,
    false
  )
on conflict do nothing;

-- ============================================================================
-- 7. COMMENTS & DOCUMENTATION
-- ============================================================================

comment on policy "Anyone can view default categories" on public.counseling_categories is
  'Default categories are visible to all users';

comment on policy "Users can view own custom categories" on public.counseling_categories is
  'Custom categories are only visible to their creators';

comment on policy "Session owners can view messages" on public.counseling_messages is
  'Users can view all messages in their own sessions';

comment on policy "Counselors can view session messages" on public.counseling_messages is
  'Assigned counselors can view messages in their sessions';

comment on function update_session_last_activity() is
  'Automatically updates session last_activity_at when a new message is created';

comment on function update_session_updated_at() is
  'Automatically updates session updated_at timestamp on any update';

comment on function update_session_message_count() is
  'Keeps metadata.messageCount in sync with actual message count';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
