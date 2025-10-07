/**
 * Initial Questions Component
 * Collects answers to category-specific initial questions
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Question, InitialResponse } from '../lib/types';

interface InitialQuestionsProps {
  questions: Question[];
  onComplete: (responses: Record<string, InitialResponse>) => void;
  onBack: () => void;
}

export function InitialQuestions({
  questions,
  onComplete,
  onBack,
}: InitialQuestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, InitialResponse>>({});

  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
  const currentQuestion = sortedQuestions[currentIndex];
  const progress = ((currentIndex + 1) / sortedQuestions.length) * 100;

  const currentAnswer = responses[currentQuestion.id]?.answer;

  const handleAnswer = (answer: string | string[]) => {
    setResponses({
      ...responses,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        answer,
        timestamp: new Date(),
      },
    });
  };

  const canProceed = () => {
    if (!currentQuestion.required) return true;
    const answer = responses[currentQuestion.id]?.answer;
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return answer.trim().length > 0;
  };

  const handleNext = () => {
    if (currentIndex < sortedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onBack();
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            질문 {currentIndex + 1} / {sortedQuestions.length}
          </span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Question Card */}
      <div className="p-6 border rounded-lg bg-card space-y-6">
        {/* Question Text */}
        <div>
          <Label className="text-lg font-semibold">
            {currentQuestion.text}
            {currentQuestion.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </Label>
        </div>

        {/* Answer Input */}
        <div className="space-y-4">
          {/* Text Input */}
          {currentQuestion.type === 'text' && (
            <Textarea
              placeholder="답변을 입력해주세요"
              value={(currentAnswer as string) || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              rows={4}
            />
          )}

          {/* Select (Radio) */}
          {currentQuestion.type === 'select' && currentQuestion.options && (
            <RadioGroup
              value={(currentAnswer as string) || ''}
              onValueChange={handleAnswer}
            >
              {currentQuestion.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Multiselect (Checkboxes) */}
          {currentQuestion.type === 'multiselect' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const selectedOptions = (currentAnswer as string[]) || [];
                const isChecked = selectedOptions.includes(option);

                return (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleAnswer([...selectedOptions, option]);
                        } else {
                          handleAnswer(
                            selectedOptions.filter((o) => o !== option),
                          );
                        }
                      }}
                    />
                    <Label htmlFor={option} className="font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Scale (1-10) */}
          {currentQuestion.type === 'scale' && (
            <div className="space-y-4">
              <Input
                type="range"
                min="1"
                max="10"
                value={(currentAnswer as string) || '5'}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 (매우 낮음)</span>
                <span className="font-semibold text-foreground">
                  {currentAnswer || 5}
                </span>
                <span>10 (매우 높음)</span>
              </div>
            </div>
          )}
        </div>

        {/* Required Note */}
        {!currentQuestion.required && (
          <p className="text-xs text-muted-foreground">
            이 질문은 선택사항입니다
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {currentIndex === 0 ? '카테고리 선택으로' : '이전'}
        </Button>

        <div className="flex gap-2">
          {!currentQuestion.required && (
            <Button variant="ghost" onClick={handleSkip}>
              건너뛰기
            </Button>
          )}
          <Button onClick={handleNext} disabled={!canProceed()}>
            {currentIndex === sortedQuestions.length - 1 ? '완료' : '다음'}
            {currentIndex < sortedQuestions.length - 1 && (
              <ChevronRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
