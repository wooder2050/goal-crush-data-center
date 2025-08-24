'use client';

import { useGoalQueryTyped } from '@/hooks/useGoalQueryTyped';

import { getPenalties, Penalty } from '../api';

/**
 * 특정 경기의 페널티킥 목록을 조회하는 훅
 * @param matchId 경기 ID
 */
export function useMatchPenalties(matchId: number) {
  return useGoalQueryTyped<Penalty[], typeof getPenalties, [number]>(
    getPenalties,
    [matchId],
    {
      placeholderData: [],
    }
  );
}
