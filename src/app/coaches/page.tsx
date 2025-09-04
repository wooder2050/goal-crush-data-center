import React from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Section } from '@/components/ui';
import CoachesPage from '@/features/coaches/components/CoachesPage';
import CoachesPageSkeleton from '@/features/coaches/components/CoachesPageSkeleton';

export const dynamic = 'force-dynamic';

export default function CoachesPageWrapper() {
  return (
    <Section padding="sm" className="pt-2 sm:pt-3">
      <GoalWrapper fallback={<CoachesPageSkeleton />}>
        <CoachesPage />
      </GoalWrapper>
    </Section>
  );
}
