import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/players/[id]/team - 선수의 현재 팀 정보 조회
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

    const playerWithTeam = await prisma.player.findUnique({
      where: {
        player_id: playerId,
      },
      include: {
        player_team_history: {
          where: {
            end_date: null,
          },
          include: {
            team: true,
          },
          take: 1,
        },
      },
    });

    if (!playerWithTeam) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // 현재 팀 정보만 반환
    const currentTeam = playerWithTeam.player_team_history[0]?.team;

    if (!currentTeam) {
      return NextResponse.json(
        { error: 'No current team found for player' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...playerWithTeam,
      team: currentTeam,
    });
  } catch (error) {
    console.error('Error fetching player with team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player with team' },
      { status: 500 }
    );
  }
}
