'use client';

import React from 'react';

import { useGoalQuery } from '@/hooks/useGoalQuery';
import type { Assist } from '@/lib/types';

import {
  getMatchAssistsPrisma,
  getMatchGoalsWithAssistsPrisma,
} from '../../api-prisma';

type GoalWithPlayerAndTeam = {
  goal_id: number;
  match_id: number;
  player_id: number;
  goal_time: number | null;
  goal_type: string | null;
  description: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  player: {
    player_id: number;
    name: string;
    jersey_number: number | null;
  };
  team?: {
    team_id: number;
    team_name: string;
  } | null;
};

type AssistWithPlayer = {
  assist_id: number;
  match_id: number;
  player_id: number;
  goal_id: number;
  assist_time: number | null;
  assist_type: string | null;
  description: string | null;
  player: {
    player_id: number;
    name: string;
    jersey_number: number | null;
  };
};

interface GoalSectionProps {
  match: {
    match_id: number;
    home_team: {
      team_id: number;
      team_name: string;
    };
    away_team: {
      team_id: number;
      team_name: string;
    };
  };
}

export default function GoalSection({ match }: GoalSectionProps) {
  const {
    data: goals = [] as GoalWithPlayerAndTeam[],
    isLoading,
    error,
  } = useGoalQuery(getMatchGoalsWithAssistsPrisma, [match.match_id]);

  const {
    data: assists = [] as Assist[],
    isLoading: assistsLoading,
    error: assistsError,
  } = useGoalQuery(getMatchAssistsPrisma, [match.match_id]);

  const assistsByGoal = assists.reduce<Record<number, AssistWithPlayer[]>>(
    (acc, a) => {
      const assist: AssistWithPlayer = {
        assist_id: a.assist_id,
        match_id: a.match_id,
        player_id: a.player_id,
        goal_id: a.goal_id,
        assist_time: a.assist_time ?? null,
        assist_type: a.assist_type ?? null,
        description: a.description ?? null,
        player: { player_id: a.player_id, name: '', jersey_number: null },
      };
      if (!acc[assist.goal_id]) acc[assist.goal_id] = [];
      acc[assist.goal_id].push(assist);
      return acc;
    },
    {}
  );

  if (isLoading || assistsLoading) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">득점</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || assistsError) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">득점</h3>
        <div className="text-red-500">
          득점 정보를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">득점</h3>
        <div className="text-gray-500">득점 기록이 없습니다.</div>
      </div>
    );
  }

  const homeTeamGoals = goals.filter((goal) => {
    if (goal.goal_type === 'own_goal') {
      return goal.team?.team_id === match.away_team.team_id; // 상대팀의 자책골
    }
    return goal.team?.team_id === match.home_team.team_id; // 일반 득점
  });

  const awayTeamGoals = goals.filter((goal) => {
    if (goal.goal_type === 'own_goal') {
      return goal.team?.team_id === match.home_team.team_id; // 상대팀의 자책골
    }
    return goal.team?.team_id === match.away_team.team_id; // 일반 득점
  });

  return (
    <div className="p-4">
      <div className="grid grid-cols-[1fr_72px_1fr] sm:grid-cols-[1fr_112px_1fr] gap-4 items-start">
        {/* Home Team Goals */}
        <div className="space-y-1 text-center">
          <div className="text-xs font-semibold text-gray-600 mb-1 text-center">
            {match.home_team.team_name}
          </div>
          {homeTeamGoals
            .sort((a, b) => (a.goal_time || 999) - (b.goal_time || 999))
            .map((goal, index) => (
              <div
                key={index}
                className="flex items-center justify-center text-xs text-gray-700"
              >
                <div className="w-1.5 h-1.5 bg-black rounded-full mr-2"></div>
                <span className="font-medium">{goal.player?.name}</span>
                <span className="ml-1 text-gray-500">
                  {goal.goal_time && `${goal.goal_time}' `}
                  {goal.goal_type === 'penalty'
                    ? '🎯'
                    : goal.goal_type === 'own_goal'
                      ? '🔄'
                      : '⚽'}
                </span>
                {assistsByGoal[goal.goal_id] &&
                  assistsByGoal[goal.goal_id].length > 0 && (
                    <span className="ml-1 text-blue-600 text-xs">
                      (
                      {assistsByGoal[goal.goal_id]
                        .map((assist) => assist.player?.name)
                        .join(', ')}{' '}
                      🎯)
                    </span>
                  )}
              </div>
            ))}
          {homeTeamGoals.length === 0 && (
            <div className="text-xs text-gray-500 italic">득점 없음</div>
          )}
        </div>

        {/* Center spacer with the same width as the score box */}
        <div aria-hidden className="w-[72px] sm:w-[112px]" />

        {/* Away Team Goals */}
        <div className="space-y-1 text-center">
          <div className="text-xs font-semibold text-gray-600 mb-1 text-center">
            {match.away_team.team_name}
          </div>
          {awayTeamGoals
            .sort((a, b) => (a.goal_time || 999) - (b.goal_time || 999))
            .map((goal, index) => (
              <div
                key={index}
                className="flex items-center justify-center text-xs text-gray-700"
              >
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></div>
                <span className="font-medium">{goal.player?.name}</span>
                <span className="ml-1 text-gray-500">
                  {goal.goal_time && `${goal.goal_time}' `}
                  {goal.goal_type === 'penalty'
                    ? '🎯'
                    : goal.goal_type === 'own_goal'
                      ? '🔄'
                      : '⚽'}
                </span>
                {assistsByGoal[goal.goal_id] &&
                  assistsByGoal[goal.goal_id].length > 0 && (
                    <span className="ml-1 text-blue-600 text-xs">
                      (
                      {assistsByGoal[goal.goal_id]
                        .map((assist) => assist.player?.name)
                        .join(', ')}{' '}
                      🎯)
                    </span>
                  )}
              </div>
            ))}
          {awayTeamGoals.length === 0 && (
            <div className="text-xs text-gray-500 italic">득점 없음</div>
          )}
        </div>
      </div>
    </div>
  );
}
