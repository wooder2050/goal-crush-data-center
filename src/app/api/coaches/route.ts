import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const coaches = await prisma.coach.findMany({
      where,
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
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.coach.count({ where });

    // 현재팀 검증: team_current_head_coach 뷰 기준으로 매칭
    let verifiedRows: Array<{
      team_id: number;
      team_name: string;
      logo: string | null;
      coach_id: number;
      last_match_date: Date;
    }> = [];
    const coachIds = coaches.map((c) => c.coach_id);
    if (coachIds.length > 0) {
      verifiedRows = await prisma.$queryRaw<
        Array<{
          team_id: number;
          team_name: string;
          logo: string | null;
          coach_id: number;
          last_match_date: Date;
        }>
      >`SELECT team_id, team_name, logo, coach_id, last_match_date
        FROM public.team_current_head_coach
        WHERE coach_id IN (${Prisma.join(coachIds)})`;
    }
    const coachIdToVerified = new Map<
      number,
      {
        team_id: number;
        team_name: string;
        logo: string | null;
        last_match_date: Date;
      }
    >();
    for (const row of verifiedRows) coachIdToVerified.set(row.coach_id, row);

    // 코치별 총 경기 수 집계 (match_coaches 기준)
    const matchCounts = await prisma.matchCoach.groupBy({
      by: ['coach_id'],
      where: { role: 'head' },
      _count: { _all: true },
    });
    const coachIdToMatchCount = new Map<number, number>(
      matchCounts.map((row) => [row.coach_id, row._count._all])
    );

    const enriched = coaches
      .map((c) => ({
        ...c,
        current_team_verified: coachIdToVerified.get(c.coach_id) ?? null,
        has_current_team: coachIdToVerified.has(c.coach_id),
        total_matches: coachIdToMatchCount.get(c.coach_id) ?? 0,
      }))
      .sort((a, b) => (b.total_matches ?? 0) - (a.total_matches ?? 0));

    return NextResponse.json({
      coaches: enriched,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coaches' },
      { status: 500 }
    );
  }
}
