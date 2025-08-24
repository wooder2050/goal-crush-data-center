'use client';

import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { useState } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { NicknameChangeForm } from '@/components/NicknameChangeForm';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  H1,
  Section,
} from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserProfile } from '@/hooks/useUserProfile';
import { isAdminFromProfile } from '@/lib/admin';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { data: profileData, isLoading } = useUserProfile();
  const [isNicknameDialogOpen, setIsNicknameDialogOpen] = useState(false);

  if (!isLoaded || isLoading) {
    return (
      <GoalWrapper>
        <Section>
          <Container>
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </Container>
        </Section>
      </GoalWrapper>
    );
  }

  return (
    <GoalWrapper>
      <Section>
        <Container className="max-w-2xl">
          <H1 className="mb-8">내 프로필</H1>

          <SignedOut>
            <Card>
              <CardHeader>
                <CardTitle>로그인이 필요합니다</CardTitle>
                <CardDescription>
                  프로필을 확인하려면 로그인해주세요.
                </CardDescription>
              </CardHeader>
            </Card>
          </SignedOut>

          <SignedIn>
            {profileData?.user ? (
              <div className="space-y-6">
                {/* 기본 정보 카드 */}
                <Card>
                  <CardHeader>
                    <CardTitle>기본 정보</CardTitle>
                    <CardDescription>
                      계정의 기본 정보를 확인하고 수정할 수 있습니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          이메일
                        </label>
                        <p className="text-gray-900 mt-1">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          닉네임
                        </label>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-gray-900">
                            {profileData.user.korean_nickname}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsNicknameDialogOpen(true)}
                          >
                            변경
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          가입일
                        </label>
                        <p className="text-gray-900 mt-1">
                          {new Date(
                            profileData.user.created_at
                          ).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          계정 상태
                        </label>
                        <div className="flex items-center mt-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              profileData.user.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {profileData.user.is_active ? '활성' : '비활성'}
                          </span>
                          {isAdminFromProfile(profileData.user) && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              관리자
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 계정 설정 카드 */}
                <Card>
                  <CardHeader>
                    <CardTitle>계정 설정</CardTitle>
                    <CardDescription>
                      계정 보안 및 기타 설정을 관리할 수 있습니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">
                        계정 보안 설정
                      </h4>
                      <p className="text-sm text-blue-700 mb-3">
                        비밀번호 변경, 이메일 변경, 2단계 인증 등의 보안 설정을
                        관리하려면 우측 상단의 프로필 아이콘을 클릭하세요.
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        UserButton → Manage account 클릭
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>프로필을 불러올 수 없습니다</CardTitle>
                  <CardDescription>
                    프로필 정보를 불러오는 중 오류가 발생했습니다.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </SignedIn>

          {/* 닉네임 변경 다이얼로그 */}
          <Dialog
            open={isNicknameDialogOpen}
            onOpenChange={setIsNicknameDialogOpen}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>닉네임 변경</DialogTitle>
                <DialogDescription>
                  새로운 닉네임을 입력해주세요. 한글, 영문, 숫자만 사용
                  가능합니다.
                </DialogDescription>
              </DialogHeader>
              <NicknameChangeForm
                onSuccess={() => setIsNicknameDialogOpen(false)}
                onCancel={() => setIsNicknameDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </Container>
      </Section>
    </GoalWrapper>
  );
}
