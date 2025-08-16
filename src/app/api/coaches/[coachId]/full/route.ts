import { NextRequest, NextResponse } from 'next/server';

import {
  getCoachSeasonStatsCached,
  getCoachTrophiesCached,
} from '@/features/coaches/api-prisma';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const { coachId } = await params;
    const coachIdNum = Number(coachId);
    if (Number.isNaN(coachIdNum)) {
      return NextResponse.json({ error: 'Invalid coach ID' }, { status: 400 });
    }

    // Coach detail
    const coach = await prisma.coach.findUnique({
      where: { coach_id: coachIdNum },
      include: {
        team_coach_history: {
          include: { team: true, season: true },
          orderBy: [{ start_date: 'desc' }],
        },
        match_coaches: {
          include: {
            match: { include: { home_team: true, away_team: true } },
            team: true,
          },
          orderBy: [{ match: { match_date: 'asc' } }],
        },
      },
    });
    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    // Overview (season stats + trophies)
    const season_stats = await getCoachSeasonStatsCached(prisma, coachIdNum);
    const total_matches = season_stats.reduce(
      (acc, s) => acc + (s.matches_played ?? 0),
      0
    );
    const trophies = await getCoachTrophiesCached(prisma, coachIdNum);

    // Current team (verified) via Prisma introspected table
    const current_team_verified =
      await prisma.team_current_head_coach.findFirst({
        where: { coach_id: coachIdNum },
      });

    // 이미 응답 구조로 정제된 season_stats 사용
    const responseStats = season_stats;

    return NextResponse.json({
      coach,
      overview: {
        coach_id: coachIdNum,
        season_stats: responseStats,
        total_matches,
        trophies,
      },
      current_team_verified,
    });
  } catch (error) {
    console.error('Failed to fetch full coach data', error);
    return NextResponse.json(
      { error: 'Failed to fetch full coach data' },
      { status: 500 }
    );
  }
}
