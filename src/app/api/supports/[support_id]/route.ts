import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { Database } from '@/lib/types/database';

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

// DELETE /api/supports/[support_id] - 특정 응원 메시지 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { support_id: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const supportId = parseInt(params.support_id);
    if (isNaN(supportId)) {
      return NextResponse.json(
        { error: 'Invalid support ID' },
        { status: 400 }
      );
    }

    // 먼저 해당 응원이 존재하고 현재 사용자의 것인지 확인
    const existingSupport = await prisma.matchSupport.findUnique({
      where: { support_id: supportId },
      include: {
        match: true,
      },
    });

    if (!existingSupport) {
      return NextResponse.json({ error: 'Support not found' }, { status: 404 });
    }

    // 본인이 작성한 응원인지 확인
    if (existingSupport.user_id !== userId) {
      return NextResponse.json(
        { error: 'You can only delete your own support' },
        { status: 403 }
      );
    }

    // 경기가 이미 시작되었는지 확인
    const now = new Date();
    if (
      existingSupport.match.match_date < now &&
      existingSupport.match.status !== 'scheduled'
    ) {
      return NextResponse.json(
        { error: 'Cannot delete support after match has started' },
        { status: 400 }
      );
    }

    // 응원 삭제
    await prisma.matchSupport.delete({
      where: { support_id: supportId },
    });

    return NextResponse.json({ message: 'Support deleted successfully' });
  } catch (error) {
    console.error('Error deleting support:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
