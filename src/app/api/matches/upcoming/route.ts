import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = Math.max(
      1,
      Math.min(Number(url.searchParams.get('limit')) || 6, 50)
    );
    const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);
    const teamId = url.searchParams.get('teamId');
    const seasonId = url.searchParams.get('seasonId');

    const now = new Date();

    const where: Prisma.MatchWhereInput = {
      match_date: { gt: now },
      home_score: null,
      away_score: null,
    };

    if (teamId) {
      const id = Number(teamId);
      if (!Number.isNaN(id)) {
        where.OR = [{ home_team_id: id }, { away_team_id: id }];
      }
    }

    if (seasonId) {
      const sid = Number(seasonId);
      if (!Number.isNaN(sid)) {
        where.season_id = sid;
      }
    }

    const rows = await prisma.match.findMany({
      where,
      include: {
        season: true,
        home_team: true,
        away_team: true,
      },
      orderBy: [{ match_date: 'asc' }],
      take: limit,
      skip: offset,
    });

    const items = rows.map((m) => ({
      match_id: m.match_id,
      match_date: m.match_date,
      description: m.description ?? null,
      season: m.season
        ? { season_id: m.season.season_id, season_name: m.season.season_name }
        : null,
      home: m.home_team
        ? {
            team_id: m.home_team.team_id,
            team_name: m.home_team.team_name,
            logo: m.home_team.logo ?? null,
          }
        : null,
      away: m.away_team
        ? {
            team_id: m.away_team.team_id,
            team_name: m.away_team.team_name,
            logo: m.away_team.logo ?? null,
          }
        : null,
    }));

    return NextResponse.json({ total: items.length, items });
  } catch (error) {
    console.error('Failed to fetch upcoming matches', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming matches' },
      { status: 500 }
    );
  }
}
