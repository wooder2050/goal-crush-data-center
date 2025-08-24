'use client';

import { useRouter } from 'next/navigation';

import { useGoalMutation } from '@/hooks/useGoalMutation';

import {
  createGoal,
  CreateGoalData,
  createMatch,
  CreateMatchData,
  deleteMatch,
  Goal,
  MatchWithRelations,
  updateMatch,
  UpdateMatchData,
} from '../api';

// 경기 생성 훅
export function useCreateMatchMutation() {
  const router = useRouter();

  return useGoalMutation<MatchWithRelations, Error, CreateMatchData>(
    (data) => createMatch(data),
    {
      onSuccess: () => {
        router.push('/admin/matches');
      },
    }
  );
}

// 경기 업데이트 훅
export function useUpdateMatchMutation(matchId: number) {
  return useGoalMutation<MatchWithRelations, Error, UpdateMatchData>(
    (data) => updateMatch(matchId, data),
    {
      onSuccess: () => {
        // 성공 후 처리 (필요시 구현)
      },
    }
  );
}

// 경기 삭제 훅
export function useDeleteMatchMutation() {
  const router = useRouter();

  return useGoalMutation<void, Error, number>(
    (matchId) => deleteMatch(matchId),
    {
      onSuccess: () => {
        router.push('/admin/matches');
      },
    }
  );
}

// 골 추가 훅
export function useCreateGoalMutation(matchId: number) {
  return useGoalMutation<Goal, Error, CreateGoalData>(
    (data) => createGoal(matchId, data),
    {
      onSuccess: () => {
        // 성공 후 처리 (필요시 구현)
      },
    }
  );
}

// 낙관적 업데이트를 사용한 경기 스코어 업데이트 훅
export function useUpdateMatchScoreOptimistic(matchId: number) {
  // router는 사용하지 않으므로 제거
  return useGoalMutation<MatchWithRelations, Error, UpdateMatchData>(
    (data) => updateMatch(matchId, data),
    {
      onSuccess: () => {
        // 성공 후 처리 (필요시 구현)
      },
    }
  );
}
