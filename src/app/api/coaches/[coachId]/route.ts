import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const { coachId } = await params;
    const coachIdNum = parseInt(coachId);

    if (isNaN(coachIdNum)) {
      return NextResponse.json({ error: 'Invalid coach ID' }, { status: 400 });
    }

    const coach = await prisma.coach.findUnique({
      where: { coach_id: coachIdNum },
      include: {
        team_coach_history: {
          include: {
            team: true,
            season: true,
          },
          orderBy: {
            start_date: 'desc',
          },
        },
        match_coaches: {
          include: {
            match: {
              include: {
                home_team: true,
                away_team: true,
                season: true,
              },
            },
            team: true,
          },
          orderBy: {
            match: {
              match_date: 'desc',
            },
          },
          take: 20, // 최근 20경기만
        },
      },
    });

    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    // team_current_head_coach 기준 현재팀 검증 필드 추가
    const verified = await prisma.$queryRaw<
      Array<{
        team_id: number;
        team_name: string;
        logo: string | null;
        coach_id: number;
        last_match_date: Date;
      }>
    >`SELECT team_id, team_name, logo, coach_id, last_match_date FROM public.team_current_head_coach WHERE coach_id = ${coachIdNum} LIMIT 1`;
    const current_team_verified = verified[0] ?? null;
    const has_current_team = Boolean(current_team_verified);

    return NextResponse.json({
      ...coach,
      current_team_verified,
      has_current_team,
    });
  } catch (error) {
    console.error('Error fetching coach:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coach' },
      { status: 500 }
    );
  }
}
