import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/teams/[teamId]/players?scope=current|all - 팀의 선수들 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId: raw } = await params;
    const teamId = parseInt(raw);

    if (isNaN(teamId)) {
      return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 });
    }

    const url = new URL(request.url);
    const scope = (url.searchParams.get('scope') ?? 'all') as 'current' | 'all';

    // players 테이블 기준 where 절
    const whereClause =
      scope === 'current'
        ? {
            player_team_history: {
              some: {
                team_id: teamId,
                end_date: null,
              },
            },
          }
        : {
            player_team_history: {
              some: {
                team_id: teamId,
              },
            },
          };

    const players = await prisma.player.findMany({
      where: whereClause,
      select: {
        player_id: true,
        name: true,
        jersey_number: true,
        // 필요시 추가 필드
        // position: true,
        // date_of_birth: true,
      },
      orderBy: [{ jersey_number: 'asc' }, { name: 'asc' }],
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
