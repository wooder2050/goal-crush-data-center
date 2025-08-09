'use client';

import { useMemo } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { useResolvedPathParams } from '@/common/path-params/client';
import BackLink from '@/components/ui/back-link';
import {
  getTeamByIdPrisma,
  getTeamPlayersPrisma,
  getTeamStatsPrisma,
} from '@/features/teams/api-prisma';
import TeamDetailSkeleton from '@/features/teams/components/TeamDetailSkeleton';
import TeamHeader from '@/features/teams/components/TeamHeader';
import TeamMatchesShortcut from '@/features/teams/components/TeamMatchesShortcut';
import TeamSeasonStandings from '@/features/teams/components/TeamSeasonStandings';
import TeamSquadTable from '@/features/teams/components/TeamSquadTable';
import TeamStatsCard from '@/features/teams/components/TeamStatsCard';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

function TeamDetailSuspenseBody({ teamId }: { teamId: number }) {
  const { data: team } = useGoalSuspenseQuery(getTeamByIdPrisma, [teamId]);
  const { data: players = [] } = useGoalSuspenseQuery(getTeamPlayersPrisma, [
    teamId,
    'all',
  ]);
  const { data: stats } = useGoalSuspenseQuery(getTeamStatsPrisma, [teamId]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackLink href="/teams" label="팀 목록으로 돌아가기" />
      </div>

      <TeamHeader team={team} />

      {stats && <TeamStatsCard stats={stats} />}

      <TeamSquadTable players={players} />

      <TeamSeasonStandings teamId={teamId} />

      <TeamMatchesShortcut
        href="/seasons/season-7-gleague"
        label="시즌 7 G리그 경기 보기"
      />
    </div>
  );
}

export default function TeamDetailPageContent() {
  const [teamIdParam] = useResolvedPathParams('teamId');
  const teamIdNumber = useMemo(() => {
    const n = Number(teamIdParam);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [teamIdParam]);

  if (teamIdNumber === null) {
    return <TeamDetailSkeleton />;
  }

  return (
    <GoalWrapper fallback={<TeamDetailSkeleton />}>
      <TeamDetailSuspenseBody teamId={teamIdNumber} />
    </GoalWrapper>
  );
}
