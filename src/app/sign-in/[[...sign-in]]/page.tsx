'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Container } from '@/components/ui/container';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/admin/matches';
  const [clerkError, setClerkError] = useState<string | null>(null);
  const [isClerkReady, setIsClerkReady] = useState(false);

  useEffect(() => {
    // Clerk 초기화 상태 확인
    const checkClerkStatus = async () => {
      try {
        // window.Clerk가 로드되었는지 확인
        const windowWithClerk = window as typeof window & {
          Clerk?: {
            load: () => Promise<void>;
          };
        };

        if (typeof window !== 'undefined' && windowWithClerk.Clerk) {
          await windowWithClerk.Clerk.load();
          setIsClerkReady(true);
        } else {
          // Clerk 스크립트 로드를 기다림
          const maxWait = 10000; // 10초
          const startTime = Date.now();

          const waitForClerk = () => {
            if (windowWithClerk.Clerk) {
              windowWithClerk.Clerk.load()
                .then(() => setIsClerkReady(true))
                .catch((err: Error) =>
                  setClerkError(`Clerk 초기화 실패: ${err.message}`)
                );
            } else if (Date.now() - startTime < maxWait) {
              setTimeout(waitForClerk, 100);
            } else {
              setClerkError(
                'Clerk 로드 시간 초과. 키가 유효하지 않을 수 있습니다.'
              );
            }
          };

          waitForClerk();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        setClerkError(`Clerk 오류: ${errorMessage}`);
      }
    };

    checkClerkStatus();
  }, []);

  if (clerkError) {
    return (
      <Container className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-800 mb-3">
            🚨 로그인 서비스 오류
          </h2>
          <p className="text-red-700 mb-4">{clerkError}</p>
          <div className="text-sm text-red-600 bg-red-100 p-3 rounded">
            <strong>해결 방법:</strong>
            <ul className="list-disc list-inside mt-2 text-left">
              <li>Clerk Dashboard에서 새로운 API 키 확인</li>
              <li>환경 변수 업데이트</li>
              <li>마이그레이션 후 키 유효성 확인</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </Container>
    );
  }

  if (!isClerkReady) {
    return (
      <Container className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4800] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            로그인 서비스 초기화 중...
          </h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex justify-center items-center min-h-[60vh]">
      <SignIn
        routing="path"
        path="/sign-in"
        redirectUrl={redirectUrl}
        signUpUrl="/sign-up"
      />
    </Container>
  );
}
