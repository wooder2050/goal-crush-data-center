import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type PlayerAgg = {
  player_id: number;
  team_id: number;
  player_name: string;
  jersey_number: number | null;
  position: string | null;
  goals: number;
  assists: number;
  minutes: number;
  profile_image_url: string | null;
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
        home_team_id: true,
        away_team_id: true,
      },
    });
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const cutoff = match.match_date ? new Date(match.match_date) : new Date();

    const buildAgg = async (teamId: number): Promise<PlayerAgg[]> => {
      // 최근 10경기 집계 (현재 경기 이전)
      const recentMatches = await prisma.match.findMany({
        where: {
          match_date: { lt: cutoff },
          OR: [{ home_team_id: teamId }, { away_team_id: teamId }],
        },
        orderBy: { match_date: 'desc' },
        take: 10,
        select: { match_id: true },
      });
      const ids = recentMatches.map((m) => m.match_id);
      if (ids.length === 0) return [];

      const stats = await prisma.playerMatchStats.findMany({
        where: { team_id: teamId, match_id: { in: ids } },
        include: {
          player: {
            select: {
              player_id: true,
              name: true,
              jersey_number: true,
              profile_image_url: true,
            },
          },
        },
      });

      const agg = new Map<number, PlayerAgg>();
      for (const s of stats) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pid = (s as any).player_id as number | null;
        if (!pid) continue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const minutes = ((s as any).minutes_played ?? 0) as number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const goals = ((s as any).goals ?? 0) as number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const assists = ((s as any).assists ?? 0) as number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const position = ((s as any).position ?? null) as string | null;
        const exists = agg.get(pid);
        if (exists) {
          exists.minutes += minutes;
          exists.goals += goals;
          exists.assists += assists;
        } else {
          agg.set(pid, {
            player_id: pid,
            team_id: (s.team_id as number) ?? teamId,
            player_name: (s.player?.name as string) ?? 'Unknown',
            jersey_number: (s.player?.jersey_number as number) ?? null,
            position,
            goals,
            assists,
            minutes,
            profile_image_url: (s.player?.profile_image_url as string) ?? null,
          });
        }
      }

      // 정렬: (goals*2 + assists) desc, minutes desc
      const arr = Array.from(agg.values()).sort((a, b) => {
        const as = a.goals * 2 + a.assists;
        const bs = b.goals * 2 + b.assists;
        if (bs !== as) return bs - as;
        return b.minutes - a.minutes;
      });
      return arr.slice(0, 3);
    };

    const [home, away] = await Promise.all([
      buildAgg(match.home_team_id!),
      buildAgg(match.away_team_id!),
    ]);

    return NextResponse.json({
      match_id: match.match_id,
      home,
      away,
    });
  } catch (error) {
    console.error('Failed to fetch key players', error);
    return NextResponse.json(
      { error: 'Failed to fetch key players' },
      { status: 500 }
    );
  }
}
