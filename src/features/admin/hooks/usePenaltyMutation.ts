'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useGoalMutation } from '@/hooks/useGoalMutation';

import { createPenalty, CreatePenaltyData, Penalty } from '../api';

/**
 * 페널티킥 추가 Mutation 훅
 * @param matchId 경기 ID
 */
export function useCreatePenaltyMutation(matchId: number) {
  const queryClient = useQueryClient();

  return useGoalMutation<Penalty, Error, CreatePenaltyData>(
    (data) => createPenalty(matchId, data),
    {
      onSuccess: () => {
        // 페널티킥 목록 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ['getPenalties', JSON.stringify([matchId])],
        });
      },
    }
  );
}
