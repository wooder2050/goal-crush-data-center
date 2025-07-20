import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/stats/standings - 순위표 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('season_id');

    if (!seasonId) {
      return NextResponse.json(
        { error: 'Season ID is required' },
        { status: 400 }
      );
    }

    const seasonIdNum = parseInt(seasonId);
    if (isNaN(seasonIdNum)) {
      return NextResponse.json({ error: 'Invalid season ID' }, { status: 400 });
    }

    const standings = await prisma.standing.findMany({
      where: {
        season_id: seasonIdNum,
      },
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
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    return NextResponse.json(standings);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch standings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
