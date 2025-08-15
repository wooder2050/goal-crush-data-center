import React from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import CoachDetailPage from '@/features/coaches/components/CoachDetailPage';
import CoachDetailSkeleton from '@/features/coaches/components/CoachDetailSkeleton';

interface CoachDetailPageWrapperProps {
  params: Promise<{ coachId: string }>;
}

export default async function CoachDetailPageWrapper({
  params,
}: CoachDetailPageWrapperProps) {
  const { coachId } = await params;

  return (
    <GoalWrapper fallback={<CoachDetailSkeleton />}>
      <CoachDetailPage coachId={parseInt(coachId)} />
    </GoalWrapper>
  );
}
