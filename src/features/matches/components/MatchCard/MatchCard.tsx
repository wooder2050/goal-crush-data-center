'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getMatchByIdPrisma } from '../../api-prisma';
import GoalSection from './GoalSection';
import MatchFooter from './MatchFooter';
import MatchHeader from './MatchHeader';
import MatchScoreHeader from './MatchScoreHeader';
import PenaltyShootoutSection from './PenaltyShootoutSection';
import TeamLineupsSection from './TeamLineupsSection';

interface MatchCardProps {
  matchId: number;
  className?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ matchId, className = '' }) => {
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
        <CardContent className="p-6">
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
        <CardContent className="p-6">
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
      <CardContent>
        <MatchScoreHeader match={match} />
        <GoalSection match={match} />
        <PenaltyShootoutSection match={match} />
        <TeamLineupsSection match={match} />
        <MatchFooter match={match} />
      </CardContent>
    </Card>
  );
};

export default MatchCard;
