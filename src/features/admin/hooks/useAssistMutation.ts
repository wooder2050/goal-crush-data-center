'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useGoalMutation } from '@/hooks/useGoalMutation';

import { Assist, createAssist, CreateAssistData } from '../api';

/**
 * 어시스트 추가 Mutation 훅
 * @param matchId 경기 ID
 */
export function useCreateAssistMutation(matchId: number) {
  const queryClient = useQueryClient();

  return useGoalMutation<Assist, Error, CreateAssistData>(
    (data) => createAssist(matchId, data),
    {
      onSuccess: () => {
        // 어시스트 목록 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ['getAssists', JSON.stringify([matchId])],
        });
      },
    }
  );
}
