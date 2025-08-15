import React from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import CoachesPage from '@/features/coaches/components/CoachesPage';
import CoachesPageSkeleton from '@/features/coaches/components/CoachesPageSkeleton';

export default function CoachesPageWrapper() {
  return (
    <GoalWrapper fallback={<CoachesPageSkeleton />}>
      <CoachesPage />
    </GoalWrapper>
  );
}
