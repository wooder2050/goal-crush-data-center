'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useGoalMutation } from '@/hooks/useGoalMutation';

import { createGoal, CreateGoalData, Goal } from '../api';

/**
 * 골 추가 Mutation 훅
 * @param matchId 경기 ID
 */
export function useCreateGoalMutation(matchId: number) {
  const queryClient = useQueryClient();

  return useGoalMutation<Goal, Error, CreateGoalData>(
    (data) => createGoal(matchId, data),
    {
      onSuccess: () => {
        // 골 목록 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ['getGoals', JSON.stringify([matchId])],
        });
      },
    }
  );
}
