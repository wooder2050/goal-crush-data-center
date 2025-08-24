'use client';

import { useGoalQueryTyped } from '@/hooks/useGoalQueryTyped';

import { getGoals, Goal } from '../api';

/**
 * 특정 경기의 골 목록을 조회하는 훅
 * @param matchId 경기 ID
 */
export function useMatchGoals(matchId: number) {
  return useGoalQueryTyped<Goal[], typeof getGoals, [number]>(
    getGoals,
    [matchId],
    {
      placeholderData: [],
    }
  );
}
