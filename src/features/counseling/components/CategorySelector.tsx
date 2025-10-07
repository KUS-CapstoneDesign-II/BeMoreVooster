/**
 * Category Selector Component
 * Select counseling category and enter session title
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Heart, Briefcase, Users, Brain, MessageCircle, Target, BookOpen, HelpCircle } from 'lucide-react';
import type { CounselingCategory, CategoryListResponse } from '../lib/types';

interface CategorySelectorProps {
  categories: CategoryListResponse;
  onSelect: (category: CounselingCategory, title: string) => void;
}

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Heart,
  Briefcase,
  Users,
  Brain,
  MessageCircle,
  Target,
  BookOpen,
  HelpCircle,
};

export function CategorySelector({ categories, onSelect }: CategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<CounselingCategory | null>(null);
  const [title, setTitle] = useState('');

  const allCategories = [
    ...categories.defaultCategories,
    ...categories.customCategories,
  ];

  const handleContinue = () => {
    if (selectedCategory && title.trim()) {
      onSelect(selectedCategory, title.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">상담 주제 선택</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allCategories.map((category) => {
            const Icon = iconMap[category.icon] || MessageCircle;
            const isSelected = selectedCategory?.id === category.id;

            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-md'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{category.name}</h4>
                      {category.isCustom && (
                        <span className="text-xs text-muted-foreground">
                          커스텀
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {category.description && (
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs line-clamp-2">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Session Title Input */}
      {selectedCategory && (
        <div className="space-y-4 p-6 border rounded-lg bg-card">
          <div className="space-y-2">
            <Label htmlFor="session-title">상담 제목</Label>
            <Input
              id="session-title"
              placeholder="예: 이직 고민, 관계 문제 등"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              이 상담을 쉽게 찾을 수 있도록 제목을 입력해주세요
            </p>
          </div>

          {/* Selected Category Info */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            {(() => {
              const Icon = iconMap[selectedCategory.icon] || MessageCircle;
              return (
                <>
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${selectedCategory.color}20`,
                      color: selectedCategory.color,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {selectedCategory.name}
                    </p>
                    {selectedCategory.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedCategory.description}
                      </p>
                    )}
                    {selectedCategory.initialQuestions.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {selectedCategory.initialQuestions.length}개의 초기 질문이 있습니다
                      </p>
                    )}
                  </div>
                </>
              );
            })()}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                setTitle('');
              }}
            >
              취소
            </Button>
            <Button onClick={handleContinue} disabled={!title.trim()}>
              계속하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
