import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/stats/team-season - 팀 시즌 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('season_id');
    const teamId = searchParams.get('team_id');

    let whereClause = {};

    if (seasonId) {
      const seasonIdNum = parseInt(seasonId);
      if (!isNaN(seasonIdNum)) {
        whereClause = { ...whereClause, season_id: seasonIdNum };
      }
    }

    if (teamId) {
      const teamIdNum = parseInt(teamId);
      if (!isNaN(teamIdNum)) {
        whereClause = { ...whereClause, team_id: teamIdNum };
      }
    }

    const stats = await prisma.teamSeasonStats.findMany({
      where: whereClause,
      orderBy: seasonId ? { points: 'desc' } : { season_id: 'desc' },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching team season stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team season stats' },
      { status: 500 }
    );
  }
}
