import React from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import CoachesPage from '@/features/coaches/components/CoachesPage';
import CoachesPageSkeleton from '@/features/coaches/components/CoachesPageSkeleton';

export const dynamic = 'force-dynamic';

export default function CoachesPageWrapper() {
  return (
    <GoalWrapper fallback={<CoachesPageSkeleton />}>
      <CoachesPage />
    </GoalWrapper>
  );
}
