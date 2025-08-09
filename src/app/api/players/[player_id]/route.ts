import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/players/[player_id] - 특정 선수 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ player_id: string }> }
) {
  try {
    const { player_id } = await params;
    const playerId = parseInt(player_id);

    if (isNaN(playerId)) {
      return NextResponse.json({ error: 'Invalid player ID' }, { status: 400 });
    }

    const player = await prisma.player.findUnique({
      where: {
        player_id: playerId,
      },
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    );
  }
}
