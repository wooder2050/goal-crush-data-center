import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    if (!idsParam) return NextResponse.json({}, { status: 200 });
    const ids = idsParam
      .split(',')
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n));

    if (ids.length === 0) return NextResponse.json({}, { status: 200 });

    // aggregate from player_match_stats as a fallback for totals
    const matchStats = await prisma.playerMatchStats.groupBy({
      by: ['player_id'],
      where: { player_id: { in: ids } },
      _count: { match_id: true },
      _sum: { goals: true, assists: true },
    });
    const totalsMap = new Map<
      number,
      { appearances: number; goals: number; assists: number }
    >();
    for (let i = 0; i < matchStats.length; i++) {
      const row = matchStats[i];
      const pid = row.player_id ?? 0;
      totalsMap.set(pid, {
        appearances: row._count?.match_id ?? 0,
        goals: row._sum?.goals ?? 0,
        assists: row._sum?.assists ?? 0,
      });
    }

    // seasons from player_season_stats (fallback with match stats per season if needed)
    const pss = await prisma.playerSeasonStats.findMany({
      where: { player_id: { in: ids } },
      select: {
        player_id: true,
        season: { select: { season_name: true, year: true } },
      },
    });
    const seasonsMap = new Map<
      number,
      Array<{ season_name: string | null; year: number | null }>
    >();
    for (let i = 0; i < pss.length; i++) {
      const r = pss[i];
      const pid = r.player_id ?? 0;
      const list = seasonsMap.get(pid) ?? [];
      list.push({
        season_name: r.season?.season_name ?? null,
        year: r.season?.year ?? null,
      });
      seasonsMap.set(pid, list);
    }

    const result: Record<
      number,
      {
        seasons: Array<{ season_name: string | null; year: number | null }>;
        totals: { appearances: number; goals: number; assists: number };
      }
    > = {};
    for (const pid of ids) {
      result[pid] = {
        seasons: seasonsMap.get(pid) ?? [],
        totals: totalsMap.get(pid) ?? { appearances: 0, goals: 0, assists: 0 },
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching players summaries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players summaries' },
      { status: 500 }
    );
  }
}
