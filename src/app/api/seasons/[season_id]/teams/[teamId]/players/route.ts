import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { season_id: string; teamId: string } }
) {
  try {
    const seasonId = parseInt(params.season_id);
    const teamId = parseInt(params.teamId);

    if (isNaN(seasonId) || isNaN(teamId)) {
      return NextResponse.json(
        { error: 'Invalid season ID or team ID' },
        { status: 400 }
      );
    }

    const players = await prisma.playerMatchStats.findMany({
      where: {
        match: {
          season_id: seasonId,
        },
        team_id: teamId,
      },
      select: {
        player: {
          select: {
            player_id: true,
            name: true,
            jersey_number: true,
          },
        },
        position: true,
      },
    });

    const uniquePlayersMap = new Map();

    players.forEach((p) => {
      if (p.player?.player_id && !uniquePlayersMap.has(p.player.player_id)) {
        uniquePlayersMap.set(p.player.player_id, {
          player_id: p.player.player_id,
          player_name: p.player.name || 'Unknown',
          jersey_number: p.player.jersey_number,
          position: p.position || 'Unknown',
        });
      }
    });

    const uniquePlayers = Array.from(uniquePlayersMap.values());

    return NextResponse.json(uniquePlayers);
  } catch (error) {
    console.error('Failed to fetch season players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch season players' },
      { status: 500 }
    );
  }
}
