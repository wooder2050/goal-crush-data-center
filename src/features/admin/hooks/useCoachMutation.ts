import { useGoalMutation } from '@/hooks/useGoalMutation';

import { CreateCoachData, createMatchCoach, deleteMatchCoach } from '../api';

export const useCreateMatchCoachMutation = () => {
  return useGoalMutation(
    ({ matchId, data }: { matchId: number; data: CreateCoachData }) =>
      createMatchCoach(matchId, data)
  );
};

export const useDeleteMatchCoachMutation = () => {
  return useGoalMutation(
    ({ matchId, coachId }: { matchId: number; coachId: number }) =>
      deleteMatchCoach(matchId, coachId)
  );
};
