'use client';

import React from 'react';

import { Card } from '@/components/ui';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import { MatchWithTeams } from '@/lib/types/database';

import { getTeamRecentFormPrisma } from '../../api-prisma';

interface RecentFormSectionProps {
  match: MatchWithTeams;
}

interface RecentMatchResult {
  match_id: number;
  match_date: string;
  home_team_id: number;
  away_team_id: number;
  home_score: number | null;
  away_score: number | null;
  penalty_home_score: number | null;
  penalty_away_score: number | null;
  home_team: {
    team_id: number;
    team_name: string;
  };
  away_team: {
    team_id: number;
    team_name: string;
  };
}

export default function RecentFormSection({ match }: RecentFormSectionProps) {
  const matchDate = match.match_date;

  const homeTeamId = match.home_team_id ?? 0;
  const awayTeamId = match.away_team_id ?? 0;

  const { data: homeRecentMatches = [] } = useGoalSuspenseQuery(
    getTeamRecentFormPrisma,
    [homeTeamId, matchDate]
  );

  const { data: awayRecentMatches = [] } = useGoalSuspenseQuery(
    getTeamRecentFormPrisma,
    [awayTeamId, matchDate]
  );

  if (!match.home_team_id || !match.away_team_id) {
    return (
      <Card className="p-3 sm:p-4">
        <div className="text-sm text-gray-500">
          팀 정보를 불러올 수 없습니다.
        </div>
      </Card>
    );
  }

  const getRecentForm = (matches: RecentMatchResult[], teamId: number) => {
    if (matches.length === 0) {
      return {
        results: [],
        wins: 0,
        draws: 0,
        losses: 0,
        penalties: 0,
        matchDetails: [],
      };
    }

    const results = matches.map((match) => {
      const isHome = match.home_team_id === teamId;
      const teamScore = isHome ? match.home_score : match.away_score;
      const opponentScore = isHome ? match.away_score : match.home_score;
      const opponentTeam = isHome ? match.away_team : match.home_team;

      if (teamScore === null || opponentScore === null)
        return { result: 'N', opponent: null };

      if (teamScore > opponentScore)
        return { result: 'W', opponent: opponentTeam };
      if (teamScore < opponentScore)
        return { result: 'L', opponent: opponentTeam };

      if (
        match.penalty_home_score !== null &&
        match.penalty_away_score !== null
      ) {
        const teamPenaltyScore = isHome
          ? match.penalty_home_score
          : match.penalty_away_score;
        const opponentPenaltyScore = isHome
          ? match.penalty_away_score
          : match.penalty_home_score;

        if (teamPenaltyScore > opponentPenaltyScore) {
          return { result: 'PW', opponent: opponentTeam }; // Penalty Win
        } else {
          return { result: 'PL', opponent: opponentTeam }; // Penalty Loss
        }
      }

      return { result: 'D', opponent: opponentTeam }; // Draw
    });

    return {
      results: results.map((r) => r.result),
      wins: results.filter((r) => r.result === 'W').length,
      draws: results.filter((r) => r.result === 'D').length,
      losses: results.filter((r) => r.result === 'L').length,
      penalties:
        results.filter((r) => r.result === 'PW').length +
        results.filter((r) => r.result === 'PL').length,
      penaltyWins: results.filter((r) => r.result === 'PW').length,
      penaltyLosses: results.filter((r) => r.result === 'PL').length,
      matchDetails: results,
    };
  };

  const homeForm = getRecentForm(homeRecentMatches, match.home_team_id);
  const awayForm = getRecentForm(awayRecentMatches, match.away_team_id);

  const getResultColor = (result: string) => {
    switch (result) {
      case 'W':
      case 'PW':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'L':
      case 'PL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'D':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'N':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'W':
        return '승';
      case 'L':
        return '패';
      case 'PW':
        return '승';
      case 'PL':
        return '패';
      case 'D':
        return '무';
      case 'N':
        return '-';
      default:
        return '?';
    }
  };

  const getResultDisplay = (result: string) => {
    const isPenalty = result === 'PW' || result === 'PL';
    return (
      <div className="flex items-center gap-1">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${getResultColor(result)}`}
        >
          {getResultText(result)}
        </span>
        {isPenalty && (
          <span className="text-[10px] text-gray-500 font-medium">PK</span>
        )}
      </div>
    );
  };

  return (
    <Card className="p-3 sm:p-4">
      <div className="mb-3 text-sm font-semibold text-gray-800">
        📊 최근 5경기 성적
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-600 mb-2 font-medium">
            {match.home_team.team_name}
          </div>

          <div className="text-[10px] text-gray-500 space-y-1">
            {homeForm.matchDetails.slice(0, 5).map(
              (matchDetail, index) =>
                matchDetail.opponent && (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-400">
                      vs {matchDetail.opponent.team_name}
                    </span>
                    {getResultDisplay(homeForm.results[index])}
                  </div>
                )
            )}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-600 mb-2 font-medium">
            {match.away_team.team_name}
          </div>

          <div className="text-[10px] text-gray-500 space-y-1">
            {awayForm.matchDetails.slice(0, 5).map(
              (matchDetail, index) =>
                matchDetail.opponent && (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-400">
                      vs {matchDetail.opponent.team_name}
                    </span>
                    {getResultDisplay(awayForm.results[index])}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
