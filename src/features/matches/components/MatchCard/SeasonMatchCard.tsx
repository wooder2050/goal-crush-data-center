'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

import { getMatchByIdPrisma } from '../../api-prisma';
import MatchFooter from './MatchFooter';
import MatchHeader from './MatchHeader';
import MatchScoreHeader from './MatchScoreHeader';
import SeasonMatchCardSkeleton from './SeasonMatchCardSkeleton';

interface SeasonMatchCardProps {
  matchId: number;
  className?: string;
}

function SeasonMatchCardInner({
  matchId,
  className = '',
}: SeasonMatchCardProps) {
  const { data: match } = useGoalSuspenseQuery(getMatchByIdPrisma, [matchId]);
  const router = useRouter();

  if (!match) {
    return (
      <Card className={className}>
        <CardContent className="px-0 py-3 sm:p-6">
          <div className="text-[#ff4800]">매치 정보를 불러올 수 없습니다.</div>
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
        <div className="space-y-2">
          <MatchScoreHeader match={match} />
          <MatchFooter
            match={match}
            showDividerTop={false}
            hideDetailButton
            allRight
          />
        </div>
      </CardContent>
    </Card>
  );
}

const SeasonMatchCard: React.FC<SeasonMatchCardProps> = ({
  matchId,
  className = '',
}) => {
  return (
    <GoalWrapper fallback={<SeasonMatchCardSkeleton className={className} />}>
      <SeasonMatchCardInner matchId={matchId} className={className} />
    </GoalWrapper>
  );
};

export default SeasonMatchCard;
