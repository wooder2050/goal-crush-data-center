import { z } from 'zod';

export const seasonFormSchema = z.object({
  season_name: z.string().min(1, '시즌명을 입력해주세요'),
  year: z.string().min(1, '연도를 입력해주세요'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type SeasonFormValues = z.infer<typeof seasonFormSchema>;
