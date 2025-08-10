'use client';

import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import {
  MatchWithTeams,
  PenaltyShootoutDetailWithPlayers,
} from '@/lib/types/database';

import { getPenaltyShootoutDetailsPrisma } from '../../api-prisma';
import { hasPenaltyShootout } from '../../lib/matchUtils';

interface PenaltyShootoutSectionProps {
  match: MatchWithTeams;
  className?: string;
}

const PenaltyShootoutSection: React.FC<PenaltyShootoutSectionProps> = ({
  match,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch penalty shootout details via React Query
  const {
    data: penaltyRecords = [],
    isLoading,
    error,
  } = useGoalQuery(getPenaltyShootoutDetailsPrisma, [match.match_id], {
    enabled: hasPenaltyShootout(match),
  });

  // Do not render when the match has no penalty shootout
  if (!hasPenaltyShootout(match)) {
    return null;
  }

  const homeRecords = penaltyRecords.filter(
    (record: PenaltyShootoutDetailWithPlayers) =>
      record.team?.team_id === match.home_team_id
  );
  const awayRecords = penaltyRecords.filter(
    (record: PenaltyShootoutDetailWithPlayers) =>
      record.team?.team_id === match.away_team_id
  );

  // Explicitly locate each team's goalkeeper.
  // The home team's goalkeeper is found from the away team's shooting records.
  const homeTeamGoalkeeper = penaltyRecords.find(
    (r: PenaltyShootoutDetailWithPlayers) =>
      r.team?.team_id === match.away_team_id
  )?.goalkeeper;

  // The away team's goalkeeper is found from the home team's shooting records.
  const awayTeamGoalkeeper = penaltyRecords.find(
    (r: PenaltyShootoutDetailWithPlayers) =>
      r.team?.team_id === match.home_team_id
  )?.goalkeeper;

  // Compute success rate
  const getSuccessRate = (records: PenaltyShootoutDetailWithPlayers[]) => {
    const total = records.length;
    const success = records.filter(
      (r: PenaltyShootoutDetailWithPlayers) => r.is_successful
    ).length;
    return `${success}/${total}`;
  };

  // Determine winner
  const homeScore = match.penalty_home_score || 0;
  const awayScore = match.penalty_away_score || 0;
  const winner = homeScore > awayScore ? 'home' : 'away';

  return (
    <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-gray-700">
          🎯 승부차기 상세 기록
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? '숨기기' : '보기'}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="text-gray-500 text-sm">
                승부차기 기록을 불러오는 중...
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-4">
              <div className="text-gray-500 text-sm">
                승부차기 기록을 불러올 수 없습니다:{' '}
                {error instanceof Error ? error.message : 'Unknown error'}
              </div>
            </div>
          )}

          {/* When data is present */}
          {!isLoading && !error && penaltyRecords.length > 0 && (
            <>
              {/* Highlight final result */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800 mb-2">
                    🏆 승부차기 최종 결과
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div
                      className={`text-xl font-bold ${
                        winner === 'home' ? 'text-black' : 'text-gray-600'
                      }`}
                    >
                      {match.home_team?.team_name} {homeScore}
                    </div>
                    <div className="text-xl font-bold text-gray-400">:</div>
                    <div
                      className={`text-xl font-bold ${
                        winner === 'away' ? 'text-black' : 'text-gray-600'
                      }`}
                    >
                      {awayScore} {match.away_team?.team_name}
                    </div>
                  </div>
                  {winner && (
                    <div className="mt-2">
                      <Badge className="bg-black text-white border-black">
                        🏆{' '}
                        {winner === 'home'
                          ? match.home_team?.team_name
                          : match.away_team?.team_name}{' '}
                        승리
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed records */}
              <div className="grid grid-cols-2 gap-4">
                {/* Home Team Records */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-800 mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
                      {match.home_team?.team_name}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-800"
                    >
                      {getSuccessRate(homeRecords)} 성공
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {homeRecords
                      .sort(
                        (
                          a: PenaltyShootoutDetailWithPlayers,
                          b: PenaltyShootoutDetailWithPlayers
                        ) => a.kicker_order - b.kicker_order
                      )
                      .map(
                        (
                          record: PenaltyShootoutDetailWithPlayers,
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white rounded p-2 border border-gray-200"
                          >
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0 bg-black text-white border-black"
                              >
                                {record.kicker_order}
                              </Badge>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {record.kicker?.name}
                                </span>
                                <span
                                  className="text-xs text-gray-500 truncate cursor-help"
                                  title={`상대 골키퍼: ${awayTeamGoalkeeper?.name}`}
                                >
                                  vs {awayTeamGoalkeeper?.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {record.is_successful ? (
                                <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-300">
                                  ⚽ 성공
                                </Badge>
                              ) : (
                                <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-300">
                                  ❌ 실패
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>

                {/* Away Team Records */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-800 mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-600 rounded-full mr-2"></div>
                      {match.away_team?.team_name}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-800"
                    >
                      {getSuccessRate(awayRecords)} 성공
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {awayRecords
                      .sort(
                        (
                          a: PenaltyShootoutDetailWithPlayers,
                          b: PenaltyShootoutDetailWithPlayers
                        ) => a.kicker_order - b.kicker_order
                      )
                      .map(
                        (
                          record: PenaltyShootoutDetailWithPlayers,
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white rounded p-2 border border-gray-200"
                          >
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0 bg-gray-600 text-white border-gray-600"
                              >
                                {record.kicker_order}
                              </Badge>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {record.kicker?.name}
                                </span>
                                <span
                                  className="text-xs text-gray-500 truncate cursor-help"
                                  title={`상대 골키퍼: ${homeTeamGoalkeeper?.name}`}
                                >
                                  vs {homeTeamGoalkeeper?.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {record.is_successful ? (
                                <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-300">
                                  ⚽ 성공
                                </Badge>
                              ) : (
                                <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-300">
                                  ❌ 실패
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* When no data */}
          {!isLoading && !error && penaltyRecords.length === 0 && (
            <div className="text-center py-4">
              <div className="text-gray-500 text-sm">
                승부차기 상세 기록이 없습니다.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PenaltyShootoutSection;
