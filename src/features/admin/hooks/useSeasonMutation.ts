import {
  createSeasonPrisma,
  deleteSeasonPrisma,
  updateSeasonPrisma,
} from '@/features/seasons/api-prisma';
import { useGoalMutation } from '@/hooks/useGoalMutation';

export const useCreateSeasonMutation = () => {
  return useGoalMutation(createSeasonPrisma);
};

export const useUpdateSeasonMutation = () => {
  return useGoalMutation(
    ({
      seasonId,
      seasonData,
    }: {
      seasonId: number;
      seasonData: {
        season_name: string;
        year: number;
        start_date?: string;
        end_date?: string;
      };
    }) => updateSeasonPrisma(seasonId, seasonData)
  );
};

export const useDeleteSeasonMutation = () => {
  return useGoalMutation(deleteSeasonPrisma);
};
