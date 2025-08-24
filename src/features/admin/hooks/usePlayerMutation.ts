import {
  createPlayerPrisma,
  deletePlayerPrisma,
  UpdatePlayerData,
  updatePlayerPrisma,
} from '@/features/players/api-admin';
import { useGoalMutation } from '@/hooks/useGoalMutation';

export const useCreatePlayerMutation = () => {
  return useGoalMutation(createPlayerPrisma);
};

export const useUpdatePlayerMutation = () => {
  return useGoalMutation(
    ({ playerId, data }: { playerId: number; data: UpdatePlayerData }) =>
      updatePlayerPrisma(playerId, data)
  );
};

export const useDeletePlayerMutation = () => {
  return useGoalMutation(deletePlayerPrisma);
};
