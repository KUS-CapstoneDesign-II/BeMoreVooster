/**
 * Counseling Session Management - Service Layer
 * @module counseling/backend/service
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import {
  failure,
  success,
  type HandlerResult,
} from '@/backend/http/response';
import {
  CategoryTableRowSchema,
  SessionTableRowSchema,
  MessageTableRowSchema,
  mapCategoryRowToResponse,
  mapSessionRowToResponse,
  mapMessageRowToResponse,
  type CategoryResponse,
  type SessionResponse,
  type MessageResponse,
  type CategoryTableRow,
  type SessionTableRow,
  type MessageTableRow,
} from './schema';
import {
  counselingErrorCodes,
  createError,
  type CounselingServiceError,
} from './error';
import type {
  CreateCategoryInput,
  CreateSessionInput,
  UpdateSessionInput,
  CreateMessageInput,
  SessionListQuery,
  MessageListQuery,
  SessionStats,
  PaginatedResponse,
  CategoryListResponse,
} from '../lib/types';

const CATEGORY_TABLE = 'counseling_categories';
const SESSION_TABLE = 'counseling_sessions';
const MESSAGE_TABLE = 'counseling_messages';

// ============================================================================
// CATEGORY SERVICES
// ============================================================================

/**
 * List all categories (default + user's custom)
 */
