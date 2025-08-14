'use client';

import { Section } from '@/components/ui';
import TeamGridSkeleton from '@/features/teams/components/TeamGridSkeleton';

type TeamsPageSkeletonProps = {
  items?: number;
};

export default function TeamsPageSkeleton({
  items = 10,
}: TeamsPageSkeletonProps) {
  return (
    <Section padding="sm" className="pt-2 sm:pt-3">
      <div className="mb-2 flex items-center justify-between gap-4 px-3 pt-3 sm:mb-3 sm:px-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold sm:text-2xl">팀 목록</h1>
          <span className="inline-flex h-5 w-16 items-center rounded bg-gray-200 sm:h-6 sm:w-20 animate-pulse" />
        </div>
      </div>
      <TeamGridSkeleton items={items} />
    </Section>
  );
}
