'use client';

import React from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

import { getMatchByIdPrisma } from '../../api-prisma';
import { hasPenaltyShootout } from '../../lib/matchUtils';
import CoachHeadToHeadList from './CoachHeadToHeadList';
import CoachHeadToHeadSection from './CoachHeadToHeadSection';
import DetailMatchCardSkeleton from './DetailMatchCardSkeleton';
import FeaturedPlayersSection from './FeaturedPlayersSection';
import GoalSection from './GoalSection';
import HeadToHeadList from './HeadToHeadList';
import HeadToHeadSection from './HeadToHeadSection';
import KeyPlayersSection from './KeyPlayersSection';
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

function DetailMatchCardInner({
  matchId,
  className = '',
}: DetailMatchCardProps) {
  const { data: match } = useGoalSuspenseQuery(getMatchByIdPrisma, [matchId]);

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
    <Card className={className}>
      <MatchHeader match={match} />
      <CardContent className="px-0 py-2 sm:p-4">
        <MatchMediaLinks match={match} />
        <div
          className={`grid grid-cols-1 ${hasPenaltyShootout(match) ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4 lg:gap-6`}
        >
          <div
            className={`${hasPenaltyShootout(match) ? 'lg:col-span-2' : ''} space-y-3 sm:space-y-4`}
          >
            <MatchScoreHeader match={match} />
            {match.home_score == null && match.away_score == null ? (
              <KeyPlayersSection matchId={match.match_id} />
            ) : (
              <GoalSection match={match} />
            )}
            {hasPenaltyShootout(match) ? (
              <>
                <TeamLineupsSection match={match} />
                <div className="mt-2 sm:mt-3">
                  <FeaturedPlayersSection match={match} />
                </div>
              </>
            ) : null}
            <HeadToHeadSection matchId={match.match_id} />
            <HeadToHeadList matchId={match.match_id} />
            <CoachHeadToHeadSection matchId={match.match_id} />
            <CoachHeadToHeadList matchId={match.match_id} />
          </div>
          <div className="lg:col-span-1">
            {hasPenaltyShootout(match) ? (
              <PenaltyShootoutSection match={match} />
            ) : (
              <>
                <TeamLineupsSection match={match} />
                <div className="mt-2 sm:mt-3">
                  <FeaturedPlayersSection match={match} />
                </div>
              </>
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
}

const DetailMatchCard: React.FC<DetailMatchCardProps> = ({
  matchId,
  className = '',
}) => {
  return (
    <GoalWrapper fallback={<DetailMatchCardSkeleton className={className} />}>
      <DetailMatchCardInner matchId={matchId} className={className} />
    </GoalWrapper>
  );
};

export default DetailMatchCard;
