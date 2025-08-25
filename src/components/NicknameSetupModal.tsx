'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { useGoalForm } from '@/common/form/useGoalForm';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useCheckNickname,
  useUpdateProfile,
  useUserProfile,
} from '@/hooks/useUserProfile';

interface NicknameFormData {
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

export function NicknameSetupModal() {
  const { user, loading } = useAuth();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const checkNickname = useCheckNickname();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isManuallyClosing, setIsManuallyClosing] = useState(false);
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null);

  const form = useGoalForm({
    zodSchema: nicknameSchema,
    defaultValues: {
      korean_nickname: '',
    },
  });

  // 사용자가 로그인했지만 닉네임이 없으면 모달 표시
  useEffect(() => {
    if (!loading && user && !isProfileLoading && profileData) {
      const shouldShowModal = !profileData.hasNickname;

      // 수동으로 닫는 중이 아닐 때만 모달 상태 변경
      if (!isManuallyClosing) {
        setIsOpen(shouldShowModal);
      }

      // 닉네임이 있으면 수동 닫기 상태 리셋
      if (profileData.hasNickname && isManuallyClosing) {
        setIsManuallyClosing(false);
      }

      // 디버깅을 위한 로그
      console.log('Profile check:', {
        hasNickname: profileData.hasNickname,
        user: profileData.user?.korean_nickname,
        shouldShowModal,
        isManuallyClosing,
        currentIsOpen: isOpen,
      });
    }
  }, [loading, user, isProfileLoading, profileData, isManuallyClosing, isOpen]);

  // 닉네임 중복 체크
  const handleNicknameCheck = async (nickname: string) => {
    if (!nickname.trim()) {
      setNicknameCheckMessage('');
      setIsNicknameAvailable(null);
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
  const onSubmit = async (data: NicknameFormData) => {
    console.log('onSubmit', data);
    console.log('isNicknameAvailable', isNicknameAvailable);
    if (!isNicknameAvailable) {
      alert('사용 가능한 닉네임을 입력해주세요');
      return;
    }

    try {
      // 수동으로 닫는 상태로 설정
      setIsManuallyClosing(true);

      await updateProfile.mutateAsync({
        korean_nickname: data.korean_nickname.trim(),
      });

      // 프로필 캐시 무효화 및 재조회
      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });

      // 모달 먼저 닫기
      setIsOpen(false);

      // 약간의 지연 후 데이터 재조회 (모달이 닫힌 후)
      setTimeout(async () => {
        await refetch();
        setIsManuallyClosing(false);
      }, 100);
    } catch (error) {
      // 에러 발생 시 수동 닫기 상태 해제
      setIsManuallyClosing(false);
      alert(
        error instanceof Error ? error.message : '닉네임 설정에 실패했습니다'
      );
    }
  };

  if (loading || !user || isProfileLoading) {
    return null;
  }
  // 모달 닫기 제어 (닉네임 설정이 필수이므로 사용자가 임의로 닫을 수 없음)
  const handleOpenChange = (open: boolean) => {
    // 닉네임 설정이 완료되지 않았으면 모달을 닫을 수 없음
    if (!open && profileData && !profileData.hasNickname) {
      return; // 모달 닫기 방지
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            닉네임 설정
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            서비스 이용을 위해 닉네임을 설정해주세요
          </DialogDescription>
        </DialogHeader>

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
              onChange={(e) => {
                form.setValue('korean_nickname', e.target.value);
                handleNicknameCheck(e.target.value);
              }}
            />
            {nicknameCheckMessage && (
              <p
                className={`text-xs mt-1 ${isNicknameAvailable ? 'text-green-600' : 'text-red-600'}`}
              >
                {nicknameCheckMessage}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              한글, 영문, 숫자 사용 가능 (2-10자)
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={updateProfile.isPending || !isNicknameAvailable}
          >
            {updateProfile.isPending ? '설정 중...' : '닉네임 설정하기'}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          * 닉네임 설정 후 서비스를 이용할 수 있습니다
        </p>
      </DialogContent>
    </Dialog>
  );
}
