'use client';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Section } from '@/components/ui';
import { getTeamsPrisma } from '@/features/teams/api-prisma';
import TeamGrid from '@/features/teams/components/TeamGrid';
import TeamsPageSkeleton from '@/features/teams/components/TeamsPageSkeleton';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

function TeamsPageClientInner() {
  const { data: teams = [] } = useGoalSuspenseQuery(getTeamsPrisma, []);

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

export default function TeamsPageClient() {
  return (
    <GoalWrapper fallback={<TeamsPageSkeleton items={10} />}>
      <TeamsPageClientInner />
    </GoalWrapper>
  );
}
