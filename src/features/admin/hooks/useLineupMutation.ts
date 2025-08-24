'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useGoalMutation } from '@/hooks/useGoalMutation';

import { createLineup, CreateLineupData, Lineup } from '../api';

/**
 * 라인업 추가 Mutation 훅
 * @param matchId 경기 ID
 */
export function useCreateLineupMutation(matchId: number) {
  const queryClient = useQueryClient();

  return useGoalMutation<Lineup, Error, CreateLineupData>(
    (data) => createLineup(matchId, data),
    {
      onSuccess: () => {
        // 라인업 목록 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ['getLineups', JSON.stringify([matchId])],
        });
      },
    }
  );
}
