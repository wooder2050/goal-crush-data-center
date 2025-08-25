'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AuthModal } from './AuthModal';
import { useAuth } from './AuthProvider';

export function AuthButtons() {
  const { user, loading, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
        >
          로그인
        </button>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode="signin"
        />
      </>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
      >
        프로필
      </Link>
      <button
        onClick={async () => {
          try {
            setIsSigningOut(true);
            await signOut();
          } catch (error) {
            console.error('로그아웃 실패:', error);
            setIsSigningOut(false);
          }
        }}
        disabled={isSigningOut}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 rounded-md hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSigningOut ? '로그아웃 중...' : '로그아웃'}
      </button>
    </div>
  );
}
