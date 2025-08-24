'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { useGoalForm } from '@/common/form/useGoalForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useCheckNickname,
  useUpdateProfile,
  useUserProfile,
} from '@/hooks/useUserProfile';

interface NicknameChangeFormData {
  korean_nickname: string;
}

const nicknameSchema = z.object({
  korean_nickname: z
    .string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다')
    .max(10, '닉네임은 최대 10자까지 가능합니다')
    .regex(
      /^[가-힣a-zA-Z0-9\s]+$/,
      '닉네임은 한글, 영문, 숫자만 사용 가능합니다'
    ),
});

interface NicknameChangeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NicknameChangeForm({
  onSuccess,
  onCancel,
}: NicknameChangeFormProps) {
  const { data: profileData, refetch } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const checkNickname = useCheckNickname();
  const queryClient = useQueryClient();

  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null);
  const [hasCheckedInitial, setHasCheckedInitial] = useState(false);

  const form = useGoalForm({
    zodSchema: nicknameSchema,
    defaultValues: {
      korean_nickname: profileData?.user?.korean_nickname || '',
    },
  });

  // 프로필 데이터가 로드되면 현재 닉네임으로 초기화
  useEffect(() => {
    if (profileData?.user?.korean_nickname && !hasCheckedInitial) {
      form.setValue('korean_nickname', profileData.user.korean_nickname);
      setHasCheckedInitial(true);
    }
  }, [profileData?.user?.korean_nickname, form, hasCheckedInitial]);

  // 닉네임 중복 체크
  const handleNicknameCheck = async (nickname: string) => {
    if (!nickname.trim()) {
      setNicknameCheckMessage('');
      setIsNicknameAvailable(null);
      return;
    }

    // 현재 닉네임과 같다면 사용 가능으로 처리
    if (nickname === profileData?.user?.korean_nickname) {
      setNicknameCheckMessage('현재 사용 중인 닉네임입니다');
      setIsNicknameAvailable(true);
      return;
    }

    if (nickname.length < 2) {
      setNicknameCheckMessage('닉네임은 최소 2자 이상이어야 합니다');
      setIsNicknameAvailable(false);
      return;
    }

    try {
      const result = await checkNickname.mutateAsync({
        korean_nickname: nickname,
      });
      setNicknameCheckMessage(result.message);
      setIsNicknameAvailable(result.isAvailable);
    } catch {
      setNicknameCheckMessage('닉네임 확인 중 오류가 발생했습니다');
      setIsNicknameAvailable(false);
    }
  };

  // 폼 제출
  const onSubmit = async (data: NicknameChangeFormData) => {
    // 현재 닉네임과 같다면 변경하지 않음
    if (data.korean_nickname === profileData?.user?.korean_nickname) {
      if (onCancel) {
        onCancel();
      }
      return;
    }

    if (!isNicknameAvailable) {
      alert('사용 가능한 닉네임을 입력해주세요');
      return;
    }

    try {
      await updateProfile.mutateAsync({
        korean_nickname: data.korean_nickname.trim(),
      });

      // 프로필 캐시 무효화 및 재조회
      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      await refetch();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      alert(
        error instanceof Error ? error.message : '닉네임 변경에 실패했습니다'
      );
    }
  };

  const currentNickname = form.watch('korean_nickname');

  // 닉네임이 변경될 때마다 중복 체크 (디바운싱 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentNickname && hasCheckedInitial) {
        handleNicknameCheck(currentNickname);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentNickname, hasCheckedInitial]);

  const isFormValid =
    isNicknameAvailable &&
    currentNickname !== profileData?.user?.korean_nickname;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label
          htmlFor="korean_nickname"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          닉네임 *
        </Label>
        <Input
          id="korean_nickname"
          {...form.register('korean_nickname')}
          placeholder="예: 홍길동"
          className="w-full"
        />
        {nicknameCheckMessage && (
          <p
            className={`text-xs mt-1 ${
              isNicknameAvailable ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {nicknameCheckMessage}
          </p>
        )}
        {form.formState.errors.korean_nickname && (
          <p className="text-xs text-red-600 mt-1">
            {form.formState.errors.korean_nickname.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          한글, 영문, 숫자 사용 가능 (2-10자)
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={updateProfile.isPending || !isFormValid}
          className="flex-1"
        >
          {updateProfile.isPending ? '변경 중...' : '닉네임 변경'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={updateProfile.isPending}
            className="flex-1"
          >
            취소
          </Button>
        )}
      </div>
    </form>
  );
}