export async function listCategories(
  client: SupabaseClient,
  userId: string,
): Promise<HandlerResult<CategoryListResponse, CounselingServiceError, unknown>> {
  try {
    // Fetch default categories
    const { data: defaultData, error: defaultError } = await client
      .from(CATEGORY_TABLE)
      .select('*')
      .eq('is_custom', false)
      .order('name');

    if (defaultError) {
      return failure(
        500,
        counselingErrorCodes.categoryFetchError,
        defaultError.message,
      );
    }

    // Fetch user's custom categories
    const { data: customData, error: customError } = await client
      .from(CATEGORY_TABLE)
      .select('*')
      .eq('is_custom', true)
      .eq('user_id', userId)
      .order('name');

    if (customError) {
      return failure(
        500,
        counselingErrorCodes.categoryFetchError,
        customError.message,
      );
    }

    // Validate and map
    const defaultCategories: CategoryResponse[] = [];
    const customCategories: CategoryResponse[] = [];

    for (const row of defaultData || []) {
      const parsed = CategoryTableRowSchema.safeParse(row);
      if (parsed.success) {
        defaultCategories.push(mapCategoryRowToResponse(parsed.data));
      }
    }

    for (const row of customData || []) {
      const parsed = CategoryTableRowSchema.safeParse(row);
      if (parsed.success) {
        customCategories.push(mapCategoryRowToResponse(parsed.data));
      }
    }

    return success({ defaultCategories, customCategories });
  } catch (error) {
    return failure(
      500,
      counselingErrorCodes.categoryFetchError,
      'Unexpected error fetching categories',
      error,
    );
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(
  client: SupabaseClient,
  categoryId: string,
): Promise<HandlerResult<CategoryResponse, CounselingServiceError, unknown>> {
  const { data, error } = await client
    .from(CATEGORY_TABLE)
    .select('*')
    .eq('id', categoryId)
    .maybeSingle<CategoryTableRow>();

  if (error) {
    return failure(500, counselingErrorCodes.categoryFetchError, error.message);
  }

  if (!data) {
    return failure(404, counselingErrorCodes.categoryNotFound);
  }

  const parsed = CategoryTableRowSchema.safeParse(data);
  if (!parsed.success) {
    return failure(
      500,
      counselingErrorCodes.categoryValidationError,
      'Category data validation failed',
      parsed.error.format(),
    );
  }

  return success(mapCategoryRowToResponse(parsed.data));
}

/**
 * Create custom category
 */
export async function createCustomCategory(
  client: SupabaseClient,
  userId: string,
  input: CreateCategoryInput,
): Promise<HandlerResult<CategoryResponse, CounselingServiceError, unknown>> {
  const { data, error } = await client
    .from(CATEGORY_TABLE)
    .insert({
      name: input.name,
      description: input.description ?? null,
      icon: input.icon ?? 'MessageCircle',
      color: input.color ?? '#3B82F6',
      initial_questions: input.initialQuestions ?? [],
      is_custom: true,
      user_id: userId,
    })
    .select()
    .single<CategoryTableRow>();

  if (error) {
    return failure(
      500,
      counselingErrorCodes.categoryCreateError,
      error.message,
    );
  }

  const parsed = CategoryTableRowSchema.safeParse(data);
  if (!parsed.success) {
    return failure(
      500,
      counselingErrorCodes.categoryValidationError,
      'Created category validation failed',
      parsed.error.format(),
    );
  }

  return success(mapCategoryRowToResponse(parsed.data));
}

// ============================================================================
// SESSION SERVICES
// ============================================================================

/**
 * Create new session
 */
export async function createSession(
  client: SupabaseClient,
  userId: string,
  input: CreateSessionInput,
): Promise<HandlerResult<SessionResponse, CounselingServiceError, unknown>> {
  const { data, error } = await client
    .from(SESSION_TABLE)
    .insert({
      user_id: userId,
      category_id: input.categoryId,
      title: input.title,
      initial_responses: input.initialResponses ?? {},
      status: 'active',
      metadata: { messageCount: 0 },
    })
    .select()
    .single<SessionTableRow>();

  if (error) {
    return failure(500, counselingErrorCodes.sessionCreateError, error.message);
  }

  const parsed = SessionTableRowSchema.safeParse(data);
  if (!parsed.success) {
    return failure(
      500,
      counselingErrorCodes.sessionValidationError,
      'Created session validation failed',
      parsed.error.format(),
    );
  }

  return success(mapSessionRowToResponse(parsed.data));
}

/**
 * List sessions with filters
 */
export async function listSessions(
  client: SupabaseClient,
  userId: string,
  query: SessionListQuery,
): Promise<
  HandlerResult<
    PaginatedResponse<SessionResponse>,
    CounselingServiceError,
    unknown
  >
> {
  try {
    // Build query
    let queryBuilder = client
      .from(SESSION_TABLE)
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('last_activity_at', { ascending: false });

    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }

    if (query.categoryId) {
      queryBuilder = queryBuilder.eq('category_id', query.categoryId);
    }

    const limit = query.limit ?? 20;
    const offset = query.offset ?? 0;

    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      return failure(
        500,
        counselingErrorCodes.sessionFetchError,
        error.message,
      );
    }

    const sessions: SessionResponse[] = [];
    for (const row of data || []) {
      const parsed = SessionTableRowSchema.safeParse(row);
      if (parsed.success) {
        sessions.push(mapSessionRowToResponse(parsed.data));
      }
    }

    return success({
      data: sessions,
      pagination: {
        total: count ?? 0,
        limit,
        offset,
        hasMore: (count ?? 0) > offset + sessions.length,
      },
    });
  } catch (error) {
    return failure(
      500,
      counselingErrorCodes.sessionFetchError,
      'Unexpected error fetching sessions',
      error,
    );
  }
}

/**
 * Get session by ID
 */
export async function getSessionById(
  client: SupabaseClient,
  sessionId: string,
  userId: string,
): Promise<HandlerResult<SessionResponse, CounselingServiceError, unknown>> {
  const { data, error } = await client
    .from(SESSION_TABLE)
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .maybeSingle<SessionTableRow>();

  if (error) {
    return failure(500, counselingErrorCodes.sessionFetchError, error.message);
  }

  if (!data) {
    return failure(404, counselingErrorCodes.sessionNotFound);
  }

  const parsed = SessionTableRowSchema.safeParse(data);
  if (!parsed.success) {
    return failure(
      500,
      counselingErrorCodes.sessionValidationError,
      'Session data validation failed',
      parsed.error.format(),
    );
  }

  return success(mapSessionRowToResponse(parsed.data));
}

/**
 * Update session
 */
