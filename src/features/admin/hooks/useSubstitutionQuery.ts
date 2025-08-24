'use client';

import { useGoalQueryTyped } from '@/hooks/useGoalQueryTyped';

import { getSubstitutions, Substitution } from '../api';

/**
 * 특정 경기의 교체 목록을 조회하는 훅
 * @param matchId 경기 ID
 */
export function useMatchSubstitutions(matchId: number) {
  return useGoalQueryTyped<Substitution[], typeof getSubstitutions, [number]>(
    getSubstitutions,
    [matchId],
    {
      placeholderData: [],
    }
  );
}
