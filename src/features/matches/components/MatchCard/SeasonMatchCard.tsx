'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getMatchByIdPrisma } from '../../api-prisma';
import GoalSection from './GoalSection';
import MatchFooter from './MatchFooter';
import MatchHeader from './MatchHeader';
import MatchMediaLinks from './MatchMediaLinks';
import MatchScoreHeader from './MatchScoreHeader';

interface SeasonMatchCardProps {
  matchId: number;
  className?: string;
}

const SeasonMatchCard: React.FC<SeasonMatchCardProps> = ({
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
        <div className="space-y-3 sm:space-y-4 lg:space-y-5">
          <MatchScoreHeader match={match} />
          <GoalSection match={match} />
          {/* 시즌 카드에서는 상세 섹션 숨김: 승부차기/라인업 제외 */}
          <MatchFooter match={match} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonMatchCard;
