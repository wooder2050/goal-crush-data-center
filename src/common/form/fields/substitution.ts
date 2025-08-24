import { z } from 'zod';

/**
 * 교체 추가 폼 스키마
 */
export const substitutionFormSchema = z.object({
  team_id: z.string().min(1, '팀을 선택해주세요'),
  player_in_id: z.string().min(1, '투입 선수를 선택해주세요'),
  player_out_id: z.string().min(1, '교체 선수를 선택해주세요'),
  substitution_time: z.string().min(1, '교체 시간을 입력해주세요'),
  description: z.string().optional(),
});

/**
 * 교체 추가 폼 타입
 */
export type SubstitutionFormValues = z.infer<typeof substitutionFormSchema>;
