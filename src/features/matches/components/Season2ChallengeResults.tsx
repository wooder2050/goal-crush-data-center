'use client';

import React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import StandingsTable from '@/features/stats/components/StandingsTable';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getMatchesBySeasonIdPrisma } from '../api-prisma';
import MatchCard from './MatchCard/MatchCard';
import SeasonSummary from './SeasonSummary';

interface Season2ChallengeResultsProps {
  className?: string;
}

const Season2ChallengeResults: React.FC<Season2ChallengeResultsProps> = ({
  className = '',
}) => {
  const {
    data: matches = [],
    isLoading,
    error,
  } = useGoalQuery(getMatchesBySeasonIdPrisma, [5]);

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <Alert>
          <AlertDescription>
            시즌 2 챌린지리그 데이터를 불러올 수 없습니다:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          골때리는 그녀들 시즌 2 챌린지리그
        </h1>
        <p className="text-gray-600">2022년</p>
      </div>

      <div className="space-y-8">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              시즌 2 챌린지리그 경기 데이터가 아직 없습니다
            </h3>
            <p className="text-gray-500">
              시즌 2 챌린지리그 경기 데이터가 입력되면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                경기 결과
              </h2>
              <div className="h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {matches
                .sort(
                  (a, b) =>
                    new Date(a.match_date).getTime() -
                    new Date(b.match_date).getTime()
                )
                .map((match) => (
                  <MatchCard key={match.match_id} matchId={match.match_id} />
                ))}
            </div>
          </div>
        )}
      </div>

      <SeasonSummary
        seasonId={5}
        seasonName="시즌 2 챌린지리그"
        className="mt-8"
      />
      {/* standings 테이블 노출 */}
      <div className="mt-8">
        <StandingsTable seasonId={5} />
      </div>
    </div>
  );
};

export default Season2ChallengeResults;