export async function updateSession(
  client: SupabaseClient,
  sessionId: string,
  userId: string,
  input: UpdateSessionInput,
): Promise<HandlerResult<SessionResponse, CounselingServiceError, unknown>> {
  // Build update object
  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.summary !== undefined) updateData.summary = input.summary;
  if (input.thumbnail !== undefined) updateData.thumbnail = input.thumbnail;
  if (input.metadata !== undefined) {
    // Merge metadata
    const { data: currentSession } = await client
      .from(SESSION_TABLE)
      .select('metadata')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (currentSession) {
      updateData.metadata = {
        ...(currentSession.metadata || {}),
        ...input.metadata,
      };
    }
  }

  const { data, error } = await client
    .from(SESSION_TABLE)
    .update(updateData)
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select()
    .single<SessionTableRow>();

  if (error) {
    return failure(500, counselingErrorCodes.sessionUpdateError, error.message);
  }

  const parsed = SessionTableRowSchema.safeParse(data);
  if (!parsed.success) {
    return failure(
      500,
      counselingErrorCodes.sessionValidationError,
      'Updated session validation failed',
      parsed.error.format(),
    );
  }

  return success(mapSessionRowToResponse(parsed.data));
}

/**
 * Delete session (sets status to archived)
 */
export async function deleteSession(
  client: SupabaseClient,
  sessionId: string,
  userId: string,
): Promise<HandlerResult<{ success: boolean }, CounselingServiceError, unknown>> {
  const { error } = await client
    .from(SESSION_TABLE)
    .update({ status: 'archived' })
    .eq('id', sessionId)
    .eq('user_id', userId);

  if (error) {
    return failure(500, counselingErrorCodes.sessionDeleteError, error.message);
  }

  return success({ success: true });
}

/**
 * Get session statistics
 */
export async function getSessionStats(
  client: SupabaseClient,
  userId: string,
): Promise<HandlerResult<SessionStats, CounselingServiceError, unknown>> {
  try {
    // Get session counts
    const { data: sessions, error: sessionsError } = await client
      .from(SESSION_TABLE)
      .select('id, status, category_id, title, last_activity_at, metadata')
      .eq('user_id', userId);

    if (sessionsError) {
      return failure(
        500,
        counselingErrorCodes.sessionFetchError,
        sessionsError.message,
      );
    }

    const totalSessions = sessions?.length ?? 0;
    const activeSessions =
      sessions?.filter((s) => s.status === 'active').length ?? 0;
    const completedSessions =
      sessions?.filter((s) => s.status === 'completed').length ?? 0;

    // Calculate total messages and average
    let totalMessages = 0;
    for (const session of sessions || []) {
      totalMessages += (session.metadata?.messageCount as number) ?? 0;
    }
    const avgMessagesPerSession =
      totalSessions > 0 ? totalMessages / totalSessions : 0;

    // Find most active category
    const categoryCount = new Map<string, number>();
    for (const session of sessions || []) {
      const count = categoryCount.get(session.category_id) ?? 0;
      categoryCount.set(session.category_id, count + 1);
    }

    let mostActiveCategory = null;
    if (categoryCount.size > 0) {
      const [topCategoryId, topCount] = [...categoryCount.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0];

      const { data: categoryData } = await client
        .from(CATEGORY_TABLE)
        .select('name')
        .eq('id', topCategoryId)
        .single();

      if (categoryData) {
        mostActiveCategory = {
          id: topCategoryId,
          name: categoryData.name,
          sessionCount: topCount,
        };
      }
    }

    // Recent activity
    const recentActivity = (sessions || [])
      .sort(
        (a, b) =>
          new Date(b.last_activity_at).getTime() -
          new Date(a.last_activity_at).getTime(),
      )
      .slice(0, 5)
      .map((s) => ({
        sessionId: s.id,
        sessionTitle: s.title,
        lastActivityAt: new Date(s.last_activity_at),
      }));

    return success({
      totalSessions,
      activeSessions,
      completedSessions,
      totalMessages,
      avgMessagesPerSession,
      mostActiveCategory,
      recentActivity,
    });
  } catch (error) {
    return failure(
      500,
      counselingErrorCodes.sessionFetchError,
      'Unexpected error fetching stats',
      error,
    );
  }
}

// ============================================================================
// MESSAGE SERVICES
// ============================================================================

/**
 * Create message
 */
