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
    // Get all player match stats to filter by minutes_played > 0
    const allPlayerStats = await prisma.playerMatchStats.findMany({
      where: { player_id: { in: ids } },
      select: {
        player_id: true,
        match_id: true,
        goals: true,
        assists: true,
        minutes_played: true,
      },
    });

    // Group by player_id and count only appearances where minutes_played > 0
    const totalsMap = new Map<
      number,
      { appearances: number; goals: number; assists: number }
    >();

    for (const stat of allPlayerStats) {
      const pid = stat.player_id ?? 0;
      const playedMinutes = (stat.minutes_played ?? 0) as number;
      const goals = (stat.goals ?? 0) as number;
      const assists = (stat.assists ?? 0) as number;

      if (!totalsMap.has(pid)) {
        totalsMap.set(pid, { appearances: 0, goals: 0, assists: 0 });
      }

      const playerTotal = totalsMap.get(pid)!;
      // Count appearance only if minutes_played > 0
      if (playedMinutes > 0) {
        playerTotal.appearances += 1;
      }
      playerTotal.goals += goals;
      playerTotal.assists += assists;
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
