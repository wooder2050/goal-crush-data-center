'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import { MatchWithTeams } from '@/lib/types/database';

import { getMatchLineups } from '../../api';
import {
  getPositionColor,
  getPositionOrder,
  getPositionText,
} from '../../lib/matchUtils';

interface TeamLineupsSectionProps {
  match: MatchWithTeams;
  className?: string;
}

const TeamLineupsSection: React.FC<TeamLineupsSectionProps> = ({
  match,
  className = '',
}) => {
  // 라인업 데이터를 React Query로 호출
  const {
    data: lineups = {},
    isLoading,
    error,
  } = useGoalQuery(getMatchLineups, [match.match_id]);

  const homeTeamKey = `${match.match_id}_${match.home_team_id}`;
  const awayTeamKey = `${match.match_id}_${match.away_team_id}`;
  const homeLineups = lineups[homeTeamKey] || [];
  const awayLineups = lineups[awayTeamKey] || [];

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
        <div className="text-sm font-medium text-gray-700 mb-3">
          👥 출전 선수
        </div>
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">라인업을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
        <div className="text-sm font-medium text-gray-700 mb-3">
          👥 출전 선수
        </div>
        <div className="text-center py-4">
          <div className="text-red-500 text-sm">
            라인업을 불러올 수 없습니다:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  // 라인업이 없으면 렌더링하지 않음
  if (homeLineups.length === 0 && awayLineups.length === 0) {
    return null;
  }

  return (
    <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
      <div className="text-sm font-medium text-gray-700 mb-3">👥 출전 선수</div>
      <div className="grid grid-cols-1 gap-4">
        {/* Home Team Players */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            {match.home_team?.team_name}
          </div>

          {/* 선발 출전 */}
          <div className="mb-3">
            <div className="text-xs text-blue-700 mb-2 font-medium">
              ⭐ 선발
            </div>
            <div className="space-y-1">
              {homeLineups
                .filter((player) => player.participation_status === 'starting')
                .sort(
                  (a, b) =>
                    getPositionOrder(a.position) - getPositionOrder(b.position)
                )
                .map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Badge
                        variant="outline"
                        className={`${getPositionColor(
                          player.position
                        )} text-xs px-1 py-0 flex-shrink-0`}
                      >
                        {getPositionText(player.position)}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        {typeof player.jersey_number === 'number' && (
                          <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-white bg-blue-600 rounded mr-1 flex-shrink-0">
                            {player.jersey_number}
                          </span>
                        )}
                        <span className="font-medium text-gray-900 break-words">
                          {player.player_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {player.goals > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
                        >
                          ⚽ {player.goals}
                        </Badge>
                      )}
                      {player.assists > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800"
                        >
                          🅰️ {player.assists}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 교체 선수 */}
          {homeLineups.filter(
            (player) => player.participation_status === 'substitute'
          ).length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-blue-700 mb-2 font-medium">
                🔄 교체 출전
              </div>
              <div className="space-y-1">
                {homeLineups
                  .filter(
                    (player) => player.participation_status === 'substitute'
                  )
                  .map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className={`${getPositionColor(
                            player.position
                          )} text-xs px-1 py-0 opacity-80 flex-shrink-0`}
                        >
                          {getPositionText(player.position)}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          {typeof player.jersey_number === 'number' && (
                            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-white bg-blue-400 rounded mr-1 flex-shrink-0">
                              {player.jersey_number}
                            </span>
                          )}
                          <span className="font-medium text-gray-800 break-words">
                            {player.player_name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {player.goals > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
                          >
                            ⚽ {player.goals}
                          </Badge>
                        )}
                        {player.assists > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800"
                          >
                            🅰️ {player.assists}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 벤치 선수 */}
          {homeLineups.filter(
            (player) => player.participation_status === 'bench'
          ).length > 0 && (
            <div>
              <div className="text-xs text-blue-700 mb-2 font-medium">
                🪑 벤치
              </div>
              <div className="space-y-1">
                {homeLineups
                  .filter((player) => player.participation_status === 'bench')
                  .map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className={`${getPositionColor(
                            player.position
                          )} text-xs px-1 py-0 opacity-60 flex-shrink-0`}
                        >
                          {getPositionText(player.position)}
                        </Badge>
                        <span className="text-gray-600 text-xs break-words">
                          {typeof player.jersey_number === 'number' && (
                            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-gray-600 bg-gray-300 rounded mr-1 flex-shrink-0">
                              {player.jersey_number}
                            </span>
                          )}
                          {player.player_name}
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Away Team Players */}
        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-sm font-semibold text-red-800 mb-2 flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
            {match.away_team?.team_name}
          </div>

          {/* 선발 출전 */}
          <div className="mb-3">
            <div className="text-xs text-red-700 mb-2 font-medium">⭐ 선발</div>
            <div className="space-y-1">
              {awayLineups
                .filter((player) => player.participation_status === 'starting')
                .sort(
                  (a, b) =>
                    getPositionOrder(a.position) - getPositionOrder(b.position)
                )
                .map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Badge
                        variant="outline"
                        className={`${getPositionColor(
                          player.position
                        )} text-xs px-1 py-0 flex-shrink-0`}
                      >
                        {getPositionText(player.position)}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        {typeof player.jersey_number === 'number' && (
                          <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-white bg-red-600 rounded mr-1 flex-shrink-0">
                            {player.jersey_number}
                          </span>
                        )}
                        <span className="font-medium text-gray-900 break-words">
                          {player.player_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {player.goals > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800"
                        >
                          ⚽ {player.goals}
                        </Badge>
                      )}
                      {player.assists > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800"
                        >
                          🅰️ {player.assists}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 교체 선수 */}
          {awayLineups.filter(
            (player) => player.participation_status === 'substitute'
          ).length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-red-700 mb-2 font-medium">
                🔄 교체 출전
              </div>
              <div className="space-y-1">
                {awayLineups
                  .filter(
                    (player) => player.participation_status === 'substitute'
                  )
                  .map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className={`${getPositionColor(
                            player.position
                          )} text-xs px-1 py-0 opacity-80 flex-shrink-0`}
                        >
                          {getPositionText(player.position)}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          {typeof player.jersey_number === 'number' && (
                            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-white bg-red-400 rounded mr-1 flex-shrink-0">
                              {player.jersey_number}
                            </span>
                          )}
                          <span className="font-medium text-gray-800 break-words">
                            {player.player_name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {player.goals > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800"
                          >
                            ⚽ {player.goals}
                          </Badge>
                        )}
                        {player.assists > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800"
                          >
                            🅰️ {player.assists}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 벤치 선수 */}
          {awayLineups.filter(
            (player) => player.participation_status === 'bench'
          ).length > 0 && (
            <div>
              <div className="text-xs text-red-700 mb-2 font-medium">
                🪑 벤치
              </div>
              <div className="space-y-1">
                {awayLineups
                  .filter((player) => player.participation_status === 'bench')
                  .map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className={`${getPositionColor(
                            player.position
                          )} text-xs px-1 py-0 opacity-60 flex-shrink-0`}
                        >
                          {getPositionText(player.position)}
                        </Badge>
                        <span className="text-gray-600 text-xs break-words">
                          {typeof player.jersey_number === 'number' && (
                            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-gray-600 bg-gray-300 rounded mr-1 flex-shrink-0">
                              {player.jersey_number}
                            </span>
                          )}
                          {player.player_name}
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamLineupsSection;
