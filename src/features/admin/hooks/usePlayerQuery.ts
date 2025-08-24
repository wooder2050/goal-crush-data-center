import {
  getAllPlayersPrisma,
  getPlayerPrisma,
} from '@/features/players/api-admin';
import { useGoalQuery } from '@/hooks/useGoalQuery';

export const useAllPlayers = (params?: {
  name?: string;
  page?: number;
  limit?: number;
  team_id?: number;
  order?: 'apps' | 'goals' | 'assists';
  position?: string;
}) => {
  return useGoalQuery(getAllPlayersPrisma, [params], { enabled: true });
};

export const usePlayer = (playerId: number) => {
  return useGoalQuery(getPlayerPrisma, [playerId], { enabled: !!playerId });
};
