'use client';

import { useGoalQueryTyped } from '@/hooks/useGoalQueryTyped';

import { getLineups, Lineup } from '../api';

/**
 * 특정 경기의 라인업 목록을 조회하는 훅
 * @param matchId 경기 ID
 */
export function useMatchLineups(matchId: number) {
  return useGoalQueryTyped<Lineup[], typeof getLineups, [number]>(
    getLineups,
    [matchId],
    {
      placeholderData: [],
    }
  );
}
