import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { prisma } from './prisma';
import { Database } from './types/database';

// Supabase 서버 클라이언트 생성 (Vercel 배포 안정성을 위한 직접 구현)
function createClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서 호출된 경우 무시
          }
        },
      },
    }
  );
}

/**
 * 현재 사용자가 관리자인지 확인 (서버 컴포넌트용)
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return false;
    }

    // 개발 환경에서는 모든 로그인 사용자를 관리자로 처리
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    // 데이터베이스에서 사용자의 is_admin 필드 확인
    const dbUser = await prisma.user.findUnique({
      where: { user_id: user.id },
      select: { is_admin: true },
    });

    return dbUser?.is_admin ?? false;
  } catch (error) {
    console.error('관리자 권한 확인 오류:', error);
    return false;
  }
}

/**
 * API 라우트에서 관리자 권한 확인
 */
export async function requireAdminAuth() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('인증이 필요합니다');
  }

  // 개발 환경에서는 모든 로그인 사용자를 관리자로 처리
  if (process.env.NODE_ENV === 'development') {
    return user;
  }

  // 데이터베이스에서 사용자의 is_admin 필드 확인
  const dbUser = await prisma.user.findUnique({
    where: { user_id: user.id },
    select: {
      user_id: true,
      korean_nickname: true,
      is_admin: true,
    },
  });

  if (!dbUser?.is_admin) {
    throw new Error('관리자 권한이 필요합니다');
  }

  // Supabase User 객체를 반환
  return user;
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
