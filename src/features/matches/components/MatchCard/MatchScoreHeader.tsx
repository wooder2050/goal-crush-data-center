'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { MatchWithTeams, Team } from '@/lib/types/database';

import {
  getMatchResult,
  getWinnerTeam,
  hasPenaltyShootout,
} from '../../lib/matchUtils';

interface MatchScoreHeaderProps {
  match: MatchWithTeams;
  className?: string;
}

interface TeamWithLogoProps {
  team: Pick<Team, 'team_name' | 'logo'> | null;
  isWinner: boolean;
  teamId: number | null;
}

const MatchScoreHeader: React.FC<MatchScoreHeaderProps> = ({
  match,
  className = '',
}) => {
  const winner = getWinnerTeam(match);

  const TeamWithLogo: React.FC<TeamWithLogoProps> = ({
    team,
    isWinner,
    teamId,
  }) => {
    const headCoachName =
      (teamId === match.home_team_id
        ? match.home_coach?.name
        : teamId === match.away_team_id
          ? match.away_coach?.name
          : undefined) || undefined;
    const headCoachId =
      teamId === match.home_team_id
        ? match.home_coach?.coach_id
        : teamId === match.away_team_id
          ? match.away_coach?.coach_id
          : undefined;

    return (
      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        <div className="w-5 h-5 relative flex-shrink-0 rounded-full overflow-hidden">
          {team?.logo ? (
            <Image
              src={team.logo}
              alt={`${team.team_name} 로고`}
              fill
              className="object-cover"
              sizes="20px"
            />
          ) : (
            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-gray-500 font-medium">
                {team?.team_name?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`text-xs sm:text-sm font-medium ${
              isWinner ? 'text-black font-bold' : 'text-gray-700'
            }`}
          >
            {teamId ? (
              <Link
                href={`/teams/${teamId}`}
                className="text-inherit no-underline"
              >
                {team?.team_name || '알 수 없음'}
              </Link>
            ) : (
              team?.team_name || '알 수 없음'
            )}
          </div>
          {headCoachName && (
            <div className="text-[10px] text-gray-500 mt-0.5">
              {headCoachId ? (
                <Link
                  href={`/coaches/${headCoachId}`}
                  className="text-inherit no-underline"
                >
                  {headCoachName}
                </Link>
              ) : (
                headCoachName
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Home Team */}
      <div className="flex-1 text-center">
        <TeamWithLogo
          team={match.home_team}
          isWinner={winner === 'home'}
          teamId={match.home_team_id}
        />
      </div>

      {/* Score */}
      <div className="flex-shrink-0 px-2 sm:px-4">
        <div className="text-center bg-gray-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-200">
          <div className="text-xl font-bold sm:text-2xl">
            {getMatchResult(match)}
          </div>
          {/* 승부차기 점수만 스코어 박스 안에 표시 */}
          {hasPenaltyShootout(match) && (
            <div className="text-[10px] sm:text-xs text-gray-600 mt-1">
              PK {match.penalty_home_score}:{match.penalty_away_score}
            </div>
          )}
        </div>
      </div>

      {/* Away Team */}
      <div className="flex-1 text-center">
        <TeamWithLogo
          team={match.away_team}
          isWinner={winner === 'away'}
          teamId={match.away_team_id}
        />
      </div>
    </div>
  );
};

export default MatchScoreHeader;
