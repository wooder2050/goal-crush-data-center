'use server';

import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

function inferLeague(
  seasonName: string | null
): 'super' | 'challenge' | 'playoff' | 'cup' | 'other' {
  if (!seasonName) return 'other';
  const name = seasonName.toLowerCase();
  if (name.includes('super') || name.includes('슈퍼')) return 'super';
  if (name.includes('challenge') || name.includes('챌린지')) return 'challenge';
  if (name.includes('playoff') || name.includes('플레이오프')) return 'playoff';
  if (name.includes('sbs') || name.includes('cup') || name.includes('컵'))
    return 'cup';
  return 'other';
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId: raw } = await params;
    const teamId = Number(raw);
    if (!teamId || Number.isNaN(teamId)) {
      return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 });
    }

    // Player appearances and goals for this team (aggregate all seasons)
    const pmsGrouped = await prisma.playerMatchStats.groupBy({
      by: ['player_id'],
      where: { team_id: teamId },
      _count: { match_id: true },
      _sum: { goals: true },
    });

    // Build maps and find tops
    let topApps: { player_id: number; appearances: number } | null = null;
    let topGoals: { player_id: number; goals: number } | null = null;

    for (let i = 0; i < pmsGrouped.length; i++) {
      const g = pmsGrouped[i];
      const appearances = g._count?.match_id ?? 0;
      const goals = g._sum?.goals ?? 0;
      if (!topApps || appearances > topApps.appearances) {
        topApps = { player_id: g.player_id as number, appearances };
      }
      if (!topGoals || goals > topGoals.goals) {
        topGoals = { player_id: g.player_id as number, goals };
      }
    }

    // Fetch names for tops
    const [topAppsPlayer, topGoalsPlayer] = await Promise.all([
      topApps?.player_id
        ? prisma.player.findUnique({
            where: { player_id: topApps.player_id },
            select: { player_id: true, name: true },
          })
        : Promise.resolve(null),
      topGoals?.player_id
        ? prisma.player.findUnique({
            where: { player_id: topGoals.player_id },
            select: { player_id: true, name: true },
          })
        : Promise.resolve(null),
    ]);

    // Championships and best position from standings
    const standings = await prisma.standing.findMany({
      where: { team_id: teamId },
      select: {
        position: true,
        season: { select: { season_id: true, season_name: true, year: true } },
      },
      orderBy: [{ season_id: 'asc' }],
    });

    const championships = standings
      .filter((s) => (s.position ?? 0) === 1)
      .filter((s) => {
        const league = inferLeague(s.season?.season_name ?? null);
        return league === 'super' || league === 'cup';
      })
      .map((s) => ({
        season_id: s.season?.season_id ?? 0,
        season_name: s.season?.season_name ?? null,
        year: s.season?.year ?? null,
      }));

    // League-filtered best positions
    let bestSuper: number | null = null;
    let bestChallenge: number | null = null;
    let bestCup: number | null = null;

    for (let i = 0; i < standings.length; i++) {
      const row = standings[i];
      const pos = row.position ?? null;
      if (pos === null) continue;
      const league = inferLeague(row.season?.season_name ?? null);
      if (league === 'super') {
        if (bestSuper === null || pos < bestSuper) bestSuper = pos;
      } else if (league === 'challenge') {
        if (bestChallenge === null || pos < bestChallenge) bestChallenge = pos;
      } else if (league === 'cup') {
        if (bestCup === null || pos < bestCup) bestCup = pos;
      }
    }

    // Overall best among allowed leagues (super, cup, challenge) with tie preference super > cup > challenge
    type LeagueCode = 'super' | 'cup' | 'challenge';
    const candidates: Array<{ league: LeagueCode; pos: number | null }> = [
      { league: 'super', pos: bestSuper },
      { league: 'cup', pos: bestCup },
      { league: 'challenge', pos: bestChallenge },
    ];
    let best_overall: { position: number | null; league: LeagueCode | null } = {
      position: null,
      league: null,
    };
    for (const c of candidates) {
      if (c.pos == null) continue;
      if (best_overall.position == null || c.pos < best_overall.position) {
        best_overall = { position: c.pos, league: c.league };
      }
    }

    return NextResponse.json({
      top_appearances: topAppsPlayer
        ? {
            player_id: topAppsPlayer.player_id,
            name: topAppsPlayer.name,
            appearances: topApps?.appearances ?? 0,
          }
        : null,
      top_scorer: topGoalsPlayer
        ? {
            player_id: topGoalsPlayer.player_id,
            name: topGoalsPlayer.name,
            goals: topGoals?.goals ?? 0,
          }
        : null,
      championships: {
        count: championships.length,
        seasons: championships,
      },
      best_positions: {
        super: bestSuper,
        challenge: bestChallenge,
        cup: bestCup,
      },
      best_overall,
      // Backward compatibility
      best_position: best_overall.position,
    });
  } catch (error) {
    console.error('Error fetching team highlights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team highlights' },
      { status: 500 }
    );
  }
}
