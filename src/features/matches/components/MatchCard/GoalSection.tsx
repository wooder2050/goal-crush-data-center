'use client';

import React from 'react';

import { useGoalQuery } from '@/hooks/useGoalQuery';
import { MatchWithTeams } from '@/lib/types/database';

import { getMatchGoals } from '../../api';

interface GoalSectionProps {
  match: MatchWithTeams;
  className?: string;
}

const GoalSection: React.FC<GoalSectionProps> = ({ match, className = '' }) => {
  // 득점 데이터를 React Query로 호출
  const {
    data: goals = [],
    isLoading,
    error,
  } = useGoalQuery(getMatchGoals, [match.match_id]);

  // 득점이 없으면 렌더링하지 않음
  if (goals.length === 0 && !isLoading && !error) {
    return null;
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
        <div className="text-sm font-medium text-gray-700 mb-3">
          ⚽ 득점 기록
        </div>
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">
            득점 기록을 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
        <div className="text-sm font-medium text-gray-700 mb-3">
          ⚽ 득점 기록
        </div>
        <div className="text-center py-4">
          <div className="text-red-500 text-sm">
            득점 기록을 불러올 수 없습니다:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  // 홈팀 득점 필터링 (자책골은 반대팀 득점으로 처리)
  const homeTeamGoals = goals.filter((goal) => {
    if (goal.goal_type === 'own_goal') {
      return goal.team?.team_id === match.away_team_id; // 상대팀의 자책골
    }
    return goal.team?.team_id === match.home_team_id; // 일반 득점
  });

  // 원정팀 득점 필터링 (자책골은 반대팀 득점으로 처리)
  const awayTeamGoals = goals.filter((goal) => {
    if (goal.goal_type === 'own_goal') {
      return goal.team?.team_id === match.home_team_id; // 상대팀의 자책골
    }
    return goal.team?.team_id === match.away_team_id; // 일반 득점
  });

  return (
    <div className={`mt-4 pt-3 border-t border-gray-200 ${className}`}>
      <div className="text-sm font-medium text-gray-700 mb-3">⚽ 득점 기록</div>
      <div className="grid grid-cols-2 gap-4">
        {/* Home Team Goals */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-600 mb-1">
            {match.home_team?.team_name}
          </div>
          {homeTeamGoals
            .sort((a, b) => (a.goal_time || 999) - (b.goal_time || 999))
            .map((goal, index) => (
              <div
                key={index}
                className="flex items-center text-xs text-gray-700"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                <span className="font-medium">{goal.player?.name}</span>
                <span className="ml-1 text-gray-500">
                  {goal.goal_time && `${goal.goal_time}' `}
                  {goal.goal_type === 'penalty'
                    ? '🎯'
                    : goal.goal_type === 'own_goal'
                      ? '🔄'
                      : '⚽'}
                </span>
              </div>
            ))}
          {homeTeamGoals.length === 0 && (
            <div className="text-xs text-blue-600 italic">득점 없음</div>
          )}
        </div>

        {/* Away Team Goals */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-600 mb-1">
            {match.away_team?.team_name}
          </div>
          {awayTeamGoals
            .sort((a, b) => (a.goal_time || 999) - (b.goal_time || 999))
            .map((goal, index) => (
              <div
                key={index}
                className="flex items-center text-xs text-gray-700"
              >
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                <span className="font-medium">{goal.player?.name}</span>
                <span className="ml-1 text-gray-500">
                  {goal.goal_time && `${goal.goal_time}' `}
                  {goal.goal_type === 'penalty'
                    ? '🎯'
                    : goal.goal_type === 'own_goal'
                      ? '🔄'
                      : '⚽'}
                </span>
              </div>
            ))}
          {awayTeamGoals.length === 0 && (
            <div className="text-xs text-red-600 italic">득점 없음</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalSection;
