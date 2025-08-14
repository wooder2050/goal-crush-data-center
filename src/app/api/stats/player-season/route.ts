import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import type { PlayerSeasonStatsWithDetails } from '@/lib/types';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET /api/stats/player-season - 선수 시즌 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('season_id');
    const playerId = searchParams.get('player_id');
    const limit = searchParams.get('limit');
    const sort = (searchParams.get('sort') || 'goals') as
      | 'goals'
      | 'appearances';

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
      include: {
        player: { select: { name: true } },
        team: { select: { team_name: true, logo: true } },
      },
      orderBy: seasonId
        ? sort === 'appearances'
          ? { matches_played: 'desc' }
          : { goals: 'desc' }
        : { season_id: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });

    // 평탄화하여 클라이언트에서 바로 사용할 수 있도록 이름 필드 포함
    const flattened = (stats as PlayerSeasonStatsWithDetails[]).map((s) => ({
      ...s,
      player_name: s.player?.name ?? null,
      team_name: s.team?.team_name ?? null,
      team_logo: s.team?.logo ?? null,
    }));

    return NextResponse.json(flattened);
  } catch (error) {
    console.error('Error fetching player season stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player season stats' },
      { status: 500 }
    );
  }
}
