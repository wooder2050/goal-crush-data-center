'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { getSeasonByIdPrisma } from '@/features/seasons/api-prisma';
import StandingsTable from '@/features/stats/components/StandingsTable';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getMatchesBySeasonIdPrisma } from '../api-prisma';
import SeasonMatchCard from './MatchCard/SeasonMatchCard';
import SeasonSummary from './SeasonSummary';

interface Props {
  seasonId: number;
  title?: string;
}

export default function SuperResults({ seasonId, title }: Props) {
  const {
    data: matches = [],
    isLoading,
    error,
  } = useGoalQuery(getMatchesBySeasonIdPrisma, [seasonId]);
  const { data: season } = useGoalQuery(getSeasonByIdPrisma, [seasonId]);

  if (isLoading) {
    return (
      <div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert>
          <AlertDescription>
            데이터를 불러올 수 없습니다:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex items-baseline gap-2 mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
          {season?.year != null && (
            <p className="text-gray-600">{season.year}년</p>
          )}
        </div>
      )}
      <div className="space-y-8">
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
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
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
        className="mt-8"
      />
      <div className="mt-8">
        <StandingsTable seasonId={seasonId} />
      </div>
    </div>
  );
}
