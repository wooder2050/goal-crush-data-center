'use client';

import Image from 'next/image';
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
}

const MatchScoreHeader: React.FC<MatchScoreHeaderProps> = ({
  match,
  className = '',
}) => {
  const winner = getWinnerTeam(match);

  const TeamWithLogo: React.FC<TeamWithLogoProps> = ({ team, isWinner }) => (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      <div className="w-6 h-6 sm:w-8 sm:h-8 relative flex-shrink-0 rounded-full overflow-hidden">
        {team?.logo ? (
          <Image
            src={team.logo}
            alt={`${team.team_name} 로고`}
            fill
            className="object-cover"
            sizes="24px"
          />
        ) : (
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
              {team?.team_name?.charAt(0) || '?'}
            </span>
          </div>
        )}
      </div>
      <div
        className={`text-xs sm:text-sm font-medium ${
          isWinner ? 'text-black font-bold' : 'text-gray-700'
        }`}
      >
        {team?.team_name || '알 수 없음'}
      </div>
    </div>
  );

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Home Team */}
      <div className="flex-1 text-center">
        <TeamWithLogo team={match.home_team} isWinner={winner === 'home'} />
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
        <TeamWithLogo team={match.away_team} isWinner={winner === 'away'} />
      </div>
    </div>
  );
};

export default MatchScoreHeader;
