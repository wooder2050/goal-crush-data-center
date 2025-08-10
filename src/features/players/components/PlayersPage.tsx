'use client';

import { useState } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Grid, Section } from '@/components/ui';
import BackLink from '@/components/ui/back-link';
import PlayersContent from '@/features/players/components/PlayersContent';
import SkeletonCard from '@/features/players/components/SkeletonCard';

export default function PlayersPage() {
  const [total, setTotal] = useState<number | null>(null);
  return (
    <Section padding="sm">
      <div className="mb-6">
        <BackLink href="/" label="메인 페이지로 돌아가기" />
      </div>
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-2xl font-bold">선수 정보 보기</h1>
        {typeof total === 'number' && (
          <span className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
            총 {total}명
          </span>
        )}
      </div>
      <GoalWrapper
        fallback={
          <div className="space-y-4">
            <Grid cols={4} gap="lg">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </Grid>
          </div>
        }
      >
        <PlayersContent onTotalChange={setTotal} />
      </GoalWrapper>
    </Section>
  );
}
