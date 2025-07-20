import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/teams/[id]/players - 팀의 선수들 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamId = parseInt(id);

    if (isNaN(teamId)) {
      return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 });
    }

    const players = await prisma.player.findMany({
      where: {
        player_team_history: {
          some: {
            team_id: teamId,
            end_date: null,
          },
        },
      },
      include: {
        player_team_history: {
          where: {
            team_id: teamId,
            end_date: null,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching team players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team players' },
      { status: 500 }
    );
  }
}
