'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import type { CoachSeasonStats, CoachWithHistory } from '@/lib/types/database';

import { fetchCoachOverview } from '../api-prisma';
import CoachCardSkeleton from './CoachCardSkeleton';

type VerifiedCurrentTeam = {
  team_id: number;
  team_name: string;
  logo: string | null;
  last_match_date: string;
} | null;

type CoachWithVerified = CoachWithHistory & {
  has_current_team?: boolean;
  current_team_verified?: VerifiedCurrentTeam;
};

interface CoachCardProps {
  coach: CoachWithVerified;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach }) => {
  return (
    <GoalWrapper fallback={<CoachCardSkeleton />}>
      <CoachCardInner coach={coach} />
    </GoalWrapper>
  );
};

function CoachCardInner({ coach }: CoachCardProps) {
  const verifiedCurrentTeam = coach.current_team_verified ?? null;
  const totalTeams = new Set(coach.team_coach_history.map((h) => h.team_id))
    .size;

  const { data: overview } = useGoalSuspenseQuery(fetchCoachOverview, [
    coach.coach_id,
  ]);
  const trophies = overview?.trophies;
  const totals = (overview?.season_stats ?? []).reduce(
    (
      acc: { wins: number; losses: number; matches: number },
      s: CoachSeasonStats
    ) => {
      return {
        wins: acc.wins + (s.wins ?? 0),
        losses: acc.losses + (s.losses ?? 0),
        matches: acc.matches + (s.matches_played ?? 0),
      };
    },
    { wins: 0, losses: 0, matches: 0 }
  );
  const winRate =
    totals.matches > 0 ? Math.round((totals.wins / totals.matches) * 100) : 0;

  return (
    <Link href={`/coaches/${coach.coach_id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* 프로필 이미지 */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200">
                {coach.profile_image_url ? (
                  <Image
                    src={coach.profile_image_url}
                    alt={`${coach.name} 프로필`}
                    fill
                    className="object-cover object-top"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl text-gray-500">
                      {coach.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {coach.name}
              </h3>

              {coach.nationality && (
                <p className="text-sm text-gray-600 mb-2">
                  {coach.nationality}
                </p>
              )}

              {trophies && trophies.total > 0 && (
                <div className="mb-2">
                  <div className="mt-1 flex flex-wrap gap-1">
                    {trophies.items.map((it) => (
                      <span
                        key={it.season_id}
                        className="text-[11px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-sm leading-none"
                        title={it.season_name}
                      >
                        🏆{' '}
                        {it.season_name.replace(/골때리는 그녀들/g, '').trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {coach.has_current_team && verifiedCurrentTeam ? (
                <div className="mb-2">
                  <div className="flex items-center space-x-2">
                    {verifiedCurrentTeam.logo && (
                      <div className="w-4 h-4 relative rounded-full overflow-hidden">
                        <Image
                          src={verifiedCurrentTeam.logo}
                          alt={`${verifiedCurrentTeam.team_name} 로고`}
                          fill
                          className="object-cover"
                          sizes="16px"
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {verifiedCurrentTeam.team_name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-2 text-sm text-gray-500">
                  현재 맡은 팀 없음
                </div>
              )}

              {/* 요약: 1) 경기/승률  2) 승/패 */}
              <div className="text-sm text-gray-700 mb-1">
                경기 {totals.matches} · 승률 {winRate}%
              </div>
              <div className="text-sm text-gray-700 mb-1">
                승리 {totals.wins} · 패배 {totals.losses}
              </div>

              <div className="text-sm text-gray-500">
                총 {totalTeams}개 팀 지휘
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CoachCard;
