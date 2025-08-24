import { z } from 'zod';

export const coachFormSchema = z.object({
  team_id: z.number().min(1, '팀을 선택해주세요'),
  coach_id: z.number().min(1, '감독을 선택해주세요'),
  role: z.string().min(1, '역할을 선택해주세요'),
});

export type CoachFormValues = z.infer<typeof coachFormSchema>;
