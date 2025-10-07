/**
 * Counseling Session Management - API Routes
 * @module counseling/backend/route
 */

import type { Hono } from 'hono';
import { failure, respond } from '@/backend/http/response';
import {
  getLogger,
  getSupabase,
  type AppEnv,
} from '@/backend/hono/context';
import {
  CreateCategoryRequestSchema,
  CreateSessionRequestSchema,
  UpdateSessionRequestSchema,
  CreateMessageRequestSchema,
  SessionListQuerySchema,
  MessageListQuerySchema,
  SessionIdParamSchema,
  MessageIdParamSchema,
  CategoryIdParamSchema,
} from './schema';
import {
  listCategories,
  getCategoryById,
  createCustomCategory,
  createSession,
  listSessions,
  getSessionById,
  updateSession,
  deleteSession,
  getSessionStats,
  createMessage,
  listMessages,
  toggleBookmark,
} from './service';
import { counselingErrorCodes } from './error';

/**
 * Register counseling routes
 */
export const registerCounselingRoutes = (app: Hono<AppEnv>) => {
  // =========================================================================
  // CATEGORY ROUTES
  // =========================================================================

  /**
   * GET /counseling/categories
   * List all categories (default + user's custom)
   */
  app.get('/counseling/categories', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Get user from Supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthenticated request to list categories');
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    const result = await listCategories(supabase, user.id);

    if (!result.ok) {
      logger.error('Failed to fetch categories', result.error);
    }

    return respond(c, result);
  });

  /**
   * GET /counseling/categories/:categoryId
   * Get category by ID
   */
  app.get('/counseling/categories/:categoryId', async (c) => {
    const parsedParams = CategoryIdParamSchema.safeParse({
      categoryId: c.req.param('categoryId'),
    });

    if (!parsedParams.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.invalidRequest,
          'Invalid category ID',
          parsedParams.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const result = await getCategoryById(supabase, parsedParams.data.categoryId);

    if (!result.ok) {
      getLogger(c).error('Failed to fetch category', result.error);
    }

    return respond(c, result);
  });

  /**
   * POST /counseling/categories
   * Create custom category
   */
  app.post('/counseling/categories', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    // Parse body
    const body = await c.req.json();
    const parsedBody = CreateCategoryRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.categoryValidationError,
          'Invalid category data',
          parsedBody.error.format(),
        ),
      );
    }

    const result = await createCustomCategory(
      supabase,
      user.id,
      parsedBody.data,
    );

    if (!result.ok) {
      logger.error('Failed to create custom category', result.error);
    }

    return respond(c, result);
  });

  // =========================================================================
  // SESSION ROUTES
  // =========================================================================

  /**
   * GET /counseling/sessions
   * List sessions with filters
   */
  app.get('/counseling/sessions', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    // Parse query params
    const query = c.req.query();
    const parsedQuery = SessionListQuerySchema.safeParse(query);

    if (!parsedQuery.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.invalidRequest,
          'Invalid query parameters',
          parsedQuery.error.format(),
        ),
      );
    }

    const result = await listSessions(supabase, user.id, parsedQuery.data);

    if (!result.ok) {
      logger.error('Failed to fetch sessions', result.error);
    }

    return respond(c, result);
  });

  /**
   * POST /counseling/sessions
   * Create new session
   */
  app.post('/counseling/sessions', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    // Parse body
    const body = await c.req.json();
    const parsedBody = CreateSessionRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.sessionValidationError,
          'Invalid session data',
          parsedBody.error.format(),
        ),
      );
    }

    const result = await createSession(supabase, user.id, parsedBody.data);

    if (!result.ok) {
      logger.error('Failed to create session', result.error);
    }

    return respond(c, result);
  });

  /**
   * GET /counseling/sessions/stats
   * Get session statistics
   */
  app.get('/counseling/sessions/stats', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    const result = await getSessionStats(supabase, user.id);

    if (!result.ok) {
      logger.error('Failed to fetch session stats', result.error);
    }

    return respond(c, result);
  });

  /**
   * GET /counseling/sessions/:sessionId
   * Get session by ID
   */
  app.get('/counseling/sessions/:sessionId', async (c) => {
    const parsedParams = SessionIdParamSchema.safeParse({
      sessionId: c.req.param('sessionId'),
    });

    if (!parsedParams.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.invalidRequest,
          'Invalid session ID',
          parsedParams.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    const result = await getSessionById(
      supabase,
      parsedParams.data.sessionId,
      user.id,
    );

    if (!result.ok) {
      logger.error('Failed to fetch session', result.error);
    }

    return respond(c, result);
  });

  /**
   * PATCH /counseling/sessions/:sessionId
   * Update session
   */
  app.patch('/counseling/sessions/:sessionId', async (c) => {
    const parsedParams = SessionIdParamSchema.safeParse({
      sessionId: c.req.param('sessionId'),
    });

    if (!parsedParams.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.invalidRequest,
          'Invalid session ID',
          parsedParams.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    // Parse body
    const body = await c.req.json();
    const parsedBody = UpdateSessionRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.sessionValidationError,
          'Invalid update data',
          parsedBody.error.format(),
        ),
      );
    }

    const result = await updateSession(
      supabase,
      parsedParams.data.sessionId,
      user.id,
      parsedBody.data,
    );

    if (!result.ok) {
      logger.error('Failed to update session', result.error);
    }

    return respond(c, result);
  });

  /**
   * DELETE /counseling/sessions/:sessionId
   * Archive session
   */
  app.delete('/counseling/sessions/:sessionId', async (c) => {
    const parsedParams = SessionIdParamSchema.safeParse({
      sessionId: c.req.param('sessionId'),
    });

    if (!parsedParams.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.invalidRequest,
          'Invalid session ID',
          parsedParams.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    const result = await deleteSession(
      supabase,
      parsedParams.data.sessionId,
      user.id,
    );

    if (!result.ok) {
      logger.error('Failed to delete session', result.error);
    }

    return respond(c, result);
  });

  // =========================================================================
  // MESSAGE ROUTES
  // =========================================================================

  /**
   * GET /counseling/sessions/:sessionId/messages
   * List messages in session
   */
  app.get('/counseling/sessions/:sessionId/messages', async (c) => {
    const parsedParams = SessionIdParamSchema.safeParse({
      sessionId: c.req.param('sessionId'),
    });

    if (!parsedParams.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.invalidRequest,
          'Invalid session ID',
          parsedParams.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    // Parse query
    const query = c.req.query();
    const parsedQuery = MessageListQuerySchema.safeParse(query);

    if (!parsedQuery.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.invalidRequest,
          'Invalid query parameters',
          parsedQuery.error.format(),
        ),
      );
    }

    const result = await listMessages(
      supabase,
      parsedParams.data.sessionId,
      user.id,
      parsedQuery.data,
    );

    if (!result.ok) {
      logger.error('Failed to fetch messages', result.error);
    }

    return respond(c, result);
  });

  /**
   * POST /counseling/sessions/:sessionId/messages
   * Create message in session
   */
  app.post('/counseling/sessions/:sessionId/messages', async (c) => {
    const parsedParams = SessionIdParamSchema.safeParse({
      sessionId: c.req.param('sessionId'),
    });

    if (!parsedParams.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.invalidRequest,
          'Invalid session ID',
          parsedParams.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    // Parse body
    const body = await c.req.json();
    const parsedBody = CreateMessageRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.messageValidationError,
          'Invalid message data',
          parsedBody.error.format(),
        ),
      );
    }

    const result = await createMessage(
      supabase,
      parsedParams.data.sessionId,
      user.id,
      parsedBody.data,
    );

    if (!result.ok) {
      logger.error('Failed to create message', result.error);
    }

    return respond(c, result);
  });

  /**
   * PATCH /counseling/messages/:messageId/bookmark
   * Toggle message bookmark
   */
  app.patch('/counseling/messages/:messageId/bookmark', async (c) => {
    const parsedParams = MessageIdParamSchema.safeParse({
      messageId: c.req.param('messageId'),
    });

    if (!parsedParams.success) {
      return respond(
        c,
        failure(
          400,
          counselingErrorCodes.invalidRequest,
          'Invalid message ID',
          parsedParams.error.format(),
        ),
      );
    }

    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return respond(
        c,
        failure(401, counselingErrorCodes.unauthorized, 'Authentication required'),
      );
    }

    const result = await toggleBookmark(
      supabase,
      parsedParams.data.messageId,
      user.id,
    );

    if (!result.ok) {
      logger.error('Failed to toggle bookmark', result.error);
    }

    return respond(c, result);
  });
};
