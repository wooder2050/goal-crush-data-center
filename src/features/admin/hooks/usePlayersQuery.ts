'use client';

import { useGoalQueryTyped } from '@/hooks/useGoalQueryTyped';

import { getTeamPlayers, Player } from '../api';

/**
 * 팀별 선수 목록을 조회하는 훅
 * @param teamId 팀 ID
 */
export function useTeamPlayers(teamId: number | null) {
  return useGoalQueryTyped<Player[], typeof getTeamPlayers, [number]>(
    getTeamPlayers,
    [teamId as number],
    {
      enabled: !!teamId,
      placeholderData: [],
    }
  );
}
