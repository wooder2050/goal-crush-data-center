'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getMatchByIdPrisma } from '../../api-prisma';
import { hasPenaltyShootout } from '../../lib/matchUtils';
import GoalSection from './GoalSection';
import MatchFooter from './MatchFooter';
import MatchHeader from './MatchHeader';
import MatchMediaLinks from './MatchMediaLinks';
import MatchScoreHeader from './MatchScoreHeader';
import PenaltyShootoutSection from './PenaltyShootoutSection';
import TeamLineupsSection from './TeamLineupsSection';

interface DetailMatchCardProps {
  matchId: number;
  className?: string;
}

const DetailMatchCard: React.FC<DetailMatchCardProps> = ({
  matchId,
  className = '',
}) => {
  const {
    data: match,
    isLoading: matchLoading,
    error: matchError,
  } = useGoalQuery(getMatchByIdPrisma, [matchId]);

  const isLoading = matchLoading;
  const error = matchError;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="px-0 py-3 sm:p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !match) {
    return (
      <Card className={className}>
        <CardContent className="px-0 py-3 sm:p-6">
          <div className="text-[#ff4800]">
            {error instanceof Error
              ? error.message
              : '매치 정보를 불러올 수 없습니다.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <MatchHeader match={match} />
      <CardContent className="px-0 py-3 sm:p-6">
        <MatchMediaLinks match={match} />
        <div
          className={`grid grid-cols-1 ${hasPenaltyShootout(match) ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4 lg:gap-6`}
        >
          <div
            className={`${hasPenaltyShootout(match) ? 'lg:col-span-2' : ''} space-y-3 sm:space-y-4`}
          >
            <MatchScoreHeader match={match} />
            <GoalSection match={match} />
            {hasPenaltyShootout(match) && <TeamLineupsSection match={match} />}
          </div>
          <div className="lg:col-span-1">
            {hasPenaltyShootout(match) ? (
              <PenaltyShootoutSection match={match} />
            ) : (
              <TeamLineupsSection match={match} />
            )}
          </div>
        </div>
        {/* 디테일 카드에서는 상세 보기 버튼 숨김 */}
        <div className="mt-4">
          <MatchFooter match={match} hideDetailButton />
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailMatchCard;
