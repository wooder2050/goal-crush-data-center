import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

function isLeague(category: string | null) {
  return (
    category === 'G_LEAGUE' ||
    category === 'SUPER_LEAGUE' ||
    category === 'CHALLENGE_LEAGUE' ||
    category === 'PLAYOFF' ||
    category === 'OTHER'
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ coachId: string }> }
) {
  try {
    const { coachId } = await params;
    const coachIdNum = Number(coachId);
    if (Number.isNaN(coachIdNum)) {
      return NextResponse.json({ error: 'Invalid coach ID' }, { status: 400 });
    }

    // Coach detail
    const coach = await prisma.coach.findUnique({
      where: { coach_id: coachIdNum },
      include: {
        team_coach_history: {
          include: { team: true, season: true },
          orderBy: [{ start_date: 'desc' }],
        },
        match_coaches: {
          include: {
            match: { include: { home_team: true, away_team: true } },
            team: true,
          },
          orderBy: [{ match: { match_date: 'asc' } }],
        },
      },
    });
    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    // Overview (season stats + trophies)
    const matchCoaches = await prisma.matchCoach.findMany({
      where: { coach_id: coachIdNum, role: 'head' },
      include: {
        match: { include: { home_team: true, away_team: true, season: true } },
        team: true,
      },
      orderBy: { match: { match_date: 'asc' } },
    });

    const seasonStats = new Map<
      number,
      {
        season_id: number;
        season_name: string;
        matches_played: number;
        wins: number;
        draws: number;
        losses: number;
        goals_for: number;
        goals_against: number;
        teams: Set<string>;
        teamIds: Set<number>;
        position?: number | null;
      }
    >();
    const uniqueMatchIds = new Set<number>();

    for (const mc of matchCoaches) {
      const { match, team } = mc;
      if (!match) continue;
      if (match.match_id) uniqueMatchIds.add(match.match_id);
      const seasonId = match.season_id;
      const seasonName = match.season?.season_name || 'Unknown';
      if (seasonId == null) continue;

      if (!seasonStats.has(seasonId)) {
        seasonStats.set(seasonId, {
          season_id: seasonId,
          season_name: seasonName,
          matches_played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goals_for: 0,
          goals_against: 0,
          teams: new Set(),
          teamIds: new Set<number>(),
          position: null,
        });
      }

      const stats = seasonStats.get(seasonId)!;
      stats.matches_played++;

      const isHomeTeam = match.home_team_id === team.team_id;
      const teamScore = isHomeTeam ? match.home_score : match.away_score;
      const opponentScore = isHomeTeam ? match.away_score : match.home_score;
      const pkTeam = isHomeTeam
        ? match.penalty_home_score
        : match.penalty_away_score;
      const pkOpp = isHomeTeam
        ? match.penalty_away_score
        : match.penalty_home_score;

      if (teamScore !== null && opponentScore !== null) {
        if (teamScore > opponentScore) {
          stats.wins++;
        } else if (teamScore < opponentScore) {
          stats.losses++;
        } else {
          if (pkTeam !== null && pkOpp !== null) {
            if (pkTeam > pkOpp) stats.wins++;
            else if (pkTeam < pkOpp) stats.losses++;
          }
        }

        stats.goals_for += teamScore;
        stats.goals_against += opponentScore;
      }

      if (team?.team_name) stats.teams.add(team.team_name);
      if (team?.team_id != null) stats.teamIds.add(team.team_id);
    }

    const statsArray = Array.from(seasonStats.values()).map((s) => ({
      ...s,
      teams: Array.from(s.teams),
      points: s.wins * 3 + s.draws,
      win_rate:
        s.matches_played > 0
          ? Math.round((s.wins / s.matches_played) * 100)
          : 0,
      goal_difference: s.goals_for - s.goals_against,
    }));

    await Promise.all(
      statsArray.map(async (s) => {
        const teamIds = Array.from(s.teamIds);
        if (teamIds.length === 0) {
          s.position = null;
          return;
        }
        const rows = await prisma.standing.findMany({
          where: { season_id: s.season_id, team_id: { in: teamIds } },
          select: { position: true },
        });
        const positions = rows
          .map((r) => r.position)
          .filter((p): p is number => typeof p === 'number');
        s.position = positions.length > 0 ? Math.min(...positions) : null;
      })
    );

    statsArray.sort((a, b) => {
      const yearA = parseInt(a.season_name.match(/\d+/)?.[0] || '0');
      const yearB = parseInt(b.season_name.match(/\d+/)?.[0] || '0');
      return yearB - yearA;
    });

    const total_matches = uniqueMatchIds.size;

    const wins = await prisma.standing.findMany({
      where: { position: 1 },
      include: { season: true, team: true },
    });

    const trophyItems: Array<{
      season_id: number;
      season_name: string;
      category: string | null;
    }> = [];
    for (const w of wins) {
      const count = await prisma.matchCoach.count({
        where: {
          coach_id: coachIdNum,
          role: 'head',
          team_id: w.team_id ?? undefined,
          match: { season_id: w.season_id ?? undefined },
        },
      });
      if (count > 0) {
        trophyItems.push({
          season_id: w.season_id!,
          season_name: w.season?.season_name ?? 'Unknown',
          category:
            (w.season as { category?: string } | null)?.category ?? null,
        });
      }
    }

    const filtered = trophyItems.filter((it) => {
      if (!it) return false;
      if (it.season_name?.includes('조별')) return false;
      if (it.category === 'PLAYOFF' || it.category === 'CHALLENGE_LEAGUE')
        return false;
      return true;
    });
    const league_wins = filtered.filter((i) => isLeague(i.category)).length;
    const cup_wins = filtered.length - league_wins;

    // Current team (verified) via Prisma introspected table
    const current_team_verified =
      await prisma.team_current_head_coach.findFirst({
        where: { coach_id: coachIdNum },
      });

    return NextResponse.json({
      coach,
      overview: {
        coach_id: coachIdNum,
        season_stats: statsArray,
        total_matches,
        trophies: {
          coach_id: coachIdNum,
          total: filtered.length,
          league_wins,
          cup_wins,
          items: filtered,
        },
      },
      current_team_verified,
    });
  } catch (error) {
    console.error('Failed to fetch full coach data', error);
    return NextResponse.json(
      { error: 'Failed to fetch full coach data' },
      { status: 500 }
    );
  }
}
