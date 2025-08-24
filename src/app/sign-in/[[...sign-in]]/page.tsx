'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

import { Container } from '@/components/ui/container';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/admin/matches';

  return (
    <Container className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-md">
        {redirectUrl === '/supports' && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <span className="text-lg">⚽</span>
              <p className="text-sm font-medium">
                응원하기 페이지에 접근하려면 로그인이 필요합니다
              </p>
            </div>
          </div>
        )}
        <SignIn
          routing="path"
          path="/sign-in"
          redirectUrl={redirectUrl}
          signUpUrl="/sign-up"
        />
      </div>
    </Container>
  );
}
