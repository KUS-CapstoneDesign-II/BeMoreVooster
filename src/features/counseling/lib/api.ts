/**
 * Counseling Session Management - API Client
 * @module counseling/lib/api
 */

import { apiClient } from '@/lib/remote/api-client';
import type {
  CounselingCategory,
  CounselingSession,
  CounselingMessage,
  CreateCategoryInput,
  CreateSessionInput,
  UpdateSessionInput,
  CreateMessageInput,
  SessionListQuery,
  MessageListQuery,
  SessionStats,
  PaginatedResponse,
  CategoryListResponse,
} from './types';

const BASE_PATH = '/counseling';

// ============================================================================
// CATEGORY API
// ============================================================================

/**
 * List all categories
 */
export async function listCategories(): Promise<CategoryListResponse> {
  const response = await apiClient.get<CategoryListResponse>(
    `${BASE_PATH}/categories`,
  );
  return response.data;
}

/**
 * Get category by ID
 */
export async function getCategoryById(
  categoryId: string,
): Promise<CounselingCategory> {
  const response = await apiClient.get<CounselingCategory>(
    `${BASE_PATH}/categories/${categoryId}`,
  );
  return response.data;
}

/**
 * Create custom category
 */
export async function createCustomCategory(
  input: CreateCategoryInput,
): Promise<CounselingCategory> {
  const response = await apiClient.post<CounselingCategory>(
    `${BASE_PATH}/categories`,
    input,
  );
  return response.data;
}

// ============================================================================
// SESSION API
// ============================================================================

/**
 * List sessions
 */
export async function listSessions(
  query?: SessionListQuery,
): Promise<PaginatedResponse<CounselingSession>> {
  const response = await apiClient.get<PaginatedResponse<CounselingSession>>(
    `${BASE_PATH}/sessions`,
    { params: query },
  );
  return response.data;
}

/**
 * Create session
 */
export async function createSession(
  input: CreateSessionInput,
): Promise<CounselingSession> {
  const response = await apiClient.post<CounselingSession>(
    `${BASE_PATH}/sessions`,
    input,
  );
  return response.data;
}

/**
 * Get session by ID
 */
export async function getSessionById(
  sessionId: string,
): Promise<CounselingSession> {
  const response = await apiClient.get<CounselingSession>(
    `${BASE_PATH}/sessions/${sessionId}`,
  );
  return response.data;
}

/**
 * Update session
 */
export async function updateSession(
  sessionId: string,
  input: UpdateSessionInput,
): Promise<CounselingSession> {
  const response = await apiClient.patch<CounselingSession>(
    `${BASE_PATH}/sessions/${sessionId}`,
    input,
  );
  return response.data;
}

/**
 * Delete (archive) session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/sessions/${sessionId}`);
}

/**
 * Get session statistics
 */
export async function getSessionStats(): Promise<SessionStats> {
  const response = await apiClient.get<SessionStats>(
    `${BASE_PATH}/sessions/stats`,
  );
  return response.data;
}

// ============================================================================
// MESSAGE API
// ============================================================================

/**
 * List messages in session
 */
export async function listMessages(
  sessionId: string,
  query?: MessageListQuery,
): Promise<PaginatedResponse<CounselingMessage>> {
  const response = await apiClient.get<PaginatedResponse<CounselingMessage>>(
    `${BASE_PATH}/sessions/${sessionId}/messages`,
    { params: query },
  );
  return response.data;
}

/**
 * Send message
 */
export async function sendMessage(
  sessionId: string,
  input: CreateMessageInput,
): Promise<CounselingMessage> {
  const response = await apiClient.post<CounselingMessage>(
    `${BASE_PATH}/sessions/${sessionId}/messages`,
    input,
  );
  return response.data;
}

/**
 * Toggle message bookmark
 */
export async function toggleMessageBookmark(
  messageId: string,
): Promise<CounselingMessage> {
  const response = await apiClient.patch<CounselingMessage>(
    `${BASE_PATH}/messages/${messageId}/bookmark`,
  );
  return response.data;
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export const counselingApi = {
  // Categories
  listCategories,
  getCategoryById,
  createCustomCategory,

  // Sessions
  listSessions,
  createSession,
  getSessionById,
  updateSession,
  deleteSession,
  getSessionStats,

  // Messages
  listMessages,
  sendMessage,
  toggleMessageBookmark,
};
