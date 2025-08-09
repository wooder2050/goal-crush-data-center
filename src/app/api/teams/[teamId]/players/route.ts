import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/teams/[teamId]/players?scope=current|all&order=stats|default - 팀의 선수들 조회
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
    const order = (url.searchParams.get('order') ?? 'default') as
      | 'default'
      | 'stats';

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
      },
      orderBy:
        order === 'default'
          ? [{ jersey_number: 'asc' }, { name: 'asc' }]
          : undefined,
    });

    if (order === 'stats' && players.length > 0) {
      // 팀 기준 출전/골/도움 집계 후 서버에서 정렬
      const stats = await prisma.playerMatchStats.groupBy({
        by: ['player_id'],
        where: { team_id: teamId },
        _count: { match_id: true },
        _sum: { goals: true, assists: true },
      });
      const statsMap = new Map<
        number,
        { apps: number; goals: number; assists: number }
      >();
      for (let i = 0; i < stats.length; i++) {
        const s = stats[i];
        statsMap.set(s.player_id ?? 0, {
          apps: s._count?.match_id ?? 0,
          goals: s._sum?.goals ?? 0,
          assists: s._sum?.assists ?? 0,
        });
      }
      players.sort((a, b) => {
        const sa = statsMap.get(a.player_id) ?? {
          apps: 0,
          goals: 0,
          assists: 0,
        };
        const sb = statsMap.get(b.player_id) ?? {
          apps: 0,
          goals: 0,
          assists: 0,
        };
        if (sb.apps !== sa.apps) return sb.apps - sa.apps;
        if (sb.goals !== sa.goals) return sb.goals - sa.goals;
        return sb.assists - sa.assists;
      });
    }

    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching team players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team players' },
      { status: 500 }
    );
  }
}
