import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/stats/player-season - 선수 시즌 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('season_id');
    const playerId = searchParams.get('player_id');
    const limit = searchParams.get('limit');

    const stats = await prisma.playerSeasonStats.findMany({
      where: {
        ...(seasonId &&
          !isNaN(parseInt(seasonId)) && {
            season_id: parseInt(seasonId),
          }),
        ...(playerId &&
          !isNaN(parseInt(playerId)) && {
            player_id: parseInt(playerId),
          }),
      },
      orderBy: seasonId ? { goals: 'desc' } : { season_id: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching player season stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player season stats' },
      { status: 500 }
    );
  }
}