export async function createMessage(
  client: SupabaseClient,
  sessionId: string,
  userId: string,
  input: CreateMessageInput,
): Promise<HandlerResult<MessageResponse, CounselingServiceError, unknown>> {
  const { data, error } = await client
    .from(MESSAGE_TABLE)
    .insert({
      session_id: sessionId,
      sender_id: userId,
      content: input.content,
      message_type: input.messageType ?? 'text',
      metadata: input.metadata ?? null,
    })
    .select()
    .single<MessageTableRow>();

  if (error) {
    return failure(500, counselingErrorCodes.messageCreateError, error.message);
  }

  const parsed = MessageTableRowSchema.safeParse(data);
  if (!parsed.success) {
    return failure(
      500,
      counselingErrorCodes.messageValidationError,
      'Created message validation failed',
      parsed.error.format(),
    );
  }

  return success(mapMessageRowToResponse(parsed.data));
}

/**
 * List messages with pagination
 */
export async function listMessages(
  client: SupabaseClient,
  sessionId: string,
  userId: string,
  query: MessageListQuery,
): Promise<
  HandlerResult<
    PaginatedResponse<MessageResponse>,
    CounselingServiceError,
    unknown
  >
> {
  try {
    // Verify session access
    const { data: session } = await client
      .from(SESSION_TABLE)
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (!session) {
      return failure(404, counselingErrorCodes.sessionNotFound);
    }

    // Build query
    let queryBuilder = client
      .from(MESSAGE_TABLE)
      .select('*', { count: 'exact' })
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    const limit = query.limit ?? 50;

    if (query.cursor) {
      // Cursor-based pagination
      const { data: cursorMessage } = await client
        .from(MESSAGE_TABLE)
        .select('created_at')
        .eq('id', query.cursor)
        .single();

      if (cursorMessage) {
        queryBuilder = queryBuilder.lt('created_at', cursorMessage.created_at);
      }
    }

    if (query.beforeDate) {
      queryBuilder = queryBuilder.lt('created_at', query.beforeDate.toISOString());
    }

    queryBuilder = queryBuilder.limit(limit);

    const { data, error, count } = await queryBuilder;

    if (error) {
      return failure(
        500,
        counselingErrorCodes.messageFetchError,
        error.message,
      );
    }

    const messages: MessageResponse[] = [];
    for (const row of data || []) {
      const parsed = MessageTableRowSchema.safeParse(row);
      if (parsed.success) {
        messages.push(mapMessageRowToResponse(parsed.data));
      }
    }

    const lastMessage = messages[messages.length - 1];

    return success({
      data: messages,
      pagination: {
        total: count ?? 0,
        limit,
        cursor: lastMessage?.id ?? null,
        hasMore: (data?.length ?? 0) === limit,
      },
    });
  } catch (error) {
    return failure(
      500,
      counselingErrorCodes.messageFetchError,
      'Unexpected error fetching messages',
      error,
    );
  }
}

/**
 * Toggle message bookmark
 */
export async function toggleBookmark(
  client: SupabaseClient,
  messageId: string,
  userId: string,
): Promise<HandlerResult<MessageResponse, CounselingServiceError, unknown>> {
  // First, get the message and verify access
  const { data: message, error: fetchError } = await client
    .from(MESSAGE_TABLE)
    .select('*, counseling_sessions!inner(user_id)')
    .eq('id', messageId)
    .single();

  if (fetchError || !message) {
    return failure(404, counselingErrorCodes.messageNotFound);
  }

  // @ts-expect-error - Supabase join syntax
  if (message.counseling_sessions.user_id !== userId) {
    return failure(403, counselingErrorCodes.messageUnauthorized);
  }

  // Toggle bookmark
  const { data, error } = await client
    .from(MESSAGE_TABLE)
    .update({ is_bookmarked: !message.is_bookmarked })
    .eq('id', messageId)
    .select()
    .single<MessageTableRow>();

  if (error) {
    return failure(500, counselingErrorCodes.messageUpdateError, error.message);
  }

  const parsed = MessageTableRowSchema.safeParse(data);
  if (!parsed.success) {
    return failure(
      500,
      counselingErrorCodes.messageValidationError,
      'Updated message validation failed',
      parsed.error.format(),
    );
  }

  return success(mapMessageRowToResponse(parsed.data));
}
