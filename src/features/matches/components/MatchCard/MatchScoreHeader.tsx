'use client';

import React from 'react';

import { MatchWithTeams } from '@/lib/types/database';

import {
  getMatchResult,
  getWinnerTeam,
  hasPenaltyShootout,
} from '../../lib/matchUtils';

interface MatchScoreHeaderProps {
  match: MatchWithTeams;
  className?: string;
}

const MatchScoreHeader: React.FC<MatchScoreHeaderProps> = ({
  match,
  className = '',
}) => {
  const winner = getWinnerTeam(match);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Home Team */}
      <div
        className={`flex-1 text-center ${
          winner === 'home' ? 'text-black font-bold' : 'text-gray-700'
        }`}
      >
        <div className="text-lg font-medium">
          {match.home_team?.team_name || '알 수 없음'}
        </div>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 px-4">
        <div className="text-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold">{getMatchResult(match)}</div>
          {/* 승부차기 점수만 스코어 박스 안에 표시 */}
          {hasPenaltyShootout(match) && (
            <div className="text-xs text-gray-600 mt-1">
              승부차기 {match.penalty_home_score}:{match.penalty_away_score}
            </div>
          )}
        </div>
      </div>

      {/* Away Team */}
      <div
        className={`flex-1 text-center ${
          winner === 'away' ? 'text-black font-bold' : 'text-gray-700'
        }`}
      >
        <div className="text-lg font-medium">
          {match.away_team?.team_name || '알 수 없음'}
        </div>
      </div>
    </div>
  );
};

export default MatchScoreHeader;
