/**
 * Counseling Session Management - Type Definitions
 * @module counseling/types
 */

// ============================================================================
// ENUMS
// ============================================================================

export type SessionStatus = 'active' | 'paused' | 'completed' | 'archived';
export type MessageType = 'text' | 'image' | 'file' | 'system';
export type QuestionType = 'text' | 'select' | 'multiselect' | 'scale';

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Question definition for initial session setup
 */
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  order: number;
}

/**
 * User's response to an initial question
 */
export interface InitialResponse {
  questionId: string;
  answer: string | string[];
  timestamp: Date;
}

/**
 * Session metadata stored as JSONB
 */
export interface SessionMetadata {
  messageCount?: number;
  tags?: string[];
  lastReadAt?: string;
  [key: string]: unknown;
}

// ============================================================================
// DATABASE ENTITIES
// ============================================================================

/**
 * Counseling category (default or user-custom)
 */
export interface CounselingCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  initialQuestions: Question[];
  isCustom: boolean;
  userId: string | null;
  createdAt: Date;
}

/**
 * Counseling session
 */
export interface CounselingSession {
  id: string;
  userId: string;
  categoryId: string;
  counselorId: string | null;
  title: string;
  status: SessionStatus;
  initialResponses: Record<string, InitialResponse>;
  metadata: SessionMetadata;
  summary: string | null;
  thumbnail: string | null;
  createdAt: Date;
  lastActivityAt: Date;
  updatedAt: Date;
}

/**
 * Message within a session
 */
export interface CounselingMessage {
  id: string;
  sessionId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  isBookmarked: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ============================================================================
// EXTENDED TYPES (with relations)
// ============================================================================

/**
 * Session with category information
 */
export interface SessionWithCategory extends CounselingSession {
  category: CounselingCategory;
}

/**
 * Session with message preview
 */
export interface SessionWithPreview extends CounselingSession {
  lastMessage?: {
    content: string;
    createdAt: Date;
  };
  unreadCount?: number;
}

/**
 * Message with sender information
 */
export interface MessageWithSender extends CounselingMessage {
  sender: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

// ============================================================================
// REQUEST/RESPONSE DTOS
// ============================================================================

/**
 * Create category request
 */
export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  initialQuestions?: Question[];
}

/**
 * Create session request
 */
export interface CreateSessionInput {
  categoryId: string;
  title: string;
  initialResponses?: Record<string, InitialResponse>;
}

/**
 * Update session request
 */
export interface UpdateSessionInput {
  title?: string;
  status?: SessionStatus;
  summary?: string;
  thumbnail?: string;
  metadata?: Partial<SessionMetadata>;
}

/**
 * Create message request
 */
export interface CreateMessageInput {
  content: string;
  messageType?: MessageType;
  metadata?: Record<string, unknown>;
}

/**
 * Session list query parameters
 */
export interface SessionListQuery {
  status?: SessionStatus;
  categoryId?: string;
  limit?: number;
  offset?: number;
}

/**
 * Message list query parameters
 */
export interface MessageListQuery {
  limit?: number;
  cursor?: string; // message ID for cursor-based pagination
  beforeDate?: Date;
}

/**
 * Session statistics
 */
export interface SessionStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  totalMessages: number;
  avgMessagesPerSession: number;
  mostActiveCategory: {
    id: string;
    name: string;
    sessionCount: number;
  } | null;
  recentActivity: Array<{
    sessionId: string;
    sessionTitle: string;
    lastActivityAt: Date;
  }>;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Paginated list response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Category list response
 */
export interface CategoryListResponse {
  defaultCategories: CounselingCategory[];
  customCategories: CounselingCategory[];
}
