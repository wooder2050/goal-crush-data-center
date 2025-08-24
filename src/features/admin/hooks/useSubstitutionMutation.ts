'use client';

import { useQueryClient } from '@tanstack/react-query';

import { useGoalMutation } from '@/hooks/useGoalMutation';

import {
  createSubstitution,
  CreateSubstitutionData,
  Substitution,
} from '../api';

/**
 * 교체 추가 Mutation 훅
 * @param matchId 경기 ID
 */
export function useCreateSubstitutionMutation(matchId: number) {
  const queryClient = useQueryClient();

  return useGoalMutation<Substitution, Error, CreateSubstitutionData>(
    (data) => createSubstitution(matchId, data),
    {
      onSuccess: () => {
        // 교체 목록 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ['getSubstitutions', JSON.stringify([matchId])],
        });
      },
    }
  );
}
