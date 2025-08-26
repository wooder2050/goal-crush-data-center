import { z } from 'zod';

export const createPostFormSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(200, '제목은 200자 이하여야 합니다.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  category: z.enum(['team', 'match', 'general', 'prediction']),
  team_id: z.number().optional(),
  match_id: z.number().optional(),
});

export type CreatePostFormValues = z.infer<typeof createPostFormSchema>;
