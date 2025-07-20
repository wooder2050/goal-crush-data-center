import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/teams - 모든 팀 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('season_id');

    let whereClause = {};

    if (seasonId) {
      const seasonIdNum = parseInt(seasonId);
      if (!isNaN(seasonIdNum)) {
        whereClause = {
          team_seasons: {
            some: {
              season_id: seasonIdNum,
            },
          },
        };
      }
    }

    const teams = await prisma.team.findMany({
      where: whereClause,
      orderBy: {
        team_name: 'asc',
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}
