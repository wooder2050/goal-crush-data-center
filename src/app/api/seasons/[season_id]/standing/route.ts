import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/seasons/[season_id]/standing - 특정 시즌의 순위표 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: { season_id?: string } }
) {
  try {
    const idParam = params?.season_id;
    const seasonIdNum = idParam ? parseInt(idParam, 10) : NaN;

    if (!idParam || Number.isNaN(seasonIdNum)) {
      return NextResponse.json({ error: 'Invalid season ID' }, { status: 400 });
    }

    const standings = await prisma.standing.findMany({
      where: { season_id: seasonIdNum },
      select: {
        standing_id: true,
        season_id: true,
        team_id: true,
        position: true,
        matches_played: true,
        wins: true,
        draws: true,
        losses: true,
        goals_for: true,
        goals_against: true,
        goal_difference: true,
        points: true,
        form: true,
        created_at: true,
        updated_at: true,
        team: {
          select: {
            team_id: true,
            team_name: true,
            logo: true,
          },
        },
      },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json(standings);
  } catch (error) {
    console.error('Error fetching standings by season:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch standings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
