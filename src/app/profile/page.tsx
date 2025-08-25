'use client';

import { useState } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { useAuth } from '@/components/AuthProvider';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUserProfile } from '@/hooks/useUserProfile';

function ProfileContent() {
  const { user, signOut } = useAuth();
  const { data: profileData, isLoading } = useUserProfile();
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
          </div>
          <Card>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Section>
        <H1>프로필</H1>
        <p className="text-gray-600 mb-8">계정 정보를 확인하고 관리하세요.</p>

        <div className="space-y-6">
          {/* 기본 정보 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>로그인 계정의 기본 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <p className="text-gray-900">{user?.email || '정보 없음'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    가입일
                  </label>
                  <p className="text-gray-900">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('ko-KR')
                      : '정보 없음'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 닉네임 관리 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>닉네임 관리</CardTitle>
              <CardDescription>
                사이트에서 사용할 닉네임을 설정하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    현재 닉네임:{' '}
                    <span className="text-gray-600">
                      {profileData?.user?.korean_nickname || '설정되지 않음'}
                    </span>
                  </p>
                </div>
                <Dialog
                  open={isNicknameModalOpen}
                  onOpenChange={setIsNicknameModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      변경
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>닉네임 변경</DialogTitle>
                      <DialogDescription>
                        새로운 닉네임을 입력해주세요.
                      </DialogDescription>
                    </DialogHeader>
                    <NicknameChangeForm
                      onSuccess={() => setIsNicknameModalOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* 계정 관리 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>계정 관리</CardTitle>
              <CardDescription>
                계정 보안 및 로그아웃 관련 설정입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">로그아웃</h3>
                  <p className="text-sm text-gray-600">
                    현재 계정에서 로그아웃합니다.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  로그아웃
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div>
                  <h3 className="font-medium">계정 설정</h3>
                  <p className="text-sm text-gray-600">
                    비밀번호 변경, 이메일 변경 등의 계정 보안 설정은 Supabase
                    대시보드에서 관리됩니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </Container>
  );
}

function LoginPrompt() {
  return (
    <Container className="flex flex-col justify-center items-center min-h-[60vh] text-center">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600">프로필을 보려면 먼저 로그인해주세요.</p>
        </div>
        <Button
          onClick={() => (window.location.href = '/sign-in')}
          className="bg-[#ff4800] hover:bg-[#e63e00]"
        >
          로그인하기
        </Button>
      </div>
    </Container>
  );
}

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4800]"></div>
      </Container>
    );
  }

  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <GoalWrapper>
      <ProfileContent />
    </GoalWrapper>
  );
}
