import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getMatchCoaches } from '../api';

export const useMatchCoaches = (matchId: number) => {
  return useGoalQuery(getMatchCoaches, [matchId]);
};
