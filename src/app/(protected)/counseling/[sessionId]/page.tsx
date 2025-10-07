/**
 * Counseling Session Chat Page
 * Main chat interface for a specific session
 */

'use client';

import { use } from 'react';
import { SessionChat } from '@/features/counseling/components/SessionChat';
import { useSession } from '@/features/counseling/hooks/useCounselingQueries';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default function CounselingSessionPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const { data: session, isLoading, error } = useSession(sessionId);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    notFound();
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <SessionChat sessionId={sessionId} />
    </div>
  );
}
