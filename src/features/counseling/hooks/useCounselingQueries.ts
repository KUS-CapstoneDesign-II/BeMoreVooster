/**
 * Counseling Session Management - React Query Hooks
 * @module counseling/hooks/useCounselingQueries
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { counselingApi } from '../lib/api';
import type {
  SessionStatus,
  CreateCategoryInput,
  CreateSessionInput,
  UpdateSessionInput,
  CreateMessageInput,
  SessionListQuery,
  MessageListQuery,
} from '../lib/types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const counselingKeys = {
  all: ['counseling'] as const,

  // Categories
  categories: () => [...counselingKeys.all, 'categories'] as const,
  category: (id: string) => [...counselingKeys.categories(), id] as const,

  // Sessions
  sessions: () => [...counselingKeys.all, 'sessions'] as const,
  sessionList: (filters?: { status?: SessionStatus; categoryId?: string }) =>
    [...counselingKeys.sessions(), 'list', filters] as const,
  sessionDetail: (id: string) => [...counselingKeys.sessions(), 'detail', id] as const,
  sessionStats: () => [...counselingKeys.sessions(), 'stats'] as const,

  // Messages
  messages: (sessionId: string) =>
    [...counselingKeys.all, 'messages', sessionId] as const,
};

// ============================================================================
// CATEGORY HOOKS
// ============================================================================

/**
 * Get all categories (default + custom)
 */
export function useCategories() {
  return useQuery({
    queryKey: counselingKeys.categories(),
    queryFn: counselingApi.listCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get single category
 */
export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: counselingKeys.category(categoryId),
    queryFn: () => counselingApi.getCategoryById(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Create custom category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      counselingApi.createCustomCategory(input),
    onSuccess: () => {
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: counselingKeys.categories() });
    },
  });
}

// ============================================================================
// SESSION HOOKS
// ============================================================================

/**
 * List sessions with optional filters
 */
export function useSessions(query?: SessionListQuery) {
  return useQuery({
    queryKey: counselingKeys.sessionList({
      status: query?.status,
      categoryId: query?.categoryId,
    }),
    queryFn: () => counselingApi.listSessions(query),
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Get single session
 */
export function useSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: counselingKeys.sessionDetail(sessionId!),
    queryFn: () => counselingApi.getSessionById(sessionId!),
    enabled: !!sessionId,
  });
}

/**
 * Get session statistics
 */
export function useSessionStats() {
  return useQuery({
    queryKey: counselingKeys.sessionStats(),
    queryFn: counselingApi.getSessionStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Create new session
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSessionInput) =>
      counselingApi.createSession(input),
    onSuccess: () => {
      // Invalidate all session lists and stats
      queryClient.invalidateQueries({ queryKey: counselingKeys.sessions() });
    },
  });
}

/**
 * Update session
 */
export function useUpdateSession(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateSessionInput) =>
      counselingApi.updateSession(sessionId, input),
    onSuccess: (data) => {
      // Update specific session cache
      queryClient.setQueryData(
        counselingKeys.sessionDetail(sessionId),
        data,
      );
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: counselingKeys.sessions() });
    },
  });
}

/**
 * Delete (archive) session
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => counselingApi.deleteSession(sessionId),
    onSuccess: () => {
      // Invalidate all session queries
      queryClient.invalidateQueries({ queryKey: counselingKeys.sessions() });
    },
  });
}

// ============================================================================
// MESSAGE HOOKS
// ============================================================================

/**
 * List messages in a session
 */
export function useMessages(sessionId: string | undefined, query?: MessageListQuery) {
  return useQuery({
    queryKey: counselingKeys.messages(sessionId!),
    queryFn: () => counselingApi.listMessages(sessionId!, query),
    enabled: !!sessionId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Send message
 */
export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMessageInput) =>
      counselingApi.sendMessage(sessionId, input),
    onSuccess: () => {
      // Invalidate messages list
      queryClient.invalidateQueries({
        queryKey: counselingKeys.messages(sessionId),
      });
      // Invalidate session to update lastActivityAt
      queryClient.invalidateQueries({
        queryKey: counselingKeys.sessionDetail(sessionId),
      });
      // Invalidate session lists
      queryClient.invalidateQueries({
        queryKey: counselingKeys.sessions(),
      });
    },
  });
}

/**
 * Toggle message bookmark
 */
export function useToggleBookmark(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) =>
      counselingApi.toggleMessageBookmark(messageId),
    onSuccess: () => {
      // Invalidate messages to reflect bookmark change
      queryClient.invalidateQueries({
        queryKey: counselingKeys.messages(sessionId),
      });
    },
  });
}

// ============================================================================
// COMBINED HOOKS
// ============================================================================

/**
 * Hook for session creation flow
 * Returns categories and create mutation
 */
export function useSessionCreation() {
  const categories = useCategories();
  const createSession = useCreateSession();

  return {
    categories: categories.data,
    isLoadingCategories: categories.isLoading,
    createSession: createSession.mutateAsync,
    isCreating: createSession.isPending,
    error: createSession.error,
  };
}

/**
 * Hook for session chat view
 * Returns session, messages, and send mutation
 */
export function useSessionChat(sessionId: string | undefined) {
  const session = useSession(sessionId);
  const messages = useMessages(sessionId);
  const sendMessage = useSendMessage(sessionId!);
  const toggleBookmark = useToggleBookmark(sessionId!);

  return {
    session: session.data,
    isLoadingSession: session.isLoading,
    messages: messages.data?.data || [],
    isLoadingMessages: messages.isLoading,
    sendMessage: sendMessage.mutateAsync,
    isSending: sendMessage.isPending,
    toggleBookmark: toggleBookmark.mutateAsync,
    isTogglingBookmark: toggleBookmark.isPending,
  };
}
