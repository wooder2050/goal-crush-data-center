'use client';

import { useRouter } from 'next/navigation';

import { useGoalMutation } from '@/hooks/useGoalMutation';

import { deleteMatch } from '../api';

/**
 * 경기 삭제를 위한 커스텀 훅
 * 삭제 성공 시 경기 관리 페이지로 리다이렉트
 */
export function useDeleteMatchMutation() {
  const router = useRouter();

  return useGoalMutation<void, Error, number>(
    (matchId) => deleteMatch(matchId),
    {
      onSuccess: () => {
        router.refresh(); // 현재 페이지 새로고침
      },
    }
  );
}
