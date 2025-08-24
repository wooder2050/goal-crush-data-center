import { z } from 'zod';

/**
 * 어시스트 추가 폼 스키마
 */
export const assistFormSchema = z.object({
  player_id: z.string().min(1, '선수를 선택해주세요'),
  goal_id: z.string().min(1, '골을 선택해주세요'),
  description: z.string().optional(),
});

/**
 * 어시스트 추가 폼 타입
 */
export type AssistFormValues = z.infer<typeof assistFormSchema>;
