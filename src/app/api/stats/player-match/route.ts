import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/stats/player-match - 선수 경기 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('match_id');
    const playerId = searchParams.get('player_id');

    let whereClause = {};

    if (matchId) {
      const matchIdNum = parseInt(matchId);
      if (!isNaN(matchIdNum)) {
        whereClause = { ...whereClause, match_id: matchIdNum };
      }
    }

    if (playerId) {
      const playerIdNum = parseInt(playerId);
      if (!isNaN(playerIdNum)) {
        whereClause = { ...whereClause, player_id: playerIdNum };
      }
    }

    const stats = await prisma.playerMatchStats.findMany({
      where: whereClause,
      orderBy: matchId ? { player_id: 'asc' } : { match_id: 'desc' },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching player match stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player match stats' },
      { status: 500 }
    );
  }
}
