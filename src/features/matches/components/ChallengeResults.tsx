'use client';

import { GoalWrapper } from '@/common/GoalWrapper';
import { getSeasonByIdPrisma } from '@/features/seasons/api-prisma';
import StandingsTable from '@/features/stats/components/StandingsTable';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

import { getMatchesBySeasonIdPrisma } from '../api-prisma';
import ChallengeResultsSkeleton from './ChallengeResultsSkeleton';
import SeasonMatchCard from './MatchCard/SeasonMatchCard';
import SeasonSummary from './SeasonSummary';

interface Props {
  seasonId: number;
  title?: string;
}

function ChallengeResultsInner({ seasonId, title }: Props) {
  const { data: matches = [] } = useGoalSuspenseQuery(
    getMatchesBySeasonIdPrisma,
    [seasonId]
  );
  const { data: season } = useGoalSuspenseQuery(getSeasonByIdPrisma, [
    seasonId,
  ]);

  return (
    <div>
      {title && (
        <div className="flex items-baseline gap-2 mb-4 sm:mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
          {season?.year != null && (
            <p className="text-gray-600">{season.year}년</p>
          )}
        </div>
      )}
      <div className="space-y-6 sm:space-y-8">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              경기 데이터가 아직 없습니다
            </h3>
            <p className="text-gray-500">
              경기 데이터가 입력되면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                경기 결과
              </h2>
              <div className="h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
              {matches
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.match_date).getTime() -
                    new Date(b.match_date).getTime()
                )
                .map((m) => (
                  <SeasonMatchCard key={m.match_id} matchId={m.match_id} />
                ))}
            </div>
          </div>
        )}
      </div>
      <SeasonSummary
        seasonId={seasonId}
        seasonName={title ?? '시즌'}
        className="mt-6 sm:mt-8"
      />
      <div className="mt-6 sm:mt-8">
        <StandingsTable seasonId={seasonId} />
      </div>
    </div>
  );
}

export default function ChallengeResults({ seasonId, title }: Props) {
  return (
    <GoalWrapper fallback={<ChallengeResultsSkeleton />}>
      <ChallengeResultsInner seasonId={seasonId} title={title} />
    </GoalWrapper>
  );
}
