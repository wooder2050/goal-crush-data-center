'use client';

import { Section } from '@/components/ui';
import { getTeamsPrisma } from '@/features/teams/api-prisma';
import TeamGrid from '@/features/teams/components/TeamGrid';
import TeamGridSkeleton from '@/features/teams/components/TeamGridSkeleton';
import { useGoalQuery } from '@/hooks/useGoalQuery';

export default function TeamsPageClient() {
  const {
    data: teams = [],
    isLoading,
    error,
  } = useGoalQuery(getTeamsPrisma, []);

  if (isLoading) {
    return (
      <Section padding="sm" className="pt-2 sm:pt-3">
        <div className="mb-2 flex items-center justify-between gap-4 px-3 pt-3 sm:mb-3 sm:px-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold sm:text-2xl">팀 목록</h1>
            <span className="inline-flex h-5 w-16 items-center rounded bg-gray-200 sm:h-6 sm:w-20 animate-pulse" />
          </div>
        </div>
        <TeamGridSkeleton items={10} />
      </Section>
    );
  }

  if (error) {
    return (
      <Section padding="sm" className="pt-2 sm:pt-3">
        <div className="text-red-500">팀 목록을 불러오지 못했습니다.</div>
      </Section>
    );
  }

  return (
    <Section padding="sm" className="pt-2 sm:pt-3">
      <div className="mb-2 flex items-center justify-between gap-4 px-3 pt-3 sm:mb-3 sm:px-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold sm:text-2xl">팀 목록</h1>
          <span className="inline-flex items-center rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
            총 {teams.length}팀
          </span>
        </div>
      </div>
      <div>
        <TeamGrid teams={teams} />
      </div>
    </Section>
  );
}
