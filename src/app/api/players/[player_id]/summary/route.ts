import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  context: { params: { player_id: string } }
) {
  try {
    const playerId = Number(context.params.player_id);
    if (!playerId || Number.isNaN(playerId)) {
      return NextResponse.json({ error: 'Invalid player id' }, { status: 400 });
    }

    // Prefer season totals from player_season_stats
    const seasonStats = await prisma.playerSeasonStats.findMany({
      where: { player_id: playerId },
      select: {
        season_id: true,
        goals: true,
        assists: true,
        matches_played: true,
        season: { select: { season_id: true, season_name: true, year: true } },
        team: { select: { team_id: true, team_name: true } },
      },
      orderBy: [{ season_id: 'asc' }],
    });

    // Backfill map from player_match_stats if needed
    const pmsRows = await prisma.playerMatchStats.findMany({
      where: { player_id: playerId },
      select: {
        goals: true,
        assists: true,
        match_id: true,
        team_id: true,
        match: { select: { season_id: true } },
        position: true,
      },
    });

    type SeasonAgg = {
      goals: number;
      assists: number;
      appearances: number;
      teamCounts: Map<number, number>;
    };

    const pmsAggBySeason = new Map<number, SeasonAgg>();
    for (let i = 0; i < pmsRows.length; i++) {
      const r = pmsRows[i];
      const seasonId = r.match?.season_id ?? undefined;
      if (!seasonId) continue;
      if (!pmsAggBySeason.has(seasonId)) {
        pmsAggBySeason.set(seasonId, {
          goals: 0,
          assists: 0,
          appearances: 0,
          teamCounts: new Map<number, number>(),
        });
      }
      const agg = pmsAggBySeason.get(seasonId)!;
      agg.goals += (r.goals ?? 0) as number;
      agg.assists += (r.assists ?? 0) as number;
      // count appearance per row (unique per player+match enforced)
      agg.appearances += 1;
      const teamId = r.team_id as number | null;
      if (teamId) {
        agg.teamCounts.set(teamId, (agg.teamCounts.get(teamId) ?? 0) + 1);
      }
    }

    // Build a map from season_id to DB seasonStat row for easy merge
    const dbSeasonMap = new Map<number, (typeof seasonStats)[number]>();
    for (let i = 0; i < seasonStats.length; i++) {
      const s = seasonStats[i];
      if (s.season_id) dbSeasonMap.set(s.season_id, s);
    }

    // Merge: prefer DB season stat, but if missing season exists in PMS, synthesize
    const seasonIds = new Set<number>();
    dbSeasonMap.forEach((_v, k) => seasonIds.add(k));
    pmsAggBySeason.forEach((_v, k) => seasonIds.add(k));

    // Fetch season meta for all involved season ids
    const seasonIdList = Array.from(seasonIds);
    const seasonsMeta = seasonIdList.length
      ? await prisma.season.findMany({
          where: { season_id: { in: seasonIdList } },
          select: { season_id: true, season_name: true, year: true },
        })
      : [];
    const seasonMetaMap = new Map<number, (typeof seasonsMeta)[number]>();
    for (let i = 0; i < seasonsMeta.length; i++) {
      seasonMetaMap.set(seasonsMeta[i].season_id, seasonsMeta[i]);
    }

    const seasons = Array.from(seasonIds)
      .sort((a, b) => a - b)
      .map((sid) => {
        const db = dbSeasonMap.get(sid);
        const agg = pmsAggBySeason.get(sid);

        // Choose team by max appearances in PMS if DB not available
        let team_id: number | null = db?.team?.team_id ?? null;
        const team_name: string | null = db?.team?.team_name ?? null;
        if (!team_id && agg && agg.teamCounts.size > 0) {
          let bestTeamId: number | null = null;
          let bestCount = -1;
          agg.teamCounts.forEach((count, tId) => {
            if (count > bestCount) {
              bestCount = count;
              bestTeamId = tId;
            }
          });
          team_id = bestTeamId;
        }

        return {
          season_id: sid,
          season_name:
            seasonMetaMap.get(sid)?.season_name ??
            db?.season?.season_name ??
            null,
          year: seasonMetaMap.get(sid)?.year ?? db?.season?.year ?? null,
          team_id,
          team_name,
          goals: (db?.goals ?? agg?.goals ?? 0) as number,
          assists: (db?.assists ?? agg?.assists ?? 0) as number,
          appearances: (db?.matches_played ?? agg?.appearances ?? 0) as number,
          positions: [] as string[], // filled below
        };
      });

    // Primary position from PlayerMatchStats frequency, fallback to player_positions latest
    const matchPositions = pmsRows
      .filter((r) => r.position)
      .map((r) => r.position as string);

    let primaryPosition: string | null = null;
    if (matchPositions.length > 0) {
      const freq = new Map<string, number>();
      for (let i = 0; i < matchPositions.length; i++) {
        const pos = matchPositions[i];
        freq.set(pos, (freq.get(pos) ?? 0) + 1);
      }
      let maxCount = -1;
      freq.forEach((count, pos) => {
        if (count > maxCount) {
          maxCount = count;
          primaryPosition = pos;
        }
      });
    } else {
      const posPeriods = await prisma.player_positions.findMany({
        where: { player_id: playerId },
        orderBy: [{ end_date: 'desc' }, { start_date: 'desc' }],
        take: 1,
      });
      primaryPosition = (posPeriods[0]?.position as string) ?? null;
    }

    // Positions by season
    const positionsBySeasonFromPeriods = await prisma.player_positions.findMany(
      {
        where: { player_id: playerId },
        select: { season_id: true, position: true },
      }
    );
    const positionsBySeasonMap = new Map<number, Set<string>>();
    for (let i = 0; i < positionsBySeasonFromPeriods.length; i++) {
      const p = positionsBySeasonFromPeriods[i];
      if (!p.season_id) continue;
      if (!positionsBySeasonMap.has(p.season_id))
        positionsBySeasonMap.set(p.season_id, new Set());
      positionsBySeasonMap.get(p.season_id)!.add(p.position as string);
    }
    if (positionsBySeasonMap.size === 0 && pmsRows.length > 0) {
      for (let i = 0; i < pmsRows.length; i++) {
        const row = pmsRows[i];
        const sid = row.match?.season_id ?? undefined;
        const pos = row.position ?? undefined;
        if (!sid || !pos) continue;
        if (!positionsBySeasonMap.has(sid))
          positionsBySeasonMap.set(sid, new Set());
        positionsBySeasonMap.get(sid)!.add(pos);
      }
    }

    for (let i = 0; i < seasons.length; i++) {
      const sid = seasons[i].season_id;
      if (sid && positionsBySeasonMap.has(sid)) {
        seasons[i].positions = Array.from(positionsBySeasonMap.get(sid)!);
      }
    }

    // Totals derived from final seasons list
    const totals = seasons.reduce(
      (acc, s) => {
        acc.goals += s.goals ?? 0;
        acc.assists += s.assists ?? 0;
        acc.appearances += s.appearances ?? 0;
        return acc;
      },
      { goals: 0, assists: 0, appearances: 0 }
    );

    return NextResponse.json({
      player_id: playerId,
      seasons,
      totals,
      primary_position: primaryPosition,
    });
  } catch (error) {
    console.error('Error fetching player summary:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch player summary',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
