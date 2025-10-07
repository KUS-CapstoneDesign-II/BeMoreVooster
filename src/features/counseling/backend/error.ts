/**
 * Counseling Session Management - Error Definitions
 * @module counseling/backend/error
 */

// ============================================================================
// ERROR CODES
// ============================================================================

export const counselingErrorCodes = {
  // Category errors
  categoryNotFound: 'CATEGORY_NOT_FOUND',
  categoryFetchError: 'CATEGORY_FETCH_ERROR',
  categoryCreateError: 'CATEGORY_CREATE_ERROR',
  categoryValidationError: 'CATEGORY_VALIDATION_ERROR',
  categoryDeleteError: 'CATEGORY_DELETE_ERROR',

  // Session errors
  sessionNotFound: 'SESSION_NOT_FOUND',
  sessionFetchError: 'SESSION_FETCH_ERROR',
  sessionCreateError: 'SESSION_CREATE_ERROR',
  sessionUpdateError: 'SESSION_UPDATE_ERROR',
  sessionDeleteError: 'SESSION_DELETE_ERROR',
  sessionValidationError: 'SESSION_VALIDATION_ERROR',
  sessionUnauthorized: 'SESSION_UNAUTHORIZED',

  // Message errors
  messageNotFound: 'MESSAGE_NOT_FOUND',
  messageFetchError: 'MESSAGE_FETCH_ERROR',
  messageCreateError: 'MESSAGE_CREATE_ERROR',
  messageUpdateError: 'MESSAGE_UPDATE_ERROR',
  messageValidationError: 'MESSAGE_VALIDATION_ERROR',
  messageUnauthorized: 'MESSAGE_UNAUTHORIZED',

  // General errors
  invalidRequest: 'INVALID_REQUEST',
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  internalError: 'INTERNAL_ERROR',
} as const;

export type CounselingErrorCode =
  (typeof counselingErrorCodes)[keyof typeof counselingErrorCodes];

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface CounselingServiceError {
  code: CounselingErrorCode;
  message: string;
  details?: unknown;
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const errorMessages: Record<CounselingErrorCode, string> = {
  // Category errors
  CATEGORY_NOT_FOUND: 'The requested category was not found',
  CATEGORY_FETCH_ERROR: 'Failed to fetch categories',
  CATEGORY_CREATE_ERROR: 'Failed to create category',
  CATEGORY_VALIDATION_ERROR: 'Category data validation failed',
  CATEGORY_DELETE_ERROR: 'Failed to delete category',

  // Session errors
  SESSION_NOT_FOUND: 'The requested session was not found',
  SESSION_FETCH_ERROR: 'Failed to fetch sessions',
  SESSION_CREATE_ERROR: 'Failed to create session',
  SESSION_UPDATE_ERROR: 'Failed to update session',
  SESSION_DELETE_ERROR: 'Failed to delete session',
  SESSION_VALIDATION_ERROR: 'Session data validation failed',
  SESSION_UNAUTHORIZED: 'You are not authorized to access this session',

  // Message errors
  MESSAGE_NOT_FOUND: 'The requested message was not found',
  MESSAGE_FETCH_ERROR: 'Failed to fetch messages',
  MESSAGE_CREATE_ERROR: 'Failed to create message',
  MESSAGE_UPDATE_ERROR: 'Failed to update message',
  MESSAGE_VALIDATION_ERROR: 'Message data validation failed',
  MESSAGE_UNAUTHORIZED: 'You are not authorized to access this message',

  // General errors
  INVALID_REQUEST: 'The request contains invalid data',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'You do not have permission to perform this action',
  INTERNAL_ERROR: 'An internal error occurred',
};

// ============================================================================
// ERROR HELPERS
// ============================================================================

/**
 * Create a service error
 */
export function createError(
  code: CounselingErrorCode,
  message?: string,
  details?: unknown,
): CounselingServiceError {
  return {
    code,
    message: message ?? errorMessages[code],
    details,
  };
}

/**
 * Check if error is a specific type
 */
export function isErrorCode(
  error: CounselingServiceError,
  code: CounselingErrorCode,
): boolean {
  return error.code === code;
}
