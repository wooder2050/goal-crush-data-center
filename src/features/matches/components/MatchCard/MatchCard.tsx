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
  // React Query로 매치 상세 정보 fetching
  const {
    data: match,
    isLoading: matchLoading,
    error: matchError,
  } = useGoalQuery(getMatchByIdPrisma, [matchId]);

  // 로딩 상태 체크
  const isLoading = matchLoading;

  // 에러 상태 체크
  const error = matchError;

  if (isLoading) {
    return (
      <Card className={`hover:shadow-lg transition-shadow ${className}`}>
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
      <Card className={`hover:shadow-lg transition-shadow ${className}`}>
        <CardContent className="p-6">
          <div className="text-red-600">
            {error instanceof Error
              ? error.message
              : '매치 정보를 불러올 수 없습니다.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      {/* 상단 헤더 - 별도 컴포넌트로 분리 */}
      <MatchHeader match={match} />

      <CardContent>
        {/* 매치 스코어 헤더 - 별도 컴포넌트로 분리 */}
        <MatchScoreHeader match={match} />

        {/* 득점 기록 섹션 - 별도 컴포넌트로 분리 */}
        <GoalSection match={match} />

        {/* 승부차기 세부 기록 섹션 - 별도 섹션으로 분리 */}
        <PenaltyShootoutSection match={match} />

        {/* 팀 라인업 섹션 - 별도 컴포넌트로 분리 */}
        <TeamLineupsSection match={match} />

        {/* 경기 정보 푸터 - 별도 컴포넌트로 분리 */}
        <MatchFooter match={match} />
      </CardContent>
    </Card>
  );
};

export default MatchCard;
