/**
 * Counseling Dashboard Page
 * Lists all sessions with filters and stats
 */

import { Suspense } from 'react';
import { SessionDashboard } from '@/features/counseling/components/SessionDashboard';
import { SessionList } from '@/features/counseling/components/SessionList';

export default function CounselingPage() {
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">상담 관리</h1>
        <p className="text-muted-foreground">
          진행 중인 상담을 확인하고 새로운 상담을 시작하세요
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <div className="space-y-8">
          <SessionDashboard />
          <SessionList />
        </div>
      </Suspense>
    </div>
  );
}
