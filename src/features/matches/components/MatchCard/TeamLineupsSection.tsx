'use client';

import Link from 'next/link';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { useGoalQuery } from '@/hooks/useGoalQuery';
import type { Assist } from '@/lib/types';
import { MatchWithTeams } from '@/lib/types/database';

import { getMatchAssistsPrisma, getMatchLineupsPrisma } from '../../api-prisma';
import { getPositionColor, getPositionText } from '../../lib/matchUtils';
import LineupsEmpty from './LineupsEmpty';
import LineupsSkeleton from './LineupsSkeleton';

// Lineup player type definition
interface LineupPlayer {
  player_id: number;
  player_name: string;
  jersey_number: number | null;
  position: string;
  participation_status: string;
  goals: number;
  yellow_cards: number;
  red_cards: number;
  card_type: 'none' | 'yellow' | 'red_direct' | 'red_accumulated';
  assists?: number;
}

interface TeamLineupsSectionProps {
  match: MatchWithTeams;
  className?: string;
}

const TeamLineupsSection: React.FC<TeamLineupsSectionProps> = ({
  match,
  className = '',
}) => {
  // Fetch lineup data via React Query
  const {
    data: lineups = {},
    isLoading,
    error,
  } = useGoalQuery(getMatchLineupsPrisma, [match.match_id]);

  // Fetch assist data via React Query
  const { data: assists = [] as Assist[] } = useGoalQuery(
    getMatchAssistsPrisma,
    [match.match_id]
  );

  const homeTeamKey = `${match.match_id}_${match.home_team_id}`;
  const awayTeamKey = `${match.match_id}_${match.away_team_id}`;
  const homeLineups = lineups[homeTeamKey] || [];
  const awayLineups = lineups[awayTeamKey] || [];

  // Calculate number of assists per player
  const assistsByPlayer = assists.reduce(
    (acc, assist) => {
      const playerId = assist.player_id;
      acc[playerId] = (acc[playerId] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  // Add assist info to lineup
  const addAssistsToLineup = (lineup: LineupPlayer[]): LineupPlayer[] => {
    return lineup.map((player) => {
      const assists = assistsByPlayer[player.player_id] || 0;
      return {
        ...player,
        assists,
      };
    });
  };

  const homeLineupWithAssists = addAssistsToLineup(homeLineups);
  const awayLineupWithAssists = addAssistsToLineup(awayLineups);

  // Resolve team colors (with defaults)
  const homeTeamPrimaryColor = match.home_team?.primary_color || '#000000';
  const awayTeamPrimaryColor = match.away_team?.primary_color || '#6B7280';
  const homeTeamSecondaryColor = match.home_team?.secondary_color || '#6B7280';
  const awayTeamSecondaryColor = match.away_team?.secondary_color || '#6B7280';

  // Sort players by position
  const sortByPosition = (players: LineupPlayer[]) => {
    const positionOrder = { FW: 1, MF: 2, DF: 3, GK: 4 };
    return players.sort((a, b) => {
      const aOrder =
        positionOrder[a.position as keyof typeof positionOrder] || 5;
      const bOrder =
        positionOrder[b.position as keyof typeof positionOrder] || 5;
      return aOrder - bOrder;
    });
  };

  return (
    <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">👥 출전 선수</div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {isLoading && <LineupsSkeleton className={className} />}

        {error && (
          <div className="text-center py-4">
            <div className="text-gray-500 text-sm">
              라인업을 불러올 수 없습니다:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </div>
        )}

        {!isLoading &&
          !error &&
          homeLineups.length === 0 &&
          awayLineups.length === 0 && <LineupsEmpty className={className} />}

        {!isLoading &&
          !error &&
          (homeLineups.length > 0 || awayLineups.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {/* Home Team Players */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: homeTeamPrimaryColor,
                      border: `1px solid ${homeTeamSecondaryColor}`,
                    }}
                  ></div>
                  {match.home_team?.team_name}
                </div>

                {/* Starters */}
                <div className="mb-3">
                  <div className="text-xs text-gray-700 mb-2 font-medium">
                    ⭐ 선발
                  </div>
                  <div className="space-y-1">
                    {sortByPosition(
                      homeLineupWithAssists.filter(
                        (player) => player.participation_status === 'starting'
                      )
                    ).map((player, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <Badge
                            variant="outline"
                            className={`${getPositionColor(player.position)} text-xs px-1 py-0 flex-shrink-0`}
                          >
                            {getPositionText(player.position)}
                          </Badge>
                          <div className="flex min-w-0 flex-1">
                            {typeof player.jersey_number === 'number' && (
                              <span
                                className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded mr-1 flex-shrink-0 border"
                                style={{
                                  backgroundColor: homeTeamPrimaryColor,
                                  color: homeTeamSecondaryColor,
                                  borderColor: homeTeamSecondaryColor,
                                }}
                              >
                                {player.jersey_number}
                              </span>
                            )}
                            <Link
                              href={`/players/${player.player_id}`}
                              className="font-medium text-gray-900 break-words hover:underline"
                            >
                              {player.player_name}
                            </Link>
                            <div className="flex gap-1 ml-2">
                              {!!player.goals && player.goals > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800"
                                >
                                  ⚽ {player.goals}
                                </Badge>
                              )}
                              {!!player.assists && player.assists > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
                                >
                                  🎯 {player.assists}
                                </Badge>
                              )}
                              {player.yellow_cards > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800"
                                >
                                  🟨 {player.yellow_cards}
                                </Badge>
                              )}
                              {player.card_type === 'red_direct' && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                >
                                  🟥 다이렉트
                                </Badge>
                              )}
                              {player.card_type === 'red_accumulated' && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                >
                                  🟥 누적
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitutes */}
                {homeLineupWithAssists.filter(
                  (player) => player.participation_status === 'substitute'
                ).length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <div className="text-xs text-gray-700 mb-2 font-medium">
                      🔄 교체 출전
                    </div>
                    <div className="space-y-1">
                      {sortByPosition(
                        homeLineupWithAssists.filter(
                          (player) =>
                            player.participation_status === 'substitute'
                        )
                      ).map((player, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <Badge
                              variant="outline"
                              className={`${getPositionColor(player.position)} text-xs px-1 py-0 opacity-80 flex-shrink-0`}
                            >
                              {getPositionText(player.position)}
                            </Badge>
                            <div className="flex min-w-0 flex-1">
                              {typeof player.jersey_number === 'number' && (
                                <span
                                  className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded mr-1 flex-shrink-0 border"
                                  style={{
                                    backgroundColor: homeTeamPrimaryColor,
                                    color: homeTeamSecondaryColor,
                                    borderColor: homeTeamSecondaryColor,
                                  }}
                                >
                                  {player.jersey_number}
                                </span>
                              )}
                              <Link
                                href={`/players/${player.player_id}`}
                                className="font-medium text-gray-800 break-words hover:underline"
                              >
                                {player.player_name}
                              </Link>
                              <div className="flex gap-1 ml-2">
                                {!!player.goals && player.goals > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800"
                                  >
                                    ⚽ {player.goals}
                                  </Badge>
                                )}
                                {!!player.assists && player.assists > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
                                  >
                                    🎯 {player.assists}
                                  </Badge>
                                )}
                                {player.yellow_cards > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800"
                                  >
                                    🟨 {player.yellow_cards}
                                  </Badge>
                                )}
                                {player.card_type === 'red_direct' && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                  >
                                    🟥 다이렉트
                                  </Badge>
                                )}
                                {player.card_type === 'red_accumulated' && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                  >
                                    🟥 누적
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bench */}
                {homeLineupWithAssists.filter(
                  (player) => player.participation_status === 'bench'
                ).length > 0 && (
                  <div>
                    <div className="text-xs text-gray-700 mb-2 font-medium">
                      🪑 벤치
                    </div>
                    <div className="space-y-1">
                      {sortByPosition(
                        homeLineupWithAssists.filter(
                          (player) => player.participation_status === 'bench'
                        )
                      ).map((player, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <Badge
                              variant="outline"
                              className={`${getPositionColor(player.position)} text-xs px-1 py-0 opacity-60 flex-shrink-0`}
                            >
                              {getPositionText(player.position)}
                            </Badge>
                            <span className="text-gray-600 text-xs break-words">
                              {typeof player.jersey_number === 'number' && (
                                <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-gray-600 bg-gray-300 rounded mr-1 flex-shrink-0">
                                  {player.jersey_number}
                                </span>
                              )}
                              <Link
                                href={`/players/${player.player_id}`}
                                className="hover:underline"
                              >
                                {player.player_name}
                              </Link>
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
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: awayTeamPrimaryColor,
                      border: `1px solid ${awayTeamSecondaryColor}`,
                    }}
                  ></div>
                  {match.away_team?.team_name}
                </div>

                {/* Starters */}
                <div className="mb-3">
                  <div className="text-xs text-gray-700 mb-2 font-medium">
                    ⭐ 선발
                  </div>
                  <div className="space-y-1">
                    {sortByPosition(
                      awayLineupWithAssists.filter(
                        (player) => player.participation_status === 'starting'
                      )
                    ).map((player, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <Badge
                            variant="outline"
                            className={`${getPositionColor(player.position)} text-xs px-1 py-0 flex-shrink-0`}
                          >
                            {getPositionText(player.position)}
                          </Badge>
                          <div className="flex min-w-0 flex-1">
                            {typeof player.jersey_number === 'number' && (
                              <span
                                className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded mr-1 flex-shrink-0 border"
                                style={{
                                  backgroundColor: awayTeamPrimaryColor,
                                  color: awayTeamSecondaryColor,
                                  borderColor: awayTeamSecondaryColor,
                                }}
                              >
                                {player.jersey_number}
                              </span>
                            )}
                            <Link
                              href={`/players/${player.player_id}`}
                              className="font-medium text-gray-900 break-words hover:underline"
                            >
                              {player.player_name}
                            </Link>
                            <div className="flex gap-1 ml-2">
                              {!!player.goals && player.goals > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800"
                                >
                                  ⚽ {player.goals}
                                </Badge>
                              )}
                              {!!player.assists && player.assists > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
                                >
                                  🎯 {player.assists}
                                </Badge>
                              )}
                              {player.yellow_cards > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800"
                                >
                                  🟨 {player.yellow_cards}
                                </Badge>
                              )}
                              {player.card_type === 'red_direct' && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                >
                                  🟥 다이렉트
                                </Badge>
                              )}
                              {player.card_type === 'red_accumulated' && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                >
                                  🟥 누적
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitutes */}
                {awayLineupWithAssists.filter(
                  (player) => player.participation_status === 'substitute'
                ).length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <div className="text-xs text-gray-700 mb-2 font-medium">
                      🔄 교체 출전
                    </div>
                    <div className="space-y-1">
                      {sortByPosition(
                        awayLineupWithAssists.filter(
                          (player) =>
                            player.participation_status === 'substitute'
                        )
                      ).map((player, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <Badge
                              variant="outline"
                              className={`${getPositionColor(player.position)} text-xs px-1 py-0 opacity-80 flex-shrink-0`}
                            >
                              {getPositionText(player.position)}
                            </Badge>
                            <div className="flex min-w-0 flex-1">
                              {typeof player.jersey_number === 'number' && (
                                <span
                                  className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold rounded mr-1 flex-shrink-0 border"
                                  style={{
                                    backgroundColor: awayTeamPrimaryColor,
                                    color: awayTeamSecondaryColor,
                                    borderColor: awayTeamSecondaryColor,
                                  }}
                                >
                                  {player.jersey_number}
                                </span>
                              )}
                              <Link
                                href={`/players/${player.player_id}`}
                                className="font-medium text-gray-800 break-words hover:underline"
                              >
                                {player.player_name}
                              </Link>
                              <div className="flex gap-1 ml-2">
                                {!!player.goals && player.goals > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800"
                                  >
                                    ⚽ {player.goals}
                                  </Badge>
                                )}
                                {!!player.assists && player.assists > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800"
                                  >
                                    🎯 {player.assists}
                                  </Badge>
                                )}
                                {player.yellow_cards > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800"
                                  >
                                    🟨 {player.yellow_cards}
                                  </Badge>
                                )}
                                {player.card_type === 'red_direct' && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                  >
                                    🟥 다이렉트
                                  </Badge>
                                )}
                                {player.card_type === 'red_accumulated' && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-[#ffefeb] text-[#ff4800] border-[#ff4800]"
                                  >
                                    🟥 누적
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bench */}
                {awayLineupWithAssists.filter(
                  (player) => player.participation_status === 'bench'
                ).length > 0 && (
                  <div>
                    <div className="text-xs text-gray-700 mb-2 font-medium">
                      🪑 벤치
                    </div>
                    <div className="space-y-1">
                      {sortByPosition(
                        awayLineupWithAssists.filter(
                          (player) => player.participation_status === 'bench'
                        )
                      ).map((player, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <Badge
                              variant="outline"
                              className={`${getPositionColor(player.position)} text-xs px-1 py-0 opacity-60 flex-shrink-0`}
                            >
                              {getPositionText(player.position)}
                            </Badge>
                            <span className="text-gray-600 text-xs break-words">
                              {typeof player.jersey_number === 'number' && (
                                <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-gray-600 bg-gray-300 rounded mr-1 flex-shrink-0">
                                  {player.jersey_number}
                                </span>
                              )}
                              <Link
                                href={`/players/${player.player_id}`}
                                className="hover:underline"
                              >
                                {player.player_name}
                              </Link>
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
          )}
      </div>
    </div>
  );
};

export default TeamLineupsSection;
