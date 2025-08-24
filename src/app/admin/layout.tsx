'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 실제 환경에서는 적절한 인증 로직으로 대체해야 합니다
  useEffect(() => {
    // 간단한 인증 체크 (실제로는 서버 측 인증이 필요)
    const checkAuth = () => {
      // 개발 환경에서는 항상 접근 허용
      if (process.env.NODE_ENV === 'development') {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // 실제 환경에서는 여기에 인증 로직 구현
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      setIsAuthorized(isAdmin);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="space-y-8">
          {/* 헤더 스켈레톤 */}
          <div className="bg-gray-100 border-b py-2">
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
              <div className="text-gray-400">/</div>
              <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
            </div>
          </div>

          {/* 콘텐츠 스켈레톤 */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
            </div>

            {/* 카드 스켈레톤 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4 shadow-sm">
                  <div className="space-y-4">
                    <div className="animate-pulse bg-gray-200 h-6 w-3/4 rounded"></div>
                    <div className="flex justify-between">
                      <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                      <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
                      <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!isAuthorized) {
    return (
      <Container className="py-8">
        <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-500"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <h2 className="text-2xl font-bold">접근 권한이 없습니다</h2>
            <p className="text-gray-600 max-w-md">
              이 페이지는 관리자 권한이 필요합니다. 권한이 필요하신 경우
              관리자에게 문의하세요.
            </p>
          </div>
          <Button onClick={() => router.push('/')} size="lg" className="px-6">
            홈으로 돌아가기
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div>
      <div className="border-b">
        <Container className="py-2">
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-gray-600 hover:text-black">
              홈
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/admin/matches"
              className="text-gray-600 hover:text-black"
            >
              관리자
            </Link>
          </div>
        </Container>
      </div>

      {/* Admin 네비게이션 메뉴 */}
      <div className="bg-white border-b shadow-sm">
        <Container className="py-4">
          <nav className="flex space-x-6">
            <Link
              href="/admin/matches"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              경기 관리
            </Link>
            <Link
              href="/admin/seasons"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              시즌 관리
            </Link>
            <Link
              href="/admin/players"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              선수 관리
            </Link>
          </nav>
        </Container>
      </div>
      {children}
    </div>
  );
}
