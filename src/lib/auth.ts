import { auth, currentUser } from '@clerk/nextjs/server';

import { prisma } from './prisma';

/**
 * 현재 사용자가 관리자인지 확인 (서버 컴포넌트용)
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return false;
    }

    // 개발 환경에서는 모든 로그인 사용자를 관리자로 처리
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    // 데이터베이스에서 사용자의 is_admin 필드 확인
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { is_admin: true },
    });

    return user?.is_admin ?? false;
  } catch (error) {
    console.error('관리자 권한 확인 오류:', error);
    return false;
  }
}

/**
 * API 라우트에서 관리자 권한 확인
 */
export async function requireAdminAuth() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('인증이 필요합니다');
  }

  // 개발 환경에서는 모든 로그인 사용자를 관리자로 처리
  if (process.env.NODE_ENV === 'development') {
    const user = await currentUser();
    return user;
  }

  // 데이터베이스에서 사용자의 is_admin 필드 확인
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      korean_nickname: true,
      is_admin: true,
    },
  });

  if (!user?.is_admin) {
    throw new Error('관리자 권한이 필요합니다');
  }

  // Clerk User 객체를 반환하기 위해 currentUser 호출
  const clerkUser = await currentUser();
  return clerkUser;
}

/**
 * API 라우트에서 사용할 관리자 권한 확인 미들웨어
 */
export function withAdminAuth<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    try {
      await requireAdminAuth();
      return handler(...args);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '권한이 없습니다';
      return new Response(JSON.stringify({ error: message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}
