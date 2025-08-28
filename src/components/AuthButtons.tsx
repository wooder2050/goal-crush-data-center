'use client';

import { LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { AuthModal } from './AuthModal';
import { useAuth } from './AuthProvider';

export function AuthButtons() {
  const { user, loading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      setIsSigningOut(false);
    }
  };

  const handleAuthModalOpen = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="px-3 py-1.5 text-sm font-medium text-gray-500">
        로딩중...
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {/* 데스크톱 로그인 버튼 */}
        <div className="hidden md:block">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          >
            로그인
          </button>
        </div>

        {/* 모바일 프로필 버튼 */}
        <div className="md:hidden">
          <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <User className="h-5 w-5" />
                <span className="sr-only">계정 메뉴 열기</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[280px] sm:w-[350px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-900 mb-4">
                  계정
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleAuthModalOpen}
                  className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-3 rounded-md transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  로그인
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode="signin"
        />
      </>
    );
  }

  return (
    <>
      {/* 데스크톱 프로필 및 로그아웃 버튼 */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/profile"
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
        >
          프로필
        </Link>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 rounded-md hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningOut ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>

      {/* 모바일 프로필 버튼 */}
      <div className="md:hidden">
        <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <User className="h-5 w-5" />
              <span className="sr-only">계정 메뉴 열기</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[280px] sm:w-[350px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-900 mb-4">
                계정
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-2">
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-3 rounded-md transition-colors"
              >
                <User className="h-5 w-5" />
                프로필
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="h-5 w-5" />
                {isSigningOut ? '로그아웃 중...' : '로그아웃'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
