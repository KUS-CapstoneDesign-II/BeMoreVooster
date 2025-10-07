/**
 * Session List Component
 * Displays user's counseling sessions grouped by status
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSessions } from '../hooks/useCounselingQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  MessageCircle,
  Plus,
  Clock,
  CheckCircle,
  Pause,
  Archive,
} from 'lucide-react';
import type { SessionStatus } from '../lib/types';

const statusConfig = {
  active: {
    label: '진행 중',
    icon: MessageCircle,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  },
  paused: {
    label: '일시정지',
    icon: Pause,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  },
  completed: {
    label: '완료',
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  },
  archived: {
    label: '보관됨',
    icon: Archive,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  },
};

export function SessionList() {
  const [statusFilter, setStatusFilter] = useState<SessionStatus | undefined>(
    'active',
  );
  const { data, isLoading } = useSessions({ status: statusFilter });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 border rounded-lg animate-pulse bg-muted/50"
          >
            <div className="h-6 bg-muted rounded w-1/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const sessions = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">내 상담</h2>
          {data && (
            <Badge variant="secondary">{data.pagination.total}개</Badge>
          )}
        </div>
        <Link href="/counseling/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 상담 시작
          </Button>
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={statusFilter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('active')}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          진행 중
        </Button>
        <Button
          variant={statusFilter === 'paused' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('paused')}
        >
          <Pause className="h-4 w-4 mr-2" />
          일시정지
        </Button>
        <Button
          variant={statusFilter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('completed')}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          완료
        </Button>
        <Button
          variant={statusFilter === undefined ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(undefined)}
        >
          전체
        </Button>
      </div>

      <Separator />

      {/* Session List */}
      {sessions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            {statusFilter
              ? `${statusConfig[statusFilter].label} 상담이 없습니다`
              : '상담이 없습니다'}
          </h3>
          <p className="text-muted-foreground mb-4">
            새로운 상담을 시작해보세요
          </p>
          <Link href="/counseling/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              상담 시작하기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const StatusIcon = statusConfig[session.status].icon;
            const messageCount = session.metadata?.messageCount || 0;

            return (
              <Link
                key={session.id}
                href={`/counseling/${session.id}`}
                className="block"
              >
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className={statusConfig[session.status].color}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[session.status].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      {messageCount}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {session.title}
                  </h3>

                  {/* Tags */}
                  {session.metadata.tags && session.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {session.metadata.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Last Activity */}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(session.lastActivityAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.hasMore && (
        <div className="text-center">
          <Button variant="outline">더 보기</Button>
        </div>
      )}
    </div>
  );
}
