import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type AggregatedPlayer = {
  player_id: number;
  team_id: number;
  player_name: string;
  jersey_number: number | null;
  position: string;
  total_minutes: number;
};

const normalizePosition = (
  pos: string | null
): 'GK' | 'DF' | 'MF' | 'FW' | 'UNK' => {
  const p = (pos || '').toUpperCase();
  if (p.includes('GK') || p.includes('GOAL')) return 'GK';
  if (p.includes('DF') || p.includes('DEF')) return 'DF';
  if (p.includes('MF') || p.includes('MID')) return 'MF';
  if (p.includes('FW') || p.includes('FWD') || p.includes('FOR')) return 'FW';
  return 'UNK';
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { match_id: string } }
) {
  try {
    const matchId = Number(params.match_id);
    if (!Number.isFinite(matchId)) {
      return NextResponse.json({ error: 'Invalid match ID' }, { status: 400 });
    }

    const match = await prisma.match.findUnique({
      where: { match_id: matchId },
      select: {
        match_id: true,
        match_date: true,
        season_id: true,
        home_team_id: true,
        away_team_id: true,
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const currentDate = match.match_date
      ? new Date(match.match_date)
      : new Date();

    // Helper to build predicted lineup for one team
    const buildPredictedForTeam = async (
      teamId: number
    ): Promise<AggregatedPlayer[]> => {
      // Find recent matches for the team before current match date
      const recentMatches = await prisma.match.findMany({
        where: {
          match_date: { lt: currentDate },
          OR: [{ home_team_id: teamId }, { away_team_id: teamId }],
        },
        orderBy: { match_date: 'desc' },
        take: 10,
        select: { match_id: true },
      });
      const recentIds = recentMatches.map((m) => m.match_id);
      if (recentIds.length === 0) return [];

      // Aggregate minutes by player over recent matches
      const stats = await prisma.playerMatchStats.findMany({
        where: { team_id: teamId, match_id: { in: recentIds } },
        include: {
          player: {
            select: { player_id: true, name: true, jersey_number: true },
          },
        },
      });

      const aggMap = new Map<number, AggregatedPlayer>();
      for (const s of stats) {
        const pid = s.player_id as number | null;
        if (!pid) continue;
        const existing = aggMap.get(pid);
        const minutes = s.minutes_played ?? 0;
        const normPos = normalizePosition(s.position ?? null);
        if (existing) {
          existing.total_minutes += minutes || 0;
          // prefer non-UNK position if available
          if (existing.position === 'UNK' && normPos !== 'UNK')
            existing.position = normPos;
        } else {
          aggMap.set(pid, {
            player_id: pid,
            team_id: s.team_id ?? teamId,
            player_name: s.player?.name ?? 'Unknown',
            jersey_number: s.player?.jersey_number ?? null,
            position: normPos,
            total_minutes: minutes || 0,
          });
        }
      }

      const players = Array.from(aggMap.values());

      // Pick XI by simple heuristic: 1 GK, 4 DF, 4 MF, 2 FW (fallback with remaining by minutes)
      const byPos = {
        GK: players
          .filter((p) => p.position === 'GK')
          .sort((a, b) => b.total_minutes - a.total_minutes),
        DF: players
          .filter((p) => p.position === 'DF')
          .sort((a, b) => b.total_minutes - a.total_minutes),
        MF: players
          .filter((p) => p.position === 'MF')
          .sort((a, b) => b.total_minutes - a.total_minutes),
        FW: players
          .filter((p) => p.position === 'FW')
          .sort((a, b) => b.total_minutes - a.total_minutes),
        UNK: players
          .filter((p) => p.position === 'UNK')
          .sort((a, b) => b.total_minutes - a.total_minutes),
      } as const;

      const pick: AggregatedPlayer[] = [];
      const pushSome = (arr: AggregatedPlayer[], n: number) => {
        for (const p of arr) {
          if (pick.length >= 11) break;
          if (pick.find((x) => x.player_id === p.player_id)) continue;
          pick.push(p);
          if (pick.length >= 11) break;
          if (--n <= 0) break;
        }
      };

      pushSome(byPos.GK, 1);
      pushSome(byPos.DF, 4);
      pushSome(byPos.MF, 4);
      pushSome(byPos.FW, 2);

      // Fill remaining with best remaining players
      if (pick.length < 11) {
        const remaining = players
          .filter((p) => !pick.find((x) => x.player_id === p.player_id))
          .sort((a, b) => b.total_minutes - a.total_minutes);
        for (const p of remaining) {
          if (pick.length >= 11) break;
          pick.push(p);
        }
      }

      return pick;
    };

    const homeTeamId = match.home_team_id!;
    const awayTeamId = match.away_team_id!;
    const [homePred, awayPred] = await Promise.all([
      buildPredictedForTeam(homeTeamId),
      buildPredictedForTeam(awayTeamId),
    ]);

    const toLineup = (p: AggregatedPlayer) => ({
      stat_id: -1,
      match_id: match.match_id,
      player_id: p.player_id,
      team_id: p.team_id,
      goals: 0,
      assists: 0,
      yellow_cards: 0,
      red_cards: 0,
      minutes_played: 0,
      saves: 0,
      position: p.position,
      player_name: p.player_name,
      jersey_number: p.jersey_number,
      team_name: '',
      participation_status: 'starting',
      card_type: 'none',
    });

    const homeKey = `${match.match_id}_${homeTeamId}`;
    const awayKey = `${match.match_id}_${awayTeamId}`;
    const payload: Record<string, ReturnType<typeof toLineup>[]> = {
      [homeKey]: homePred.map(toLineup),
      [awayKey]: awayPred.map(toLineup),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error building predicted lineups:', error);
    return NextResponse.json(
      { error: 'Failed to build predicted lineups' },
      { status: 500 }
    );
  }
}
