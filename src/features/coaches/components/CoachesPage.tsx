'use client';

import React from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import type { CoachWithHistory } from '@/lib/types/database';

import { fetchCoaches } from '../api-prisma';
import CoachCard from './CoachCard';
import CoachCardSkeleton from './CoachCardSkeleton';

function CoachesPageInner() {
  const { data } = useGoalSuspenseQuery(fetchCoaches, []);

  const { coaches } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">감독 목록</h1>
        <p className="text-gray-600">
          모든 감독의 정보와 팀 이력을 확인할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {coaches.map((coach: CoachWithHistory) => (
          <GoalWrapper key={coach.coach_id} fallback={<CoachCardSkeleton />}>
            <CoachCard coach={coach} />
          </GoalWrapper>
        ))}
      </div>

      {coaches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

const CoachesPage: React.FC = () => {
  return <CoachesPageInner />;
};

export default CoachesPage;
