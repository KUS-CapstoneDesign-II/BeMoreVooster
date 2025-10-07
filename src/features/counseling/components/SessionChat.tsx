/**
 * Session Chat Component
 * Main chat interface for a counseling session
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useSessionChat } from '../hooks/useCounselingQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Send,
  Bookmark,
  Settings,
  ArrowLeft,
  MessageCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

interface SessionChatProps {
  sessionId: string;
}

export function SessionChat({ sessionId }: SessionChatProps) {
  const { user } = useCurrentUser();
  const {
    session,
    isLoadingSession,
    messages,
    isLoadingMessages,
    sendMessage,
    isSending,
    toggleBookmark,
  } = useSessionChat(sessionId);

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!messageInput.trim() || isSending) return;

    try {
      await sendMessage({ content: messageInput.trim() });
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoadingSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">세션을 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/counseling">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">{session.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-3 w-3" />
                  <span>{session.metadata.messageCount || 0}개 메시지</span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(session.lastActivityAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{session.status}</Badge>
              <Link href={`/counseling/${sessionId}/settings`}>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-5xl px-4 py-6">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                대화를 시작해보세요
              </h3>
              <p className="text-muted-foreground">
                첫 메시지를 보내서 상담을 시작하세요
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.senderId === user?.id;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isCurrentUser ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {isCurrentUser ? 'You' : 'C'}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`flex-1 max-w-[70%] ${
                        isCurrentUser ? 'items-end' : ''
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                        {isCurrentUser && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleBookmark(message.id)}
                          >
                            <Bookmark
                              className={`h-3 w-3 ${
                                message.isBookmarked ? 'fill-current' : ''
                              }`}
                            />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="메시지를 입력하세요... (Shift + Enter로 줄바꿈)"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="min-h-[44px] max-h-[200px] resize-none"
              disabled={isSending}
            />
            <Button
              onClick={handleSend}
              disabled={!messageInput.trim() || isSending}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
