import { z } from 'zod';

/**
 * 라인업 추가 폼 스키마
 */
export const lineupFormSchema = z.object({
  player_id: z.string().min(1, '선수를 선택해주세요'),
  team_id: z.string().min(1, '팀을 선택해주세요'),
  position: z.string().min(1, '포지션을 선택해주세요'),
  jersey_number: z.string().optional(),
});

/**
 * 라인업 추가 폼 타입
 */
export type LineupFormValues = z.infer<typeof lineupFormSchema>;
