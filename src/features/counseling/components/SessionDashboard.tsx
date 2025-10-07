/**
 * Session Dashboard Component
 * Displays session statistics and overview
 */

'use client';

import { useSessionStats } from '../hooks/useCounselingQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageCircle,
  Activity,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

export function SessionDashboard() {
  const { data: stats, isLoading } = useSessionStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: '전체 상담',
      value: stats.totalSessions,
      icon: MessageCircle,
      description: '총 상담 세션',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: '진행 중',
      value: stats.activeSessions,
      icon: Activity,
      description: '활성 상담',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: '완료',
      value: stats.completedSessions,
      icon: CheckCircle,
      description: '완료된 상담',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: '평균 메시지',
      value: Math.round(stats.avgMessagesPerSession),
      icon: TrendingUp,
      description: '세션당 평균',
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Most Active Category */}
      {stats.mostActiveCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">가장 많은 상담 주제</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">
                  {stats.mostActiveCategory.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stats.mostActiveCategory.sessionCount}개의 세션
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
