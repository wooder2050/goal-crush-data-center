import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

// 팀 수정 스키마
const updateTeamSchema = z.object({
  team_name: z.string().min(1, '팀명을 입력해주세요').max(100).optional(),
  founded_year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
  description: z.string().max(500).optional(),
  primary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  secondary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  logo: z.string().url().optional(),
});

// 관리자 권한 확인 함수
async function checkAdminAccess() {
  const cookieStore = cookies();
  const supabase = createServerClient(
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 사용자 프로필에서 관리자 권한 확인
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('user_id', user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null; // 권한 확인 통과
}

interface RouteParams {
  params: {
    team_id: string;
  };
}

// PUT - 팀 수정
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // 관리자 권한 확인
    const authError = await checkAdminAccess();
    if (authError) return authError;

    const teamId = parseInt(params.team_id);
    if (isNaN(teamId)) {
      return NextResponse.json(
        { error: '올바르지 않은 팀 ID입니다.' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // 입력값 유효성 검사
    const validatedData = updateTeamSchema.parse(body);

    // 팀 존재 확인
    const existingTeam = await prisma.team.findUnique({
      where: { team_id: teamId },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { error: '해당 팀을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 팀명이 변경되는 경우 중복 확인
    if (
      validatedData.team_name &&
      validatedData.team_name !== existingTeam.team_name
    ) {
      const duplicateTeam = await prisma.team.findUnique({
        where: { team_name: validatedData.team_name },
      });

      if (duplicateTeam) {
        return NextResponse.json(
          { error: '이미 존재하는 팀명입니다.' },
          { status: 400 }
        );
      }
    }

    // 팀 정보 수정
    const updatedTeam = await prisma.team.update({
      where: { team_id: teamId },
      data: {
        ...validatedData,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error('팀 수정 중 오류:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력값이 올바르지 않습니다.', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '팀 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE - 팀 삭제
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    // 관리자 권한 확인
    const authError = await checkAdminAccess();
    if (authError) return authError;

    const teamId = parseInt(params.team_id);
    if (isNaN(teamId)) {
      return NextResponse.json(
        { error: '올바르지 않은 팀 ID입니다.' },
        { status: 400 }
      );
    }

    // 팀 존재 확인
    const existingTeam = await prisma.team.findUnique({
      where: { team_id: teamId },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { error: '해당 팀을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 연관된 데이터 확인 (경기, 선수 등)
    const relatedData = await prisma.$transaction([
      prisma.match.count({
        where: {
          OR: [{ home_team_id: teamId }, { away_team_id: teamId }],
        },
      }),
      prisma.playerTeamHistory.count({
        where: { team_id: teamId },
      }),
    ]);

    const [matchCount, playerHistoryCount] = relatedData;

    if (matchCount > 0 || playerHistoryCount > 0) {
      return NextResponse.json(
        {
          error: '연관된 경기나 선수 기록이 있어 삭제할 수 없습니다.',
          details: {
            matches: matchCount,
            playerHistory: playerHistoryCount,
          },
        },
        { status: 400 }
      );
    }

    // 팀 삭제
    await prisma.team.delete({
      where: { team_id: teamId },
    });

    return NextResponse.json({ message: '팀이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('팀 삭제 중 오류:', error);

    return NextResponse.json(
      { error: '팀 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
