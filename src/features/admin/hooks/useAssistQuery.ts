'use client';

import { useGoalQueryTyped } from '@/hooks/useGoalQueryTyped';

import { Assist, getAssists } from '../api';

/**
 * 특정 경기의 어시스트 목록을 조회하는 훅
 * @param matchId 경기 ID
 */
export function useMatchAssists(matchId: number) {
  return useGoalQueryTyped<Assist[], typeof getAssists, [number]>(
    getAssists,
    [matchId],
    {
      placeholderData: [],
    }
  );
}
