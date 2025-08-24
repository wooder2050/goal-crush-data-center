import { z } from 'zod';

/**
 * 골 추가 폼 스키마
 */
export const goalFormSchema = z.object({
  player_id: z.string().min(1, '선수를 선택해주세요'),
  goal_time: z.string().min(1, '골 시간을 입력해주세요'),
  goal_type: z.string(),
  description: z.string().optional(),
});

/**
 * 골 추가 폼 타입
 */
export type GoalFormValues = z.infer<typeof goalFormSchema>;
