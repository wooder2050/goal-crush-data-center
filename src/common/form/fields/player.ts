import { z } from 'zod';

export const playerFormSchema = z.object({
  name: z
    .string()
    .min(1, '선수명을 입력해주세요')
    .max(100, '선수명은 100자를 초과할 수 없습니다'),
  birth_date: z.string().optional(),
  nationality: z
    .string()
    .max(50, '국적은 50자를 초과할 수 없습니다')
    .optional(),
  height_cm: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === '') return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .refine((val) => val === undefined || (val >= 100 && val <= 250), {
      message: '신장은 100cm~250cm 범위 내에서 입력해주세요',
    }),
  profile_image_url: z
    .string()
    .url('올바른 URL을 입력해주세요')
    .optional()
    .or(z.literal('')),
  jersey_number: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val === '') return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    })
    .refine((val) => val === undefined || (val >= 1 && val <= 99), {
      message: '등번호는 1~99 범위 내에서 입력해주세요',
    }),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;

// 폼 입력용 타입 (모든 필드가 문자열)
export type PlayerFormInput = {
  name: string;
  birth_date?: string;
  nationality?: string;
  height_cm?: string;
  profile_image_url?: string;
  jersey_number?: string;
};
