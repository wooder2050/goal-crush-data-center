'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getMatchByIdPrisma } from '../../api-prisma';
import MatchFooter from './MatchFooter';
import MatchHeader from './MatchHeader';
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
  const router = useRouter();

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
    <Card
      className={`transition-shadow hover:shadow-md cursor-pointer ${className}`}
      onClick={() => router.push(`/matches/${match.match_id}`)}
      role="link"
      aria-label={`경기 상세 보기 ${match.match_id}`}
    >
      <MatchHeader match={match} compact />
      <CardContent className="px-0 py-1.5 sm:p-3">
        {/* <MatchMediaLinks match={match} /> */}
        <div className="space-y-2">
          <MatchScoreHeader match={match} />
          <MatchFooter
            match={match}
            showDividerTop={false}
            hideDetailButton
            allRight
          />
          {/* 카드 전체 클릭으로 이동. 별도 상세보기 링크는 제거 */}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonMatchCard;
