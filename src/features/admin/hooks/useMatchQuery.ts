'use client';

import { useGoalQueryTyped } from '@/hooks/useGoalQueryTyped';

import { getMatch, MatchWithRelations } from '../api';

/**
 * 특정 경기의 상세 정보를 조회하는 훅
 * @param matchId 경기 ID
 */
export function useMatchDetail(matchId: number) {
  return useGoalQueryTyped<MatchWithRelations, typeof getMatch, [number]>(
    getMatch,
    [matchId]
  );
}
