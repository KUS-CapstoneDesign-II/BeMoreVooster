/**
 * Counseling Session Management - Zod Validation Schemas
 * @module counseling/backend/schema
 */

import { z } from 'zod';
import type {
  Question,
  InitialResponse,
  CounselingCategory,
  CounselingSession,
  CounselingMessage,
  SessionMetadata,
} from '../lib/types';

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Question schema for initial session questions
 */
export const QuestionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  type: z.enum(['text', 'select', 'multiselect', 'scale']),
  options: z.array(z.string()).optional(),
  required: z.boolean(),
  order: z.number().int().min(0),
}) satisfies z.ZodType<Question>;

/**
 * Initial response schema
 */
export const InitialResponseSchema = z.object({
  questionId: z.string().min(1),
  answer: z.union([z.string(), z.array(z.string())]),
  timestamp: z.coerce.date(),
}) satisfies z.ZodType<InitialResponse>;

/**
 * Session metadata schema
 */
export const SessionMetadataSchema = z.object({
  messageCount: z.number().int().min(0).optional(),
  tags: z.array(z.string()).optional(),
  lastReadAt: z.string().datetime().optional(),
}).passthrough() satisfies z.ZodType<SessionMetadata>;

// ============================================================================
// DATABASE ROW SCHEMAS (snake_case from DB)
// ============================================================================

/**
 * Category table row schema
 */
export const CategoryTableRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  icon: z.string(),
  color: z.string(),
  initial_questions: z.array(QuestionSchema),
  is_custom: z.boolean(),
  user_id: z.string().uuid().nullable(),
  created_at: z.coerce.date(),
});

export type CategoryTableRow = z.infer<typeof CategoryTableRowSchema>;

/**
 * Session table row schema
 */
export const SessionTableRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  category_id: z.string().uuid(),
  counselor_id: z.string().uuid().nullable(),
  title: z.string(),
  status: z.enum(['active', 'paused', 'completed', 'archived']),
  initial_responses: z.record(z.string(), InitialResponseSchema),
  metadata: SessionMetadataSchema,
  summary: z.string().nullable(),
  thumbnail: z.string().nullable(),
  created_at: z.coerce.date(),
  last_activity_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type SessionTableRow = z.infer<typeof SessionTableRowSchema>;

/**
 * Message table row schema
 */
export const MessageTableRowSchema = z.object({
  id: z.string().uuid(),
  session_id: z.string().uuid(),
  sender_id: z.string().uuid(),
  content: z.string(),
  message_type: z.enum(['text', 'image', 'file', 'system']),
  is_bookmarked: z.boolean(),
  metadata: z.record(z.unknown()).nullable(),
  created_at: z.coerce.date(),
});

export type MessageTableRow = z.infer<typeof MessageTableRowSchema>;

// ============================================================================
// API REQUEST SCHEMAS
// ============================================================================

/**
 * Create custom category request schema
 */
export const CreateCategoryRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).default('MessageCircle'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#3B82F6'),
  initialQuestions: z.array(QuestionSchema).max(10).default([]),
});

/**
 * Create session request schema
 */
export const CreateSessionRequestSchema = z.object({
  categoryId: z.string().uuid(),
  title: z.string().min(1).max(200),
  initialResponses: z.record(z.string(), InitialResponseSchema).optional().default({}),
});

/**
 * Update session request schema
 */
export const UpdateSessionRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(['active', 'paused', 'completed', 'archived']).optional(),
  summary: z.string().max(1000).optional(),
  thumbnail: z.string().url().optional(),
  metadata: SessionMetadataSchema.partial().optional(),
});

/**
 * Create message request schema
 */
export const CreateMessageRequestSchema = z.object({
  content: z.string().min(1).max(5000),
  messageType: z.enum(['text', 'image', 'file']).default('text'),
  metadata: z.record(z.unknown()).optional(),
});

/**
 * Session list query schema
 */
export const SessionListQuerySchema = z.object({
  status: z.enum(['active', 'paused', 'completed', 'archived']).optional(),
  categoryId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

/**
 * Message list query schema
 */
export const MessageListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().uuid().optional(),
  beforeDate: z.coerce.date().optional(),
});

/**
 * Session ID param schema
 */
export const SessionIdParamSchema = z.object({
  sessionId: z.string().uuid(),
});

