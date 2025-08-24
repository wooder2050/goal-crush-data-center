import { z } from 'zod';

/**
 * 페널티킥 추가 폼 스키마
 */
export const penaltyFormSchema = z.object({
  team_id: z.string().min(1, '팀을 선택해주세요'),
  player_id: z.string().min(1, '키커를 선택해주세요'),
  goalkeeper_id: z.string().min(1, '골키퍼를 선택해주세요'),
  is_scored: z.boolean(),
  order: z.string().min(1, '순서를 입력해주세요'),
});

/**
 * 페널티킥 추가 폼 타입
 */
export type PenaltyFormValues = z.infer<typeof penaltyFormSchema>;
