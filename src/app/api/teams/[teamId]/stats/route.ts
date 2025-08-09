import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/teams/[teamId]/stats - 특정 팀 통산 기록 (옵션: ?season_id=숫자)
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
    const seasonIdParam = url.searchParams.get('season_id');
    const seasonId = seasonIdParam ? parseInt(seasonIdParam) : undefined;

    const matches = await prisma.match.findMany({
      where: {
        AND: [
          seasonId ? { season_id: seasonId } : {},
          { OR: [{ home_team_id: teamId }, { away_team_id: teamId }] },
        ],
      },
      select: {
        home_team_id: true,
        away_team_id: true,
        home_score: true,
        away_score: true,
        penalty_home_score: true,
        penalty_away_score: true,
      },
      orderBy: { match_date: 'asc' },
    });

    let total = 0;
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    for (const m of matches) {
      total += 1;
      const isHome = m.home_team_id === teamId;
      const gf = isHome ? (m.home_score ?? 0) : (m.away_score ?? 0);
      const ga = isHome ? (m.away_score ?? 0) : (m.home_score ?? 0);
      goalsFor += gf;
      goalsAgainst += ga;

      if (gf > ga) {
        wins += 1;
        continue;
      }
      if (gf < ga) {
        losses += 1;
        continue;
      }

      // Regular-time draw: decide by penalty shootout if available
      const pf = isHome
        ? (m.penalty_home_score ?? null)
        : (m.penalty_away_score ?? null);
      const pa = isHome
        ? (m.penalty_away_score ?? null)
        : (m.penalty_home_score ?? null);

      if (pf !== null && pa !== null && (pf !== 0 || pa !== 0)) {
        if (pf > pa) wins += 1;
        else if (pf < pa) losses += 1;
        else draws += 1; // extremely rare, but guard just in case
      } else {
        // No penalty info: keep as draw
        draws += 1;
      }
    }

    const goalDiff = goalsFor - goalsAgainst;
    const points = wins * 3 + draws * 1;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    return NextResponse.json({
      matches: total,
      wins,
      draws,
      losses,
      goals_for: goalsFor,
      goals_against: goalsAgainst,
      goal_diff: goalDiff,
      points,
      win_rate: winRate,
    });
  } catch (error) {
    console.error('Error fetching team stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team stats' },
      { status: 500 }
    );
  }
}
