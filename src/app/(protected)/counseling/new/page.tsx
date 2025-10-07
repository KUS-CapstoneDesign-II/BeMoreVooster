/**
 * New Counseling Session Page
 * Flow: Category selection → Initial questions → Session creation
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategorySelector } from '@/features/counseling/components/CategorySelector';
import { InitialQuestions } from '@/features/counseling/components/InitialQuestions';
import { useSessionCreation } from '@/features/counseling/hooks/useCounselingQueries';
import { useToast } from '@/hooks/use-toast';
import type { CounselingCategory, InitialResponse } from '@/features/counseling/lib/types';

type Step = 'category' | 'questions' | 'creating';

export default function NewCounselingSessionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { categories, isLoadingCategories, createSession, isCreating } =
    useSessionCreation();

  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] =
    useState<CounselingCategory | null>(null);
  const [sessionTitle, setSessionTitle] = useState('');
  const [initialResponses, setInitialResponses] = useState<
    Record<string, InitialResponse>
  >({});

  const handleCategorySelect = (category: CounselingCategory, title: string) => {
    setSelectedCategory(category);
    setSessionTitle(title);

    // If no initial questions, create session immediately
    if (!category.initialQuestions || category.initialQuestions.length === 0) {
      handleCreateSession(title, {});
    } else {
      setStep('questions');
    }
  };

  const handleQuestionsComplete = (responses: Record<string, InitialResponse>) => {
    setInitialResponses(responses);
    handleCreateSession(sessionTitle, responses);
  };

  const handleCreateSession = async (
    title: string,
    responses: Record<string, InitialResponse>,
  ) => {
    if (!selectedCategory) return;

    try {
      setStep('creating');
      const session = await createSession({
        categoryId: selectedCategory.id,
        title,
        initialResponses: responses,
      });

      toast({
        title: '상담 세션이 생성되었습니다',
        description: '이제 상담을 시작할 수 있습니다',
      });

      // Navigate to session chat
      router.push(`/counseling/${session.id}`);
    } catch (error) {
      toast({
        title: '세션 생성 실패',
        description: '다시 시도해주세요',
        variant: 'destructive',
      });
      setStep(selectedCategory.initialQuestions.length > 0 ? 'questions' : 'category');
    }
  };

  if (isLoadingCategories) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">새 상담 시작하기</h1>
        <p className="text-muted-foreground">
          {step === 'category' && '상담 주제를 선택해주세요'}
          {step === 'questions' && '몇 가지 질문에 답변해주세요'}
          {step === 'creating' && '상담 세션을 생성하고 있습니다...'}
        </p>
      </div>

      {step === 'category' && categories && (
        <CategorySelector
          categories={categories}
          onSelect={handleCategorySelect}
        />
      )}

      {step === 'questions' && selectedCategory && (
        <InitialQuestions
          questions={selectedCategory.initialQuestions}
          onComplete={handleQuestionsComplete}
          onBack={() => setStep('category')}
        />
      )}

      {step === 'creating' && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">세션을 생성하고 있습니다...</p>
          </div>
        </div>
      )}
    </div>
  );
}