/**
 * Message ID param schema
 */
export const MessageIdParamSchema = z.object({
  messageId: z.string().uuid(),
});

/**
 * Category ID param schema
 */
export const CategoryIdParamSchema = z.object({
  categoryId: z.string().uuid(),
});

// ============================================================================
// API RESPONSE SCHEMAS (camelCase for frontend)
// ============================================================================

/**
 * Category response schema
 */
export const CategoryResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  icon: z.string(),
  color: z.string(),
  initialQuestions: z.array(QuestionSchema),
  isCustom: z.boolean(),
  userId: z.string().uuid().nullable(),
  createdAt: z.date(),
}) satisfies z.ZodType<CounselingCategory>;

export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;

/**
 * Session response schema
 */
export const SessionResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  categoryId: z.string().uuid(),
  counselorId: z.string().uuid().nullable(),
  title: z.string(),
  status: z.enum(['active', 'paused', 'completed', 'archived']),
  initialResponses: z.record(z.string(), InitialResponseSchema),
  metadata: SessionMetadataSchema,
  summary: z.string().nullable(),
  thumbnail: z.string().nullable(),
  createdAt: z.date(),
  lastActivityAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<CounselingSession>;

export type SessionResponse = z.infer<typeof SessionResponseSchema>;

/**
 * Message response schema
 */
export const MessageResponseSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string(),
  messageType: z.enum(['text', 'image', 'file', 'system']),
  isBookmarked: z.boolean(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date(),
}) satisfies z.ZodType<CounselingMessage>;

export type MessageResponse = z.infer<typeof MessageResponseSchema>;

/**
 * Category list response schema
 */
export const CategoryListResponseSchema = z.object({
  defaultCategories: z.array(CategoryResponseSchema),
  customCategories: z.array(CategoryResponseSchema),
});

/**
 * Session list response schema (paginated)
 */
export const SessionListResponseSchema = z.object({
  data: z.array(SessionResponseSchema),
  pagination: z.object({
    total: z.number().int().min(0),
    limit: z.number().int().min(1),
    offset: z.number().int().min(0),
    hasMore: z.boolean(),
  }),
});

/**
 * Message list response schema (paginated)
 */
export const MessageListResponseSchema = z.object({
  data: z.array(MessageResponseSchema),
  pagination: z.object({
    total: z.number().int().min(0),
    limit: z.number().int().min(1),
    cursor: z.string().uuid().nullable(),
    hasMore: z.boolean(),
  }),
});

/**
 * Session stats response schema
 */
export const SessionStatsResponseSchema = z.object({
  totalSessions: z.number().int().min(0),
  activeSessions: z.number().int().min(0),
  completedSessions: z.number().int().min(0),
  totalMessages: z.number().int().min(0),
  avgMessagesPerSession: z.number().min(0),
  mostActiveCategory: z.object({
    id: z.string().uuid(),
    name: z.string(),
    sessionCount: z.number().int().min(0),
  }).nullable(),
  recentActivity: z.array(z.object({
    sessionId: z.string().uuid(),
    sessionTitle: z.string(),
    lastActivityAt: z.date(),
  })),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Map database row to API response (category)
 */
export function mapCategoryRowToResponse(row: CategoryTableRow): CategoryResponse {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    color: row.color,
    initialQuestions: row.initial_questions,
    isCustom: row.is_custom,
    userId: row.user_id,
    createdAt: row.created_at,
  };
}

/**
 * Map database row to API response (session)
 */
export function mapSessionRowToResponse(row: SessionTableRow): SessionResponse {
  return {
    id: row.id,
    userId: row.user_id,
    categoryId: row.category_id,
    counselorId: row.counselor_id,
    title: row.title,
    status: row.status,
    initialResponses: row.initial_responses,
    metadata: row.metadata,
    summary: row.summary,
    thumbnail: row.thumbnail,
    createdAt: row.created_at,
    lastActivityAt: row.last_activity_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Map database row to API response (message)
 */
export function mapMessageRowToResponse(row: MessageTableRow): MessageResponse {
  return {
    id: row.id,
    sessionId: row.session_id,
    senderId: row.sender_id,
    content: row.content,
    messageType: row.message_type,
    isBookmarked: row.is_bookmarked,
    metadata: row.metadata ?? undefined,
    createdAt: row.created_at,
  };
}
